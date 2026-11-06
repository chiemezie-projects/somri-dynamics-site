import { useState } from "react"
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  LineReveal,
  Reveal,
  Magnetic,
  Counter,
  Pressable,
  EASE,
} from "@/components/motion-primitives"

/* ================= DATA ================= */

const NAV = [
  { label: "Divisions", href: "#divisions" },
  { label: "Proprietor", href: "#proprietor" },
  { label: "Procedure", href: "#procedure" },
  { label: "Testimony", href: "#testimony" },
]

const DIVISIONS = [
  {
    id: "001",
    icon: Wheat,
    name: "Nigerian Foodstuff Export",
    spec: "Primary / Export",
    desc: "Authentic local staples — dried, cleaned and vacuum-packed for diaspora kitchens and international retailers. Market-fresh at origin, market-fresh on arrival.",
    items: ["Egusi", "Ogbono", "Garri", "Palm Oil", "Crayfish", "Dried Fish", "Yam", "Spices"],
  },
  {
    id: "002",
    icon: Smartphone,
    name: "Phones & Laptops",
    spec: "Devices / Trade",
    desc: "Genuine smartphones and laptops from verified suppliers. Clear quotes, serials on record, warranty support available on request.",
    items: ["iPhone", "Samsung", "MacBook", "HP", "Dell", "Tab"],
  },
  {
    id: "003",
    icon: Headphones,
    name: "Accessories",
    spec: "Peripherals / Trade",
    desc: "The small stuff that keeps you powered and protected — curated for build quality, priced for everyday buyers.",
    items: ["Power Banks", "Earbuds", "Chargers", "Cases", "Cables"],
  },
  {
    id: "004",
    icon: Car,
    name: "Fairly Used Cars",
    spec: "Automotive / Brokerage",
    desc: "Inspected Tokunbo vehicles. Mileage verified, papers checked, full photo and video evidence before you commit a single naira.",
    items: ["Tokunbo", "Inspection", "Papers", "Shipping"],
  },
  {
    id: "005",
    icon: Building2,
    name: "Real Estate",
    spec: "Land / Property",
    desc: "Land, plots and homes across Nigerian cities. Due diligence executed on the ground — title search, survey and documentation handled.",
    items: ["Land", "Plots", "Homes", "Diaspora Invest."],
  },
]

const PROCEDURE = [
  { no: "01", title: "Initiate.", body: "Reach out on WhatsApp, call or email. State exactly what you need — minimal detail accepted, maximum detail rewarded." },
  { no: "02", title: "Verify.", body: "We source, inspect and record. You receive photos and video of the exact item before any full payment moves." },
  { no: "03", title: "Ship.", body: "Vacuum-sealed, labelled, tracked. Devices notarised, vehicles documented, land surveyed. No ambiguity travels." },
  { no: "04", title: "Confirm.", body: "Delivery acknowledged in your hands. We remain on the line for reorders, aftercare and long-term clients." },
]

const FIGURES = [
  { n: 5, suffix: "", label: "Trade lines" },
  { n: 12, suffix: "+", label: "Countries served" },
  { n: 100, suffix: "%", label: "Verified sourcing" },
  { n: 24, suffix: "H", label: "Response window" },
]

const TESTIMONY = [
  { ref: "TST_001", who: "Adaeze O.", route: "Lagos → London", body: "My family in London received the foodstuff smelling exactly like the market back home. Vacuum-sealed, labelled, nothing damaged." },
  { ref: "TST_002", who: "Emeka N.", route: "Abuja, NG", body: "Bought my MacBook and power bank through Somri. Photos of the exact unit, fair price, delivery in two days. No stories that touch." },
  { ref: "TST_003", who: "Ifeoma & Uche A.", route: "Houston, USA", body: "Chisom guided my first land purchase in Lagos while I was still in the U.S. Documents and location videos. My whole family is in now." },
]

const MARQUEE_ITEMS = [
  "Nigerian Foodstuff",
  "Phones & Laptops",
  "Accessories",
  "Fairly Used Cars",
  "Real Estate",
  "Exported with intent",
]

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

function UtilityBar() {
  return (
    <div className="border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 sm:grid-cols-3">
        <div className="border-r-2 border-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]">
          Somri Dynamics®
        </div>
        <div className="hidden border-r-2 border-ink px-4 py-1.5 text-right text-[11px] font-medium uppercase tracking-[0.1em] text-grey sm:block">
          6.5244° N, 3.3792° E — Lagos
        </div>
        <div className="flex items-center justify-end gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em]">
          <span className="inline-block size-2 animate-blink rounded-full bg-accent" />
          Open for business
        </div>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-base text-white shadow-[3px_3px_0_0_#141414]">
            S
          </span>
          <span className="font-display text-xl">
            Somri <span className="text-accent">Dynamics</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:bg-paper-2 hover:text-accent"
            >
              {n.label}
            </a>
          ))}
          <a href="#contact" className="ml-2">
            <Button variant="accent" size="sm" className="h-10 cursor-pointer">
              Start Order
              <ArrowUpRight className="size-4" />
            </Button>
          </a>
        </nav>
        <a href="#contact" className="md:hidden">
          <Button variant="accent" size="sm" className="h-10 cursor-pointer">
            Contact
            <ArrowUpRight className="size-4" />
          </Button>
        </a>
      </div>
    </header>
  )
}

function Hero() {
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
                Sec.00 — General Commerce
              </span>
            </div>
            <h1 className="mt-7 font-display leading-[1.02] [font-size:clamp(2.9rem,7.5vw,6.25rem)]">
              <LineReveal delay={0.05}>We move</LineReveal>
              <LineReveal delay={0.15}>
                <span className="text-accent">Nigeria</span>
                <span className="align-top text-[0.4em] font-semibold text-grey">™</span>{" "}
                to the{" "}
                <motion.span
                  className="inline-block -rotate-2 rounded-md bg-accent px-4 py-1 text-white"
                  initial={{ scaleY: 0.6, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.7 }}
                >
                  world.
                </motion.span>
              </LineReveal>
            </h1>
            <p className="mt-8 max-w-[58ch] text-lg text-ink-2">
              Export of local Nigerian foodstuffs to the diaspora. Trade in phones,
              laptops and accessories. Inspected fairly used cars. Land and property,
              verified on the ground. One firm, one standard, zero stories.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a href="#contact">
                  <Button size="lg" variant="accent" className="cursor-pointer">
                    Start an order
                    <ArrowUpRight className="size-4" />
                  </Button>
                </a>
              </Magnetic>
              <a href="#divisions">
                <Button size="lg" variant="outline" className="cursor-pointer">
                  Explore divisions
                </Button>
              </a>
            </div>
          </div>

          {/* dossier card */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col bg-paper-2 lg:bg-paper">
              <div className="border-b-2 border-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">
                Firm dossier — SD/LA/2026
              </div>
              <dl className="flex flex-1 flex-col">
                {[
                  ["Proprietor", "C.G. Ume-Ezeoke"],
                  ["Headquarters", "Lagos, Nigeria"],
                  ["Trade lines", "05 — Divisions"],
                  ["Operating mode", "Export / Trade / Advisory"],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    className={cn(
                      "flex flex-1 items-center justify-between gap-4 px-5 py-4",
                      i !== 3 && "border-b border-ink/15"
                    )}
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between border-t-2 border-ink bg-accent px-5 py-4 text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">Status</p>
                  <p className="font-display text-2xl">Open for orders</p>
                </div>
                <span className="inline-block size-2.5 animate-blink rounded-full bg-white" />
              </div>
              <div className="flex items-center justify-between border-t-2 border-ink px-5 py-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">SD / EST. 2019</span>
                <div className="barcode h-4 w-24 text-ink" aria-hidden />
              </div>
            </div>
          </div>
        </div>

        {/* figures */}
        <div className="grid grid-cols-2 border-t-2 border-ink lg:grid-cols-4">
          {FIGURES.map((f, i) => (
            <div
              key={f.label}
              className={cn(
                "px-5 py-7 sm:px-8",
                i !== FIGURES.length - 1 && "lg:border-r-2 lg:border-ink",
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

function Marquee() {
  const row = (
    <>
      {MARQUEE_ITEMS.map((t) => (
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
  open,
  onToggle,
}: {
  d: (typeof DIVISIONS)[number]
  open: boolean
  onToggle: () => void
}) {
  const Icon = d.icon
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

function Divisions() {
  const [openId, setOpenId] = useState<string | null>("001")
  return (
    <section id="divisions" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8">
          <div>
            <SectionHead index="SEC.01" title="Trade register" />
            <p className="mt-5 max-w-[52ch] text-ink-2">
              Five divisions. One register. Every line engineered around the same
              principle — evidence before payment, standards before volume.
            </p>
          </div>
          <Badge variant="outline">Tap a line to expand</Badge>
        </div>
      </div>
      <div className="border-t-2 border-ink">
        {DIVISIONS.map((d) => (
          <DivisionRow
            key={d.id}
            d={d}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
          />
        ))}
      </div>
    </section>
  )
}

/* ---------- proprietor ---------- */

function Proprietor() {
  return (
    <section id="proprietor" className="border-b-2 border-ink bg-paper-2">
      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 pt-16 sm:px-8">
          <SectionHead index="SEC.02" title="The proprietor" right="Filed & sworn" />
        </div>
        <div className="grid lg:grid-cols-12">
          {/* nameplate */}
          <div className="flex items-center justify-center p-8 sm:p-12 lg:col-span-5 lg:border-r-2 lg:border-ink lg:p-14">
            <Reveal className="w-full max-w-sm">
              <Card className="shadow-[8px_8px_0_0_#141414]">
                <div className="stamp mx-6 mt-6 rounded-md bg-accent px-4 pb-3 pt-4 text-center text-white">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">Window No. 001</p>
                  <p className="font-display text-5xl leading-none">CG·U</p>
                  <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">Duly registered — Sole trader</p>
                </div>
                <CardContent className="space-y-1 pt-6">
                  <p className="font-display text-3xl leading-tight">Chisom Genevieve Ume-Ezeoke</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-grey">
                    Founder — Chief Executive Officer
                  </p>
                </CardContent>
                <div className="flex items-center justify-between border-t-2 border-ink px-5 py-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">Signatory</span>
                  <span className="text-lg font-semibold italic text-accent">C.G.U.</span>
                </div>
              </Card>
            </Reveal>
          </div>

          {/* statement */}
          <div className="px-5 py-12 sm:px-8 lg:col-span-7 lg:py-16">
            <Reveal>
              <blockquote className="font-display text-3xl leading-[1.1] sm:text-5xl">
                <p>"No customer</p>
                <p className="text-accent">ever regrets</p>
                <p>trusting us."</p>
              </blockquote>
              <p className="mt-8 max-w-[56ch] text-lg text-ink-2">
                I built Somri Dynamics on one promise — whether it is a bag of egusi
                heading to a family in London or a plot of land in Lagos, the hand
                and the heart behind it are the same. Proof travels with every item;
                trust arrives before the goods do.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Doctrine", "Evidence first"],
                  ["Field", "Export / Trade / Property"],
                  ["Standard", "Family grade"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border-2 border-ink bg-paper px-4 py-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{k}</p>
                    <p className="mt-1 font-semibold">{v}</p>
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

function Procedure() {
  return (
    <section id="procedure" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <SectionHead index="SEC.03" title="Standard procedure" right="4 operations" />
      </div>
      <div className="mx-auto grid max-w-[1440px] sm:grid-cols-2 lg:grid-cols-4">
        {PROCEDURE.map((s, i) => (
          <Reveal
            key={s.no}
            delay={i * 0.08}
            className={cn(
              "min-h-[260px] p-6 sm:p-8",
              i !== PROCEDURE.length - 1 && "lg:border-r-2 lg:border-ink",
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

function Manifesto() {
  return (
    <section className="relative border-b-2 border-ink bg-ink text-paper">
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/50">
            <span className="inline-block h-2.5 w-10 rounded-full bg-accent" />
            Sec.04 — House doctrine
          </div>
        </Reveal>
        <h2 className="mt-8 font-display leading-[1.05] [font-size:clamp(2.2rem,5.5vw,4.5rem)]">
          {[
            { l: "If we would not buy it for our family,", c: "" },
            { l: "we do not ship it to yours.", c: "text-accent" },
          ].map(({ l, c }, i) => (
            <LineReveal key={l} delay={0.1 + i * 0.12}>
              <span className={c}>{l}</span>
            </LineReveal>
          ))}
        </h2>
        <Reveal delay={0.3}>
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Verified everything", d: "Serials on record. Mileage checked. Title searched. Proof before payment — always." },
              { icon: Globe2, t: "Truly worldwide", d: "Freight and courier partners reach Europe, the Americas, Asia and anywhere in Africa." },
              { icon: MessagesSquare, t: "One line, one human", d: "You speak directly to the team that packs your goods. No bots. No call centres." },
            ].map((c) => (
              <Pressable key={c.t}>
                <Card className="h-full border-paper/40 bg-transparent text-paper shadow-none transition-colors hover:border-accent hover:bg-accent/15">
                  <CardContent>
                    <span className="grid size-11 place-items-center rounded-lg bg-accent">
                      <c.icon className="size-5 text-white" />
                    </span>
                    <h3 className="mt-5 font-display text-xl">{c.t}</h3>
                    <p className="mt-2 text-sm text-paper/60">{c.d}</p>
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- testimony ---------- */

function Testimony() {
  return (
    <section id="testimony" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1440px] px-5 pt-16 sm:px-8">
        <SectionHead index="SEC.05" title="Case testimony" right="On the record" />
      </div>
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-12 sm:px-8 lg:grid-cols-3">
        {TESTIMONY.map((t, i) => (
          <Reveal key={t.ref} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex h-full flex-col rounded-xl border-2 border-ink bg-paper-2 p-6 shadow-[5px_5px_0_0_#141414]"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="accent">{t.ref}</Badge>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-grey">{t.route}</span>
              </div>
              <p className="mt-6 text-lg font-medium leading-snug">
                "{t.body}"
              </p>
              <div className="mt-auto pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.1em]">— {t.who}</p>
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
  icon: typeof Phone
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

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-b-2 border-ink bg-accent text-white">
      <div className="bg-blueprint absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                <span className="inline-block size-2.5 animate-blink rounded-full bg-white" />
                Sec.06 — Desk No. 001
              </div>
              <h2 className="mt-6 font-display leading-[1.04] [font-size:clamp(2.7rem,6.5vw,5.5rem)]">
                <LineReveal delay={0.05}>Let&rsquo;s move</LineReveal>
                <LineReveal delay={0.15}>
                  something{" "}
                  <motion.span
                    className="inline-block rounded-md bg-ink px-4"
                    whileHover={{ rotate: -1.5, scale: 1.04 }}
                    transition={{ duration: 0.2 }}
                  >
                    valuable.
                  </motion.span>
                </LineReveal>
              </h2>
              <p className="mt-8 max-w-[46ch] text-white/85">
                From one bag of garri to an entire property deal — send the details
                and we take it from there. Evidence first. Payment after proof.
              </p>
            </Reveal>
          </div>
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                Channel select
              </p>
            </Reveal>
            <Reveal delay={0.15} className="space-y-4">
              <ContactRow icon={MessageCircle} label="WhatsApp" value="+234 803 615 0593" href="https://wa.me/2348036150593" />
              <ContactRow icon={MessageCircle} label="WhatsApp · Alt" value="+234 803 913 4091" href="https://wa.me/2348039134091" />
              <ContactRow icon={Phone} label="Voice" value="0803 615 0593 · 0803 913 4091" href="tel:+2348036150593" />
              <ContactRow icon={Mail} label="Email" value="hello@somridynamics.com" href="mailto:hello@somridynamics.com" />
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex items-center justify-between rounded-lg border-2 border-white/70 px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                  Response window
                </span>
                <span className="text-sm font-semibold">≤ 24 hours</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- footer ---------- */

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg border-2 border-white/80 font-display text-base">S</span>
              <span className="font-display text-2xl">Somri Dynamics</span>
            </div>
            <p className="mt-4 max-w-[40ch] text-sm text-paper/60">
              Nigerian foodstuff export — devices &amp; accessories — fairly used cars —
              real estate. Registered in Lagos, operating worldwide.
            </p>
            <div className="barcode mt-8 h-5 w-40 text-paper/70" aria-hidden />
          </div>
          <div className="lg:col-span-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/50">Register</p>
            <ul className="mt-4 space-y-2.5">
              {DIVISIONS.map((d) => (
                <li key={d.id}>
                  <a href="#divisions" className="group flex items-center gap-3 text-[13px] font-medium tracking-[0.04em] text-paper/85 transition-colors hover:text-accent-2">
                    <span className="text-[10px] font-semibold text-paper/40">{d.id}</span>
                    {d.name}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/50">Firm</p>
            <dl className="mt-4 space-y-2 text-[13px] font-medium tracking-[0.04em] text-paper/85">
              {[
                ["Proprietor", "C.G. Ume-Ezeoke"],
                ["HQ", "Lagos, Nigeria"],
                ["Email", "hello@somridynamics.com"],
                ["Phone A", "0803 615 0593"],
                ["Phone B", "0803 913 4091"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-paper/15 pb-2">
                  <dt className="text-paper/45">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* giant logotype */}
        <div className="border-t border-paper/10">
          <p
            className="select-none px-5 pb-2 pt-8 text-center font-display leading-[0.9] text-paper [font-size:clamp(5rem,19vw,17rem)]"
            aria-hidden
          >
            SOMRI
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/15 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-paper/50 sm:px-8">
          <span>© {new Date().getFullYear()} Somri Dynamics Ltd.</span>
          <span className="hidden sm:inline">Founder — Chisom Genevieve Ume-Ezeoke</span>
          <span className="text-accent-2">Proudly Nigerian — Shipping everywhere</span>
        </div>
      </div>
    </footer>
  )
}

/* ================= PAGE ================= */

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <UtilityBar />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Divisions />
        <Proprietor />
        <Procedure />
        <Manifesto />
        <Testimony />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
