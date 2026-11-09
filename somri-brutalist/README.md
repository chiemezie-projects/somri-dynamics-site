# Somri Dynamics — Site + Listings CRM

Neobrutalist React app for **Somri Dynamics** (Chisom Genevieve Ume-Ezeoke) — export of local
Nigerian foodstuffs, devices & accessories, fairly used cars, real estate.

## Pages

| Route (hash) | What it is |
| --- | --- |
| `#/` | Editorial landing page — every string comes from the CMS |
| `#/listings` | Public, CRM-driven listings register (filter by trade line, WhatsApp enquiry) |
| `#/admin` | Staff login → dashboard: **Listings**, **Website copy**, **Access** |

## Stack

Vite + React + TypeScript + Tailwind v4, Framer Motion, shadcn-style components (cva),
HashRouter (works from `file://` and GitHub Pages), lucide icons.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck (tsc -b) + production build into dist/
```

The built site is static — deploy `dist/` anywhere (GitHub Pages, Netlify, Vercel).

## Demo mode (works out of the box)

With no env keys set, the app runs on a browser-local demo backend (localStorage, seeded
with 8 listings). Demo login:

| Email | Password | Role |
| --- | --- | --- |
| `owner@somridynamics.com` | `somri-2026` | Owner — everything |

Roles matrix: **Owner** — listings + copy + users · **Admin** — listings + copy · **Editor** — listings only.

To re-seed the demo data, clear these localStorage keys:
`somri.listings.v1`, `somri.copy.v1`, `somri.users.v1`, `somri.session.v1`.

## Go live with Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](./supabase/schema.sql) — tables, triggers,
   row-level security and seeding.
3. In Authentication → Users, invite your staff (public signups are disabled in the
   project config — accounts only exist by invitation), then set their Owner/Admin
   role from the app's Access tab.
4. Create `.env` in the project root:

```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Rebuild. The app switches to Supabase automatically (public read for listings/copy,
authenticated writes filtered by role via RLS).

## Contact (wired into the site)

- WhatsApp / calls: **0803 615 0593** · **0803 913 4091**
- Email: hello@somridynamics.com
