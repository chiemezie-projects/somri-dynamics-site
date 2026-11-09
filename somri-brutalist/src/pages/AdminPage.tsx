import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCopy } from "@/components/copy-context"
import { BACKEND_MODE, ROLE_LABEL, may, store } from "@/lib/store"
import type { AppUser, Listing, Role, SiteCopy } from "@/lib/types"
import { DEFAULT_COPY } from "@/lib/content"
import { cn } from "@/lib/utils"

/* ================= login ================= */

function Login({ onOk }: { onOk: (u: AppUser) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      onOk(await store.signIn(email, password))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div>
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl border-2 border-ink bg-paper p-7 shadow-[10px_10px_0_0_#141414]"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-lg text-white shadow-[3px_3px_0_0_#141414]">S</span>
            <Badge variant="default">{BACKEND_MODE === "demo" ? "Demo store" : "Supabase"}</Badge>
          </div>
          <h1 className="mt-6 font-display text-3xl">Staff access.</h1>
          <p className="mt-1.5 text-sm text-grey">Sign in to manage listings, copy and accounts.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@somridynamics.com"
                className="mt-1 w-full rounded-lg border-2 border-ink bg-paper-2 px-3.5 py-2.5 text-sm outline-none focus:bg-paper focus:ring-2 focus:ring-accent"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">Password</span>
              <span className="relative mt-1 block">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border-2 border-ink bg-paper-2 px-3.5 py-2.5 pr-10 text-sm outline-none focus:bg-paper focus:ring-2 focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-grey hover:text-ink"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
            </label>

            {error && (
              <p className="rounded-md border-2 border-ink bg-paper-2 px-3 py-2 text-xs font-semibold text-[#b4522f]">{error}</p>
            )}

            <Button type="submit" variant="accent" className="w-full cursor-pointer" disabled={busy}>
              {busy ? "Verifying…" : "Sign in"}
              <ArrowUpRight className="size-4" />
            </Button>
          </form>

          {BACKEND_MODE === "demo" && (
            <div className="mt-6 rounded-lg border-2 border-ink/40 bg-paper-2 px-3.5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">Demo credentials</p>
              <p className="mt-1 text-xs">owner@somridynamics.com · somri-2026</p>
            </div>
          )}

          <p className="mt-6 border-t border-ink/20 pt-4 text-center">
            <Link to="/listings" className="text-xs font-semibold uppercase tracking-[0.1em] text-accent hover:underline">Public listings</Link>
            <span className="px-2 text-grey">·</span>
            <Link to="/" className="text-xs font-semibold uppercase tracking-[0.1em] text-ink hover:text-accent">Back to site</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ================= small field atoms ================= */

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  multiline?: boolean
  type?: string
}) {
  return (
    <label className="block">
      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-grey">{label}</span>
      {multiline ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink/40 bg-paper px-2.5 py-2 text-sm outline-none focus:border-accent"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink/40 bg-paper px-2.5 py-2 text-sm outline-none focus:border-accent"
        />
      )}
    </label>
  )
}

/* generic immutable path setter for copy editing (array-aware) */
function setPath<T extends object>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".")
  const [next, ...rest] = keys
  if (Array.isArray(obj)) {
    const copy = obj.slice()
    const i = Number(next)
    copy[i] = rest.length === 0 ? value : setPath(copy[i] as object, rest.join("."), value)
    return copy as unknown as T
  }
  if (rest.length === 0) return { ...obj, [next]: value }
  return { ...obj, [next]: setPath((obj as Record<string, unknown>)[next] as object, rest.join("."), value) }
}

/* ================= listings panel ================= */

const CATS: Listing["category"][] = ["foodstuff", "devices", "accessories", "autos", "real-estate"]

function emptyListing(): Listing {
  return {
    id: crypto.randomUUID(),
    title: "",
    category: "foodstuff",
    price: "",
    currency: "₦",
    description: "",
    image: "",
    location: "Lagos, Nigeria",
    status: "available",
    featured: false,
    whatsapp: "2348036150593",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function ListingsPanel() {
  const [items, setItems] = useState<Listing[]>([])
  const [draft, setDraft] = useState<Listing | null>(null)

  const load = () => store.listListings().then(setItems)
  useEffect(() => { void load() }, [])

  async function save() {
    if (!draft) return
    await store.saveListing({ ...draft, updated_at: new Date().toISOString() })
    setDraft(null)
    await load()
  }
  async function del(id: string) {
    if (!confirm("Remove this listing from the register?")) return
    await store.deleteListing(id)
    await load()
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey">
          {items.length} listings on the register
        </p>
        <Button size="sm" variant="accent" className="cursor-pointer" onClick={() => setDraft(emptyListing())}>
          <Plus className="size-4" /> New listing
        </Button>
      </div>

      {/* table (desktop) */}
      <div className="hidden overflow-hidden rounded-lg border-2 border-ink md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink bg-paper-2 text-left text-[10px] uppercase tracking-[0.12em] text-grey">
              <th className="px-4 py-2.5 font-semibold">Item</th>
              <th className="px-4 py-2.5 font-semibold">Line</th>
              <th className="px-4 py-2.5 font-semibold">Price</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Featured</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="border-b border-ink/15 last:border-0">
                <td className="px-4 py-2.5 font-medium">{l.title || <span className="text-grey">Untitled</span>}</td>
                <td className="px-4 py-2.5 text-xs text-grey">{l.category}</td>
                <td className="px-4 py-2.5 tabular-nums">{l.currency}{l.price}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={l.status === "available" ? "accent" : l.status === "sold" ? "default" : "outline"}>{l.status}</Badge>
                </td>
                <td className="px-4 py-2.5">{l.featured ? "★" : "—"}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="sm" variant="ghost" className="cursor-pointer h-7" onClick={() => setDraft(l)}>Edit</Button>
                  <Button size="sm" variant="ghost" className="h-7 cursor-pointer text-[#b4522f] hover:bg-[#fceee8]" onClick={() => void del(l.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-grey">No listings yet — add the first one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="space-y-3 md:hidden">
        {items.map((l) => (
          <div key={l.id} className="rounded-lg border-2 border-ink p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-lg">{l.title}</p>
              <Badge variant={l.status === "available" ? "accent" : "outline"}>{l.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-grey">{l.category} · {l.currency}{l.price}{l.featured ? " · ★ featured" : ""}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 cursor-pointer" onClick={() => setDraft(l)}>Edit</Button>
              <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => void del(l.id)}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-8 text-center text-grey">No listings yet.</p>}
      </div>

      {/* editor drawer */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6" onClick={() => setDraft(null)}>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-t-xl border-2 border-ink bg-paper p-6 sm:rounded-xl sm:shadow-[10px_10px_0_0_#141414]"
          >
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <h3 className="font-display text-2xl">{draft.title ? "Edit listing" : "New listing"}</h3>
              <button onClick={() => setDraft(null)} className="cursor-pointer text-grey hover:text-ink"><X className="size-5" /></button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
              </div>
              <label className="block">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-grey">Trade line</span>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value as Listing["category"] })}
                  className="mt-1 w-full rounded-md border border-ink/40 bg-paper px-2.5 py-2 text-sm outline-none focus:border-accent"
                >
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-grey">Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as Listing["status"] })}
                  className="mt-1 w-full rounded-md border border-ink/40 bg-paper px-2.5 py-2 text-sm outline-none focus:border-accent"
                >
                  {(["available", "reserved", "sold"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-[70px_1fr] gap-2">
                <Field label="Cur." value={draft.currency} onChange={(v) => setDraft({ ...draft, currency: v })} />
                <Field label="Price" value={draft.price} onChange={(v) => setDraft({ ...draft, price: v })} />
              </div>
              <Field label="Location" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
              <div className="sm:col-span-2">
                <Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} multiline />
              </div>
              <div className="sm:col-span-2">
                <Field label="Image URL (optional)" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
              </div>
              <Field label="WhatsApp number (digits only)" value={draft.whatsapp} onChange={(v) => setDraft({ ...draft, whatsapp: v.replace(/\D/g, "") })} />
              <label className="flex items-end gap-2.5 pb-1 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="size-4 accent-[#6d28d9]"
                />
                Featured on public listings
              </label>
            </div>

            <div className="mt-6 flex gap-3 border-t-2 border-ink pt-4">
              <Button variant="accent" className="flex-1 cursor-pointer" onClick={() => void save()}>
                <CheckCircle2 className="size-4" /> Save to register
              </Button>
              <Button variant="ghost" className="cursor-pointer" onClick={() => setDraft(null)}>Cancel</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

/* ================= copy (CMS) panel ================= */

function CopyPanel() {
  const { copy: liveCopy, refresh } = useCopy()
  const [draft, setDraft] = useState<SiteCopy>(() => structuredClone(liveCopy))
  const [saved, setSaved] = useState(false)
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(liveCopy), [draft, liveCopy])

  const g = (path: string) => path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], draft)
  const s = (path: string, v: unknown) => setDraft(setPath(draft, path, v))

  async function save() {
    await store.saveCopy(draft)
    await refresh()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  function resetDefaults() {
    setDraft(structuredClone(DEFAULT_COPY))
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="rounded-lg border-2 border-ink bg-paper p-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">{title}</p>
        <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-[68px] z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-ink bg-paper-2 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">Editorial control — every string on the public site</p>
        <div className="flex items-center gap-2">
          {dirty && <Badge variant="accent">Unsaved</Badge>}
          {!dirty && saved && <Badge variant="soft">Saved ✓</Badge>}
          <Button size="sm" variant="ghost" className="cursor-pointer" onClick={resetDefaults}>Defaults</Button>
          <Button size="sm" variant="accent" className="cursor-pointer" disabled={!dirty} onClick={() => void save()}>
            Publish copy
          </Button>
        </div>
      </div>

      <Section title="Brand & utility">
        <Field label="Brand name" value={g("brand.name") as string} onChange={(v) => s("brand.name", v)} />
        <Field label="Utility left" value={g("utility.left") as string} onChange={(v) => s("utility.left", v)} />
        <Field label="Utility coordinates" value={g("utility.coords") as string} onChange={(v) => s("utility.coords", v)} />
        <Field label="Utility right" value={g("utility.right") as string} onChange={(v) => s("utility.right", v)} />
      </Section>

      <Section title="Hero">
        <Field label="Eyebrow" value={g("hero.eyebrow") as string} onChange={(v) => s("hero.eyebrow", v)} />
        <Field label="Headline line 1" value={g("hero.line1") as string} onChange={(v) => s("hero.line1", v)} />
        <Field label="Accent word" value={g("hero.accentWord") as string} onChange={(v) => s("hero.accentWord", v)} />
        <Field label="Headline line 2" value={g("hero.line2") as string} onChange={(v) => s("hero.line2", v)} />
        <div className="sm:col-span-2">
          <Field label="Body copy" value={g("hero.body") as string} onChange={(v) => s("hero.body", v)} multiline />
        </div>
        <Field label="Button — primary" value={g("hero.ctaPrimary") as string} onChange={(v) => s("hero.ctaPrimary", v)} />
        <Field label="Button — secondary" value={g("hero.ctaSecondary") as string} onChange={(v) => s("hero.ctaSecondary", v)} />
        <Field label="Status label" value={g("hero.statusLabel") as string} onChange={(v) => s("hero.statusLabel", v)} />
        <Field label="Status value" value={g("hero.statusValue") as string} onChange={(v) => s("hero.statusValue", v)} />
        <Field label="Est. tag" value={g("hero.estTag") as string} onChange={(v) => s("hero.estTag", v)} />
      </Section>

      <Section title="Figures (counters)">
        {(["0", "1", "2", "3"] as const).map((i) => (
          <div key={i} className="grid grid-cols-[64px_64px_1fr] gap-2">
            <Field label={`Value ${+i + 1}`} type="number" value={((g(`figures.${i}.n`) as number) ?? 0)} onChange={(v) => s(`figures.${i}.n`, Number(v) || 0)} />
            <Field label="Suffix" value={g(`figures.${i}.suffix`) as string} onChange={(v) => s(`figures.${i}.suffix`, v)} />
            <Field label="Label" value={g(`figures.${i}.label`) as string} onChange={(v) => s(`figures.${i}.label`, v)} />
          </div>
        ))}
      </Section>

      <Section title="Marquee (comma-separated)">
        <div className="sm:col-span-2">
          <Field
            label="Items"
            value={(g("marquee") as string[]).join(", ")}
            onChange={(v) => s("marquee", v.split(",").map((x) => x.trim()).filter(Boolean))}
          />
        </div>
      </Section>

      <Section title="Trade register header">
        <Field label="Title" value={g("divisionsHead.title") as string} onChange={(v) => s("divisionsHead.title", v)} />
        <Field label="Hint" value={g("divisionsHead.hint") as string} onChange={(v) => s("divisionsHead.hint", v)} />
        <div className="sm:col-span-2">
          <Field label="Blurb" value={g("divisionsHead.blurb") as string} onChange={(v) => s("divisionsHead.blurb", v)} multiline />
        </div>
      </Section>

      {draft.divisions.map((d, i) => (
        <Section key={d.id} title={`Division ${d.id}`}>
          <Field label="ID" value={d.id} onChange={(v) => s(`divisions.${i}.id`, v)} />
          <Field label="Name" value={d.name} onChange={(v) => s(`divisions.${i}.name`, v)} />
          <Field label="Spec line" value={d.spec} onChange={(v) => s(`divisions.${i}.spec`, v)} />
          <Field
            label="Items (comma-separated)"
            value={d.items.join(", ")}
            onChange={(v) => s(`divisions.${i}.items`, v.split(",").map((x) => x.trim()).filter(Boolean))}
          />
          <div className="sm:col-span-2">
            <Field label="Description" value={d.desc} onChange={(v) => s(`divisions.${i}.desc`, v)} multiline />
          </div>
        </Section>
      ))}

      <Section title="The proprietor">
        <Field label="Window no." value={g("proprietor.windowNo") as string} onChange={(v) => s("proprietor.windowNo", v)} />
        <Field label="Monogram" value={g("proprietor.monogram") as string} onChange={(v) => s("proprietor.monogram", v)} />
        <Field label="Registration line" value={g("proprietor.regLine") as string} onChange={(v) => s("proprietor.regLine", v)} />
        <Field label="Name" value={g("proprietor.name") as string} onChange={(v) => s("proprietor.name", v)} />
        <Field label="Role line" value={g("proprietor.role") as string} onChange={(v) => s("proprietor.role", v)} />
        {(["0", "1", "2"] as const).map((i) => (
          <Field key={i} label={`Quote line ${+i + 1}`} value={g(`proprietor.quote.${i}`) as string} onChange={(v) => s(`proprietor.quote.${i}`, v)} />
        ))}
        <div className="sm:col-span-2">
          <Field label="Statement" value={g("proprietor.body") as string} onChange={(v) => s("proprietor.body", v)} multiline />
        </div>
      </Section>

      <Section title="Standard procedure">
        {draft.procedure.steps.map((st, i) => (
          <div key={st.no} className="grid grid-cols-[56px_1fr] gap-2 sm:col-span-2">
            <Field label="No." value={st.no} onChange={(v) => s(`procedure.steps.${i}.no`, v)} />
            <div className="space-y-2">
              <Field label="Title" value={st.title} onChange={(v) => s(`procedure.steps.${i}.title`, v)} />
              <Field label="Body" value={st.body} onChange={(v) => s(`procedure.steps.${i}.body`, v)} multiline />
            </div>
          </div>
        ))}
      </Section>

      <Section title="House doctrine">
        {doctrineLines(draft).map((line, i) => (
          <Field key={i} label={`Line ${i + 1}`} value={line} onChange={(v) => s(`doctrine.lines.${i}`, v)} />
        ))}
        {draft.doctrine.cards.map((c, i) => (
          <div key={i} className="space-y-2 sm:col-span-2">
            <Field label={`Card ${i + 1} title`} value={c.title} onChange={(v) => s(`doctrine.cards.${i}.title`, v)} />
            <Field label={`Card ${i + 1} body`} value={c.body} onChange={(v) => s(`doctrine.cards.${i}.body`, v)} multiline />
          </div>
        ))}
      </Section>

      <Section title="Case testimony">
        {draft.testimony.items.map((t, i) => (
          <div key={i} className="grid gap-2 sm:col-span-2">
            <div className="grid grid-cols-2 gap-2">
              <Field label={`Ref ${i + 1}`} value={t.ref} onChange={(v) => s(`testimony.items.${i}.ref`, v)} />
              <Field label="Who" value={t.who} onChange={(v) => s(`testimony.items.${i}.who`, v)} />
            </div>
            <Field label="Route" value={t.route} onChange={(v) => s(`testimony.items.${i}.route`, v)} />
            <Field label="Body" value={t.body} onChange={(v) => s(`testimony.items.${i}.body`, v)} multiline />
          </div>
        ))}
      </Section>

      <Section title="Contact">
        <Field label="Headline line 1" value={g("contact.line1") as string} onChange={(v) => s("contact.line1", v)} />
        <Field label="Accent word" value={g("contact.accent") as string} onChange={(v) => s("contact.accent", v)} />
        <div className="sm:col-span-2">
          <Field label="Body copy" value={g("contact.body") as string} onChange={(v) => s("contact.body", v)} multiline />
        </div>
        {draft.contact.channels.map((ch, i) => (
          <div key={i} className="grid gap-2 sm:col-span-2">
            <div className="grid grid-cols-[110px_1fr] gap-2">
              <Field label="Label" value={ch.label} onChange={(v) => s(`contact.channels.${i}.label`, v)} />
              <Field label="Value" value={ch.value} onChange={(v) => s(`contact.channels.${i}.value`, v)} />
            </div>
            <Field label="Link (href)" value={ch.href} onChange={(v) => s(`contact.channels.${i}.href`, v)} />
          </div>
        ))}
        <Field label="Response label" value={g("contact.response.label") as string} onChange={(v) => s("contact.response.label", v)} />
        <Field label="Response value" value={g("contact.response.value") as string} onChange={(v) => s("contact.response.value", v)} />
      </Section>

      <Section title="Footer">
        <div className="sm:col-span-2">
          <Field label="About line" value={g("footer.about") as string} onChange={(v) => s("footer.about", v)} multiline />
        </div>
        {draft.footer.firm.map((f, i) => (
          <div key={i} className="grid grid-cols-[130px_1fr] gap-2">
            <Field label="Key" value={f.key} onChange={(v) => s(`footer.firm.${i}.key`, v)} />
            <Field label="Value" value={f.value} onChange={(v) => s(`footer.firm.${i}.value`, v)} />
          </div>
        ))}
        <Field label="Giant logotype" value={g("footer.giant") as string} onChange={(v) => s("footer.giant", v)} />
        <Field label="Legal — right" value={g("footer.legalRight") as string} onChange={(v) => s("footer.legalRight", v)} />
      </Section>
    </div>
  )
}

function doctrineLines(c: SiteCopy): string[] {
  return c.doctrine.lines
}

/* ================= users (access) panel ================= */

function UsersPanel({ me }: { me: AppUser }) {
  const [users, setUsers] = useState<AppUser[]>([])
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "editor" as Role })
  const [err, setErr] = useState<string | null>(null)

  const load = () => store.listUsers().then(setUsers)
  useEffect(() => { void load() }, [])

  async function add() {
    setErr(null)
    try {
      await store.createUser(form.email, form.password, form.name, form.role)
      setForm({ email: "", password: "", name: "", role: "editor" })
      await load()
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not create user")
    }
  }
  async function role(u: AppUser, r: Role) {
    await store.setUserRole(u.id, r)
    await load()
  }
  async function del(u: AppUser) {
    if (u.id === me.id) return
    if (!confirm(`Remove access for ${u.email}?`)) return
    await store.removeUser(u.id)
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-ink bg-paper-2 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">
          Roles — <b className="text-ink">Owner</b>: everything · <b className="text-ink">Admin</b>: listings + copy · <b className="text-ink">Editor</b>: listings only
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-ink">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/15 px-4 py-3 last:border-0">
            <div>
              <p className="text-sm font-bold">{u.name || u.email}</p>
              <p className="text-xs text-grey">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                <button
                  key={r}
                  disabled={u.id === me.id && r !== me.role}
                  onClick={() => void role(u, r)}
                  className={cn(
                    "cursor-pointer rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors",
                    u.role === r ? "border-ink bg-ink text-paper" : "border-ink/30 text-grey hover:border-ink",
                    u.id === me.id && "cursor-not-allowed opacity-60"
                  )}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
              {u.id !== me.id && (
                <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => void del(u)}>
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {BACKEND_MODE === "demo" ? (
        <div className="rounded-lg border-2 border-ink bg-paper p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">Add account</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <label className="block">
              <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-grey">Role</span>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="mt-1 w-full rounded-md border border-ink/40 bg-paper px-2.5 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="editor">Editor — listings only</option>
                <option value="admin">Admin — listings + copy</option>
                <option value="owner">Owner — everything</option>
              </select>
            </label>
          </div>
          {err && <p className="mt-3 text-xs font-bold text-[#b4522f]">{err}</p>}
          <Button size="sm" variant="accent" className="mt-4 cursor-pointer" onClick={() => void add()}>
            <Plus className="size-4" /> Create account
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-ink/40 bg-paper-2 px-4 py-3 text-xs text-grey">
          <Database className="mb-1 inline size-3.5" /> Supabase mode — accounts are invited from the Supabase
          dashboard (Authentication → Users), then assign their role here. Deleting a profile here removes
          site access.
        </div>
      )}
    </div>
  )
}

/* ================= dashboard shell ================= */

function Dashboard({ user, onLeave }: { user: AppUser; onLeave: () => void }) {
  const tabs = (
    [
      { id: "listings", label: "Listings", ok: may(user.role, "listings") },
      { id: "copy", label: "Website copy", ok: may(user.role, "copy") },
      { id: "users", label: "Access", ok: may(user.role, "users") },
    ] as const
  ).filter((t) => t.ok)

  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>(tabs[0].id)

  async function signOut() {
    await store.signOut()
    onLeave()
  }

  return (
    <div className="min-h-screen bg-paper-2 text-ink">
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-base text-white shadow-[3px_3px_0_0_#141414]">S</span>
            <span className="font-display text-lg">Somri <span className="text-accent">CRM</span></span>
          </Link>
          <Badge variant="accent">{ROLE_LABEL[user.role]}</Badge>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/listings">
              <Button size="sm" variant="ghost" className="h-10 cursor-pointer">Listings page</Button>
            </Link>
            <Link to="/">
              <Button size="sm" variant="outline" className="h-10 cursor-pointer"><ArrowLeft className="size-4" /> Site</Button>
            </Link>
            <Button size="sm" variant="default" className="h-10 cursor-pointer" onClick={() => void signOut()}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
        {/* tab bar */}
        <div className="mx-auto flex max-w-[1440px] gap-2 px-4 pb-3 sm:px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "cursor-pointer rounded-lg border-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
                tab === t.id
                  ? "border-ink bg-accent text-white shadow-[3px_3px_0_0_#141414]"
                  : "border-ink/25 bg-paper hover:border-ink"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        {tab === "listings" && <ListingsPanel />}
        {tab === "copy" && <CopyPanel />}
        {tab === "users" && <UsersPanel me={user} />}
      </main>
    </div>
  )
}

/* ================= page root ================= */

export default function AdminPage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    store.getSession().then(setUser).finally(() => setBooting(false))
  }, [])

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <p className="animate-pulse text-sm font-semibold uppercase tracking-[0.2em] text-grey">Checking session…</p>
      </div>
    )
  }

  return user
    ? <Dashboard user={user} onLeave={() => setUser(null)} />
    : <Login onOk={setUser} />
}

