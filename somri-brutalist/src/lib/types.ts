/* Somri Dynamics — shared domain types */

export type Role = "owner" | "admin" | "editor"

export type ListingCategory =
  | "foodstuff"
  | "devices"
  | "accessories"
  | "autos"
  | "real-estate"

export type ListingStatus = "available" | "reserved" | "sold"

export interface Listing {
  id: string
  title: string
  category: ListingCategory
  price: string
  currency: string
  description: string
  image: string
  location: string
  status: ListingStatus
  featured: boolean
  whatsapp: string
  created_at: string
  updated_at: string
}

export interface AppUser {
  id: string
  email: string
  role: Role
  name: string
  created_at: string
}

/* ---- site copy: every editable string on the landing page ---- */

export interface DivisionCopy {
  id: string
  name: string
  spec: string
  desc: string
  items: string[]
}

export interface SiteCopy {
  brand: { name: string; suffix: string }
  utility: { left: string; coords: string; right: string }
  hero: {
    eyebrow: string
    line1: string
    accentWord: string
    line2: string
    body: string
    ctaPrimary: string
    ctaSecondary: string
    dossier: { key: string; value: string }[]
    statusLabel: string
    statusValue: string
    estTag: string
  }
  figures: { n: number; suffix: string; label: string }[]
  marquee: string[]
  divisions: DivisionCopy[]
  divisionsHead: { index: string; title: string; blurb: string; hint: string }
  proprietor: {
    index: string
    title: string
    right: string
    windowNo: string
    monogram: string
    regLine: string
    name: string
    role: string
    signatory: string
    quote: string[]
    body: string
    chips: { key: string; value: string }[]
  }
  procedure: { index: string; title: string; right: string; steps: { no: string; title: string; body: string }[] }
  doctrine: {
    index: string
    eyebrow: string
    lines: string[]
    cards: { icon: "shield" | "globe" | "chat"; title: string; body: string }[]
  }
  testimony: { index: string; title: string; right: string; items: { ref: string; who: string; route: string; body: string }[] }
  contact: {
    index: string
    eyebrow: string
    line1: string
    accent: string
    body: string
    channelsLabel: string
    channels: { icon: "whatsapp" | "phone" | "mail"; label: string; value: string; href: string }[]
    response: { label: string; value: string }
  }
  footer: {
    about: string
    registerLabel: string
    firmLabel: string
    firm: { key: string; value: string }[]
    giant: string
    legalLeft: string
    legalFounder: string
    legalRight: string
  }
  listingsLink: { label: string }
}
