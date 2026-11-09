import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Car,
  Headphones,
  MessageCircle,
  Smartphone,
  Wheat,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion-primitives"
import { useCopy } from "@/components/copy-context"
import { store } from "@/lib/store"
import type { Listing, ListingCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const CAT_ICONS: Record<ListingCategory, typeof Wheat> = {
  foodstuff: Wheat,
  devices: Smartphone,
  accessories: Headphones,
  autos: Car,
  "real-estate": Building2,
}

const CAT_LABEL: Record<ListingCategory, string> = {
  foodstuff: "Foodstuff",
  devices: "Devices",
  accessories: "Accessories",
  autos: "Autos",
  "real-estate": "Real Estate",
}

const STATUS_STYLE: Record<Listing["status"], string> = {
  available: "bg-accent text-white border-ink",
  reserved: "border-ink bg-paper text-ink",
  sold: "border-ink bg-ink text-paper",
}

export default function ListingsPage() {
  const { loading } = useCopy()
  const [listings, setListings] = useState<Listing[]>([])
  const [cat, setCat] = useState<ListingCategory | "all">("all")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    store.listListings().then((ls) => { setListings(ls); setReady(true) })
  }, [])

  const filtered = useMemo(
    () => (cat === "all" ? listings : listings.filter((l) => l.category === cat)),
    [listings, cat]
  )

  const cats: (ListingCategory | "all")[] = ["all", "foodstuff", "devices", "accessories", "autos", "real-estate"]

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* top bar */}
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-base text-white shadow-[3px_3px_0_0_#141414]">S</span>
            <span className="font-display text-xl">Somri <span className="text-accent">Dynamics</span></span>
            <Badge variant="soft" className="hidden sm:inline-flex">Listings</Badge>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="h-10 cursor-pointer text-[12px]">Staff</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="h-10 cursor-pointer">
                <ArrowLeft className="size-4" />
                Back to site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* page head */}
      <div className="border-b-2 border-ink bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="inline-block h-2.5 w-10 rounded-full bg-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-grey">Live inventory register</span>
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl">
              Open <span className="text-accent">listings</span>.
            </h1>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              Every item below is on Somri's book right now. Photos and videos of the
              exact unit are sent before any payment — evidence first, payment after proof.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={cn(
                    "cursor-pointer rounded-lg border-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-all",
                    cat === c
                      ? "border-ink bg-ink text-paper shadow-[3px_3px_0_0_#6d28d9]"
                      : "border-ink/30 bg-paper hover:border-ink"
                  )}
                >
                  {c === "all" ? "All lines" : CAT_LABEL[c]}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* grid */}
      <main className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8">
        {(!ready || loading) ? (
          <p className="py-20 text-center text-grey">Loading the register…</p>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-ink/60">Nothing in this drawer yet.</p>
            <p className="mt-2 text-grey">New stock lands weekly — check back or ping us on WhatsApp.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l, i) => (
              <Reveal key={l.id} delay={Math.min(i * 0.06, 0.3)}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-[6px_6px_0_0_#141414]"
                >
                  {/* visual */}
                  <div className="relative grid h-44 place-items-center border-b-2 border-ink bg-paper-2 overflow-hidden">
                    {l.image ? (
                      <img src={l.image} alt={l.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <ListingsThumb category={l.category} />
                    )}
                    <span className="absolute left-3 top-3">
                      <Badge variant="default">{CAT_LABEL[l.category]}</Badge>
                    </span>
                    <span className="absolute right-3 top-3">
                      <Badge className={STATUS_STYLE[l.status]}>{l.status}</Badge>
                    </span>
                    {l.featured && (
                      <span className="absolute bottom-3 left-3">
                        <Badge variant="accent">★ Featured</Badge>
                      </span>
                    )}
                  </div>
                  {/* body */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">
                      REF: {l.id.slice(0, 10).toUpperCase()} · {l.location}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl leading-snug">{l.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-ink-2">{l.description}</p>
                    <div className="mt-4 flex items-end justify-between border-t-2 border-ink pt-4">
                      <p className="font-display text-2xl">
                        {l.currency}<span className="tabular-nums">{l.price}</span>
                      </p>
                      <motion.a
                        href={`https://wa.me/${l.whatsapp}?text=${encodeURIComponent(`Hello Somri Dynamics, I'm interested in: ${l.title} (ref ${l.id})`)}`}
                        target="_blank"
                        rel="noreferrer"
                        whileTap={{ scale: 0.94 }}
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-accent px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-white shadow-[3px_3px_0_0_#141414] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#141414]"
                      >
                        <MessageCircle className="size-3.5" />
                        Enquire
                        <ArrowUpRight className="size-3.5" />
                      </motion.a>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        )}
      </main>

      {/* bottom strip */}
      <div className="border-t-2 border-ink bg-ink py-3 text-center text-paper">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/70">
          Register maintained by Somri Dynamics — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

function ListingsThumb({ category }: { category: ListingCategory }) {
  const Icon = CAT_ICONS[category]
  return (
    <div className="flex flex-col items-center gap-2 text-ink/40">
      <span className="grid size-14 place-items-center rounded-lg border-2 border-ink/20">
        <Icon className="size-7" />
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-[0.2em]">Photo pending</span>
    </div>
  )
}
