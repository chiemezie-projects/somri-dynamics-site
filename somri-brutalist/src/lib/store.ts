import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { DEFAULT_COPY, DEFAULT_USERS, SEED_LISTINGS } from "./content"
import type { AppUser, Listing, Role, SiteCopy } from "./types"

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const BACKEND_MODE: "supabase" | "demo" = SUPA_URL && SUPA_KEY ? "supabase" : "demo"

/* ====================================================================
   DEMO BACKEND — browser localStorage.
   Client-side only (demo quality); swap in Supabase keys for real auth
   and row-level security. Seeded on first use.
==================================================================== */

const LS = {
  listings: "somri.listings.v1",
  copy: "somri.copy.v1",
  users: "somri.users.v1",
  session: "somri.session.v1",
}

function readJSON<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) {
      const v = fallback()
      writeJSON(key, v)
      return v
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback()
  }
}
function writeJSON(key: string, v: unknown) {
  localStorage.setItem(key, JSON.stringify(v))
}
function loadUsers() { return readJSON<AppUser[]>(LS.users, () => DEFAULT_USERS) }

/* recursive merge so partial saved copy never breaks the site */
function deepMerge<T>(base: T, patch: unknown): T {
  if (patch == null || typeof base !== "object" || Array.isArray(base)) return (patch as T) ?? base
  const out = { ...(base as object) } as Record<string, unknown>
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    if (v == null) continue
    out[k] = k in out && typeof out[k] === "object" && !Array.isArray(out[k]) && typeof v === "object" && !Array.isArray(v)
      ? deepMerge(out[k], v)
      : v
  }
  return out as T
}

const listeners = new Set<(u: AppUser | null) => void>()
function emitSession() {
  const u = readJSON<AppUser | null>(LS.session, () => null)
  listeners.forEach((cb) => cb(u))
}

/* ====================================================================
   SUPABASE BACKEND
==================================================================== */

let supa: SupabaseClient | null = null
if (BACKEND_MODE === "supabase") {
  supa = createClient(SUPA_URL!, SUPA_KEY!)
}

async function supaProfile(userId: string, email: string): Promise<AppUser | null> {
  if (!supa) return null
  const { data } = await supa
    .from("profiles")
    .select("id, email, name, role, created_at")
    .eq("id", userId)
    .single()
  return data ? (data as AppUser) : { id: userId, email, role: "editor", name: email, created_at: "" }
}

/* ====================================================================
   PUBLIC API
==================================================================== */

export const store = {
  mode: BACKEND_MODE,

  /* ---------- auth ---------- */
  getSession(): Promise<AppUser | null> {
    if (BACKEND_MODE === "demo") {
      return Promise.resolve(readJSON<AppUser | null>(LS.session, () => null))
    }
    return (async () => {
      if (!supa) return null
      const { data } = await supa.auth.getSession()
      const u = data.session?.user
      return u ? supaProfile(u.id, u.email ?? "") : null
    })()
  },

  async signIn(email: string, password: string): Promise<AppUser> {
    if (BACKEND_MODE === "demo") {
      const users = loadUsers()
      const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
      const pass = readJSON<Record<string, string>>(LS.users + ".pass", () => ({ "owner@somridynamics.com": "somri-2026" }))
      if (!u || pass[u.email] !== password) throw new Error("Invalid credentials")
      writeJSON(LS.session, u)
      emitSession()
      return u
    }
    if (!supa) throw new Error("Backend unavailable")
    const { data, error } = await supa.auth.signInWithPassword({ email: email.trim(), password })
    if (error) throw error
    const u = data.user!
    return (await supaProfile(u.id, u.email ?? email)) ?? { id: u.id, email, role: "editor", name: email, created_at: "" }
  },

  async signOut(): Promise<void> {
    if (BACKEND_MODE === "demo") {
      localStorage.removeItem(LS.session)
      emitSession()
      return
    }
    await supa?.auth.signOut()
  },

  onSession(cb: (u: AppUser | null) => void): () => void {
    listeners.add(cb)
    return () => listeners.delete(cb)
  },

  /* ---------- users (owner / admin) ---------- */
  async listUsers(): Promise<AppUser[]> {
    if (BACKEND_MODE === "demo") return loadUsers()
    if (!supa) return []
    const { data } = await supa.from("profiles").select("id, email, name, role, created_at").order("created_at", { ascending: true })
    return (data ?? []) as AppUser[]
  },

  async createUser(email: string, password: string, name: string, role: Role): Promise<AppUser> {
    if (BACKEND_MODE === "demo") {
      const users = loadUsers()
      if (users.some((x) => x.email.toLowerCase() === email.toLowerCase())) throw new Error("Email already exists")
      const u: AppUser = { id: crypto.randomUUID(), email: email.trim(), role, name: name.trim() || email, created_at: new Date().toISOString() }
      writeJSON(LS.users, [...users, u])
      const pass = readJSON<Record<string, string>>(LS.users + ".pass", () => ({ "owner@somridynamics.com": "somri-2026" }))
      pass[u.email] = password
      writeJSON(LS.users + ".pass", pass)
      return u
    }
    // Supabase: accounts are provisioned by an owner in the Supabase dashboard
    // (client-side apps must never hold the service key). Allow role updates only.
    throw new Error("In Supabase mode, invite teammates from the Supabase dashboard — then set their role here.")
  },

  async setUserRole(id: string, role: Role): Promise<void> {
    if (BACKEND_MODE === "demo") {
      const users = loadUsers()
      writeJSON(LS.users, users.map((u) => (u.id === id ? { ...u, role } : u)))
      const session = readJSON<AppUser | null>(LS.session, () => null)
      if (session && session.id === id) writeJSON(LS.session, { ...session, role })
      return
    }
    await supa?.from("profiles").update({ role }).eq("id", id)
  },

  async removeUser(id: string): Promise<void> {
    if (BACKEND_MODE === "demo") {
      const users = loadUsers()
      const victim = users.find((u) => u.id === id)
      writeJSON(LS.users, users.filter((u) => u.id !== id))
      if (victim) {
        const pass = readJSON<Record<string, string>>(LS.users + ".pass", () => ({}))
        delete pass[victim.email]
        writeJSON(LS.users + ".pass", pass)
      }
      return
    }
    await supa?.from("profiles").delete().eq("id", id)
  },

  /* ---------- listings (CRM) ---------- */
  async listListings(): Promise<Listing[]> {
    if (BACKEND_MODE === "demo") return readJSON<Listing[]>(LS.listings, () => SEED_LISTINGS)
    if (!supa) return []
    const { data } = await supa.from("listings").select("*").order("created_at", { ascending: false })
    return (data ?? []) as Listing[]
  },

  async saveListing(l: Listing): Promise<void> {
    if (BACKEND_MODE === "demo") {
      const all = readJSON<Listing[]>(LS.listings, () => SEED_LISTINGS)
      const i = all.findIndex((x) => x.id === l.id)
      if (i >= 0) all[i] = l
      else all.unshift({ ...l, created_at: new Date().toISOString() })
      writeJSON(LS.listings, all)
      return
    }
    await supa!.from("listings").upsert(l)
  },

  async deleteListing(id: string): Promise<void> {
    if (BACKEND_MODE === "demo") {
      writeJSON(LS.listings, readJSON<Listing[]>(LS.listings, () => SEED_LISTINGS).filter((x) => x.id !== id))
      return
    }
    await supa!.from("listings").delete().eq("id", id)
  },

  /* ---------- site copy (CMS) ---------- */
  async getCopy(): Promise<SiteCopy> {
    if (BACKEND_MODE === "demo") return deepMerge(DEFAULT_COPY, readJSON<Partial<SiteCopy> | null>(LS.copy, () => null))
    if (!supa) return DEFAULT_COPY
    const { data } = await supa.from("site_copy").select("data").eq("id", "site").maybeSingle()
    return deepMerge(DEFAULT_COPY, data?.data ?? {})
  },

  async saveCopy(c: SiteCopy): Promise<void> {
    if (BACKEND_MODE === "demo") {
      writeJSON(LS.copy, c)
      return
    }
    await supa!.from("site_copy").upsert({ id: "site", data: c, updated_at: new Date().toISOString() })
  },
}

/* role-based access control matrix */
const CAN: Record<"listings" | "copy" | "users", Role[]> = {
  listings: ["owner", "admin", "editor"],
  copy: ["owner", "admin"],
  users: ["owner", "admin"],
}
export function may(role: Role | undefined | null, area: keyof typeof CAN): boolean {
  return !!role && CAN[area].includes(role)
}
export const ROLE_LABEL: Record<Role, string> = { owner: "Owner", admin: "Admin", editor: "Editor" }
