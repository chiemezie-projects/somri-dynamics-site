import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Wheat,
  Smartphone,
  Headphones,
  Car,
  Building2,
  MessageCircle,
  Phone,
  Mail,
  ShieldCheck,
  Globe2,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCopy } from "@/components/copy-context"
import {
  LineReveal,
  Reveal,
  Magnetic,
  Counter,
  Pressable,
  EASE,
} from "@/components/motion-primitives"
import type { SiteCopy } from "@/lib/types"

/* ================= copy-driven data ================= */

const DIVISION_ICONS: LucideIcon[] = [Wheat, Smartphone, Headphones, Car, Building2]

const CHANNEL_ICONS: Record<"whatsapp" | "phone" | "mail", LucideIcon> = {
  whatsapp: MessageCircle,
  phone: Phone,
  mail: Mail,
}

const CARD_ICONS: Record<"shield" | "globe" | "chat", LucideIcon> = {
  shield: ShieldCheck,
  globe: Globe2,
  chat: MessagesSquare,
}

/* in-page scroll helper — plain #anchors would fight HashRouter */
const go = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })

/* render `"to the world."` as plain text + a stamped last word */
function line2Parts(line: string): [string, string] {
  const i = line.lastIndexOf(" ")
  return i >= 0 ? [line.slice(0, i + 1), line.slice(i + 1)] : ["", line]
}

/* ================= ATOMS ================= */

function SectionHead({
  index,
  title,
  right,
  dark = false,
}: {
  index: string
  title: string
  right?: string
  dark?: boolean
}) {
  return (
    <Reveal>
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b-2 pb-5",
          dark ? "border-paper/25" : "border-ink"
        )}
      >
        <div className="flex items-center gap-4">
          <Badge variant="accent">{index}</Badge>
          <h2 className="font-display text-2xl sm:text-3xl">{title}</h2>
        </div>
        {right && (
          <span
            className={cn(
              "hidden text-[11px] font-semibold uppercase tracking-[0.14em] sm:block",
              dark ? "text-paper/50" : "text-grey"
            )}
          >
            {right}
          </span>
        )}
      </div>
    </Reveal>
  )
}

/* ================= SECTIONS ================= */

function UtilityBar({ copy }: { copy: SiteCopy }) {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3">
        <div className="border-r-2 border-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]">
          {copy.utility.left}
        </div>
        <div className="hidden border-r-2 border-ink px-4 py-1.5 text-right text-[11px] font-medium uppercase tracking-[0.1em] text-grey sm:block">
          {copy.utility.coords}
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]">
          <span className="inline-block size-2 animate-blink rounded-full bg-accent" />
          {copy.utility.right}
        </div>
      </div>
    </div>
  )
}

function Nav() {
  const items = [
    { label: "Divisions", id: "divisions" },
    { label: "Proprietor", id: "proprietor" },
    { label: "Procedure", id: "procedure" },
    { label: "Testimony", id: "testimony" },
  ]
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => go("top")} className="flex cursor-pointer items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-base text-white shadow-[3px_3px_0_0_#141414]">
            S
          </span>
          <span className="font-display text-xl">
            Somri <span className="text-accent">Dynamics</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className="cursor-pointer rounded-lg px-3.5 py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-paper-2 hover:text-accent"
            >
              {n.label}
            </button>
          ))}
          <Link to="/listings" className="ml-1">
            <Button variant="ghost" size="sm" className="h-10 cursor-pointer">
              Listings
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="h-10 cursor-pointer">
              Staff
            </Button>
          </Link>
          <span className="ml-2">
            <Button variant="accent" size="sm" className="h-10 cursor-pointer" onClick={() => go("contact")}>
              Start Order
              <ArrowUpRight className="size-4" />
            </Button>
          </span>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/listings">
            <Button variant="ghost" size="sm" className="h-10 cursor-pointer">
              Listings
            </Button>
          </Link>
          <Button variant="accent" size="sm" className="h-10 cursor-pointer" onClick={() => go("contact")}>
            Contact
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

function Hero({ copy }: { copy: SiteCopy }) {
  const [plain, stamped] = line2Parts(copy.hero.line2)
  return (
    <section id="top" className="relative overflow-hidden border-b-2 border-ink">
      <div className="bg-blueprint absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid lg:grid-cols-12">
          {/* headline */}
          <div className="px-5 py-12 sm:px-8 lg:col-span-8 lg:border-r-2 lg:border-ink lg:py-20">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2.5 w-10 rounded-full bg-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey">
                {copy.hero.eyebrow}
              </span>
            </div>
            <h1 className="mt-7 font-display leading-[1.02] [font-size:clamp(2.9rem,7.5vw,6.25rem)]">
              <LineReveal delay={0.05}>{copy.hero.line1}</LineReveal>
              <LineReveal delay={0.15}>
                <span className="text-accent">{copy.hero.accentWord}</span>
                <span className="align-top text-[0.4em] font-semibold text-grey">™</span>{" "}
                {plain}
                <motion.span
                  className="inline-block -rotate-2 rounded-md bg-accent px-4 py-1 text-white"
                  initial={{ scaleY: 0.6, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.7 }}
                >
                  {stamped}
                </motion.span>
              </LineReveal>
            </h1>
            <p className="mt-8 max-w-[58ch] text-lg text-ink-2">{copy.hero.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Button size="lg" variant="accent" className="cursor-pointer" onClick={() => go("contact")}>
                  {copy.hero.ctaPrimary}
                  <ArrowUpRight className="size-4" />
                </Button>
              </Magnetic>
              <Button size="lg" variant="outline" className="cursor-pointer" onClick={() => go("divisions")}>
                {copy.hero.ctaSecondary}
              </Button>
            </div>
          </div>

          {/* dossier card */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col bg-paper-2 lg:bg-paper">
              <div className="border-b-2 border-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">
                Firm dossier — SD/LA/2026
              </div>
              <dl className="flex flex-1 flex-col">
                {copy.hero.dossier.map((row, i) => (
                  <div
                    key={row.key}
                    className={cn(
                      "flex flex-1 items-center justify-between gap-4 px-5 py-4",
                      i !== copy.hero.dossier.length - 1 && "border-b border-ink/15"
                    )}
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{row.key}</dt>
                    <dd className="text-right font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between border-t-2 border-ink bg-accent px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">
                    {copy.hero.statusLabel}
                  </p>
                  <p className="font-display text-2xl">{copy.hero.statusValue}</p>
                </div>
                <span className="inline-block size-2.5 animate-blink rounded-full bg-white" />
              </div>
              <div className="flex items-center justify-between border-t-2 border-ink px-5 py-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">
                  {copy.hero.estTag}
                </span>
                <div className="barcode h-4 w-24 text-ink" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        {/* figures */}
        <div className="grid grid-cols-2 border-t-2 border-ink lg:grid-cols-4">
          {copy.figures.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "px-5 py-7 sm:px-8",
                i !== copy.figures.length - 1 && "lg:border-r-2 lg:border-ink",
                i < 2 && "max-lg:border-b-2 max-lg:border-ink"
              )}
            >
              <p className="font-display text-5xl sm:text-6xl">
                <Counter to={f.n} suffix={f.suffix} />
              </p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-grey">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Marquee({ items }: { items: string[] }) {
  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="mx-7 flex items-center gap-14 text-2xl font-bold tracking-[0.02em]">
          {t}
          <span className="text-accent">✳</span>
        </span>
      ))}
    </>
  )
  return (
    <div className="group overflow-hidden border-b-2 border-ink bg-ink py-3.5 text-paper">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>{row}</div>
      </div>
    </div>
  )
}

/* ---------- divisions: expandable register table ---------- */

function DivisionRow({
  d,
  icon: Icon,
  open,
  onToggle,
}: {
  d: SiteCopy["divisions"][number]
  icon: LucideIcon
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: EASE }}
      className={cn("border-b-2 border-ink transition-colors", open && "bg-paper-2")}
    >
      <div className="group relative grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 sm:grid-cols-[64px_84px_1fr_auto] sm:gap-6 sm:px-8">
        {/* purple wipe */}
        <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-400 ease-out group-hover:scale-x-100" />
        <span className="relative hidden text-xs font-bold tracking-[0.14em] text-grey transition-colors group-hover:text-white/80 sm:block">
          {d.id}
        </span>
        <span
          className={cn(
            "relative hidden size-14 place-items-center rounded-lg border-2 border-ink/25 transition-colors duration-300 group-hover:border-white/50 group-hover:text-white sm:grid",
            "max-sm:hidden"
          )}
        >
          <Icon className="size-6" />
        </span>
        <span className="relative">
          <h3 className="font-display text-2xl transition-colors group-hover:text-white sm:text-4xl">
            {d.name}
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey transition-colors group-hover:text-white/80">
            {d.spec}
          </span>
        </span>
        <Plus
          className={cn(
            "relative size-5 shrink-0 transition-all duration-300 group-hover:text-white",
            open && "rotate-45"
          )}
        />
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`Toggle ${d.name}`}
          className="absolute inset-0 z-10 cursor-pointer"
        />
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden border-t-2 border-ink"
          >
            <div className="grid gap-5 bg-paper-2 px-5 py-6 sm:grid-cols-[auto_1fr] sm:px-8">
              <ArrowDownRight className="hidden size-9 shrink-0 text-accent sm:block" />
              <div className="max-w-[70ch] space-y-5">
                <p className="text-base text-ink-2">{d.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {d.items.map((item) => (
                    <Badge key={item} variant="default">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Divisions({ copy }: { copy: SiteCopy }) {
  const [openId, setOpenId] = useState<string | null>(copy.divisions[0]?.id ?? null)
  return (
    <section id="divisions" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <SectionHead index={copy.divisionsHead.index} title={copy.divisionsHead.title} />
            <p className="mt-5 max-w-[52ch] text-ink-2">{copy.divisionsHead.blurb}</p>
          </div>
          <Badge variant="outline">{copy.divisionsHead.hint}</Badge>
        </div>
      </div>
      <div className="border-t-2 border-ink">
        {copy.divisions.map((d, i) => (
          <DivisionRow
            key={d.id}
            d={d}
            icon={DIVISION_ICONS[i % DIVISION_ICONS.length]}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
          />
        ))}
      </div>
    </section>
  )
}

/* ---------- proprietor ---------- */

function Proprietor({ copy }: { copy: SiteCopy }) {
  const p = copy.proprietor
  return (
    <section id="proprietor" className="border-b-2 border-ink bg-paper-2">
      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 pt-16 sm:px-8">
          <SectionHead index={p.index} title={p.title} right={p.right} />
        </div>
        <div className="grid lg:grid-cols-12">
          {/* nameplate */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:col-span-5 lg:border-r-2 lg:border-ink lg:p-14">
            <Reveal className="w-full max-w-sm">
              <Card className="shadow-[8px_8px_0_0_#141414]">
                <div className="stamp mx-6 mt-6 rounded-md bg-accent px-4 pb-3 pt-4 text-center text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">{p.windowNo}</p>
                  <p className="font-display text-5xl leading-none">{p.monogram}</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">{p.regLine}</p>
                </div>
                <CardContent className="space-y-1 pt-6">
                  <p className="font-display text-3xl leading-tight">{p.name}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">{p.role}</p>
                </CardContent>
                <div className="flex items-center justify-between border-t-2 border-ink px-5 py-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{p.signatory}</span>
                  <span className="text-lg font-semibold italic text-accent">C.G.U.</span>
                </div>
              </Card>
            </Reveal>
          </div>

          {/* statement */}
          <div className="px-5 py-12 sm:px-8 lg:col-span-7 lg:py-16">
            <Reveal>
              <blockquote className="font-display text-3xl leading-[1.1] sm:text-5xl">
                {p.quote.map((line, i) => (
                  <p key={i} className={cn(i === 1 && "text-accent")}>{line}</p>
                ))}
              </blockquote>
              <p className="mt-8 max-w-[56ch] text-lg text-ink-2">{p.body}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {p.chips.map((c) => (
                  <div key={c.key} className="rounded-lg border-2 border-ink bg-paper px-4 py-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{c.key}</p>
                    <p className="mt-1 font-semibold">{c.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- procedure ---------- */

function Procedure({ copy }: { copy: SiteCopy }) {
  const pr = copy.procedure
  return (
    <section id="procedure" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <SectionHead index={pr.index} title={pr.title} right={pr.right} />
      </div>
      <div className="mx-auto grid max-w-[1440px] sm:grid-cols-2 lg:grid-cols-4">
        {pr.steps.map((s, i) => (
          <Reveal
            key={s.no}
            delay={i * 0.08}
            className={cn(
              "min-h-[260px] p-6 sm:p-8",
              i !== pr.steps.length - 1 && "lg:border-r-2 lg:border-ink",
              i % 2 === 0 && "sm:border-r-2 sm:border-ink",
              "max-sm:border-b-2 max-sm:border-ink",
              i < 2 && "max-lg:border-b-2 max-lg:border-ink"
            )}
          >
            <motion.div
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex h-full flex-col"
            >
              <span className="inline-flex w-fit items-center rounded-md border-2 border-ink px-2 py-0.5 text-xs font-bold text-accent">
                /{s.no}
              </span>
              <h3 className="mt-5 font-display text-3xl">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-2">{s.body}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- doctrine (dark) ---------- */

function Manifesto({ copy }: { copy: SiteCopy }) {
  const d = copy.doctrine
  return (
    <section className="relative border-b-2 border-ink bg-ink text-paper">
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/50">
            <span className="inline-block h-2.5 w-10 rounded-full bg-accent" />
            {d.eyebrow}
          </div>
        </Reveal>
        <h2 className="mt-8 font-display leading-[1.05] [font-size:clamp(2.2rem,5.5vw,4.5rem)]">
          {d.lines.map((line, i) => (
            <LineReveal key={line} delay={0.1 + i * 0.12}>
              <span className={cn(i === 1 && "text-accent")}>{line}</span>
            </LineReveal>
          ))}
        </h2>
        <Reveal delay={0.3}>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {d.cards.map((c) => {
              const Icon = CARD_ICONS[c.icon]
              return (
                <Pressable key={c.title}>
                  <Card className="h-full border-paper/40 bg-transparent text-paper shadow-none transition-colors hover:border-accent hover:bg-accent/15">
                    <CardContent>
                      <span className="grid size-11 place-items-center rounded-lg bg-accent">
                        <Icon className="size-5 text-white" />
                      </span>
                      <h3 className="mt-5 font-display text-xl">{c.title}</h3>
                      <p className="mt-2 text-sm text-paper/60">{c.body}</p>
                    </CardContent>
                  </Card>
                </Pressable>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- testimony ---------- */

function Testimony({ copy }: { copy: SiteCopy }) {
  const t = copy.testimony
  return (
    <section id="testimony" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <SectionHead index={t.index} title={t.title} right={t.right} />
      </div>
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-12 sm:px-8 lg:grid-cols-3">
        {t.items.map((item, i) => (
          <Reveal key={item.ref} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex h-full flex-col rounded-xl border-2 border-ink bg-paper-2 p-6 shadow-[5px_5px_0_0_#141414]"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="accent">{item.ref}</Badge>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{item.route}</span>
              </div>
              <p className="mt-6 text-lg font-medium leading-snug">
                "{item.body}"
              </p>
              <div className="mt-auto pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em]">— {item.who}</p>
                <div className="mt-2 h-1 w-10 rounded-full bg-accent" />
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- contact ---------- */

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon
  label: string
  value: string
  href: string
}) {
  return (
    <motion.a
      href={href}
      className="group flex items-stretch rounded-lg border-2 border-white bg-transparent text-white transition-colors hover:border-ink hover:bg-ink"
      whileHover={{ x: 6 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      <span className="grid w-14 place-items-center rounded-l-md border-r-2 border-white/40 group-hover:border-white/30">
        <Icon className="size-5" />
      </span>
      <span className="flex flex-1 items-baseline justify-between gap-4 px-4 py-4 sm:px-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-70">{label}</span>
        <span className="text-sm font-semibold tracking-[0.02em]">{value}</span>
      </span>
      <span className="grid w-12 place-items-center rounded-r-md border-l-2 border-white/40 group-hover:border-white/30">
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
      </span>
    </motion.a>
  )
}

function Contact({ copy }: { copy: SiteCopy }) {
  const c = copy.contact
  return (
    <section id="contact" className="relative overflow-hidden border-b-2 border-ink bg-accent text-white">
      <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                <span className="inline-block size-2.5 animate-blink rounded-full bg-white" />
                {c.eyebrow}
              </div>
              <h2 className="mt-6 font-display leading-[1.04] [font-size:clamp(2.7rem,6.5vw,5.5rem)]">
                <LineReveal delay={0.05}>{c.line1}</LineReveal>
                <LineReveal delay={0.15}>
                  something{" "}
                  <motion.span
                    className="inline-block rounded-md bg-ink px-4"
                    whileHover={{ rotate: -1.5, scale: 1.04 }}
                    transition={{ duration: 0.2 }}
                  >
                    {c.accent}
                  </motion.span>
                </LineReveal>
              </h2>
              <p className="mt-8 max-w-[46ch] text-white/85">{c.body}</p>
            </Reveal>
          </div>
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {c.channelsLabel}
              </p>
            </Reveal>
            <Reveal delay={0.15} className="space-y-4">
              {c.channels.map((ch) => {
                const Icon = CHANNEL_ICONS[ch.icon]
                return (
                  <ContactRow key={ch.href} icon={Icon} label={ch.label} value={ch.value} href={ch.href} />
                )
              })}
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex items-center justify-between rounded-lg border-2 border-white/70 px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {c.response.label}
                </span>
                <span className="text-sm font-semibold">{c.response.value}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- footer ---------- */

function Footer({ copy }: { copy: SiteCopy }) {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <button onClick={() => go("top")} className="flex cursor-pointer items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg border-2 border-white/80 font-display text-base">S</span>
              <span className="font-display text-2xl">Somri Dynamics</span>
            </button>
            <p className="mt-4 max-w-[40ch] text-sm text-paper/60">{copy.footer.about}</p>
            <div className="barcode mt-8 h-5 w-40 text-paper/70" aria-hidden />
          </div>
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/50">{copy.footer.registerLabel}</p>
            <ul className="mt-4 space-y-2.5">
              {copy.divisions.map((d) => (
                <li key={d.id}>
                  <button
                    onClick={() => go("divisions")}
                    className="group flex cursor-pointer items-center gap-3 text-[13px] font-medium tracking-[0.04em] text-paper/85 transition-colors hover:text-accent-2"
                  >
                    <span className="text-[10px] font-semibold text-paper/40">{d.id}</span>
                    {d.name}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/listings" className="text-[13px] font-semibold tracking-[0.04em] text-accent-2 hover:underline">
                  Open listings page
                </Link>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/50">{copy.footer.firmLabel}</p>
            <dl className="mt-4 space-y-2 text-[13px] font-medium tracking-[0.04em] text-paper/85">
              {copy.footer.firm.map((f) => (
                <div key={f.key} className="flex justify-between gap-4 border-b border-paper/15 pb-2">
                  <dt className="text-paper/45">{f.key}</dt>
                  <dd className="text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
            <Link
              to="/admin"
              className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-paper/50 transition-colors hover:text-accent-2"
            >
              Staff login
            </Link>
          </div>
        </div>

        {/* giant logotype */}
        <div className="border-t border-paper/10">
          <p
            className="select-none px-5 pb-2 pt-8 text-center font-display leading-[0.9] text-paper [font-size:clamp(5rem,19vw,17rem)]"
            aria-hidden
          >
            {copy.footer.giant}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper/50 sm:px-8">
          <span>{copy.footer.legalLeft}</span>
          <span className="hidden sm:inline">{copy.footer.legalFounder}</span>
          <span className="text-accent-2">{copy.footer.legalRight}</span>
        </div>
      </div>
    </footer>
  )
}

/* ================= PAGE ================= */

export default function App() {
  const { copy } = useCopy()
  return (
    <div className="min-h-screen bg-paper text-ink">
      <UtilityBar copy={copy} />
      <Nav />
      <main>
        <Hero copy={copy} />
        <Marquee items={copy.marquee} />
        <Divisions copy={copy} />
        <Proprietor copy={copy} />
        <Procedure copy={copy} />
        <Manifesto copy={copy} />
        <Testimony copy={copy} />
        <Contact copy={copy} />
      </main>
      <Footer copy={copy} />
    </div>
  )
}
