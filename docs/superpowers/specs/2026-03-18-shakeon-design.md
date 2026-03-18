# ShakeOn — Design Spec
**Date:** 2026-03-18
**Status:** Approved

---

## 1. Overview

ShakeOn is a handshake meme generator website. Users fill in two labels ("left hand" and "right hand") plus an optional center agreement label, which renders as a meme with a large 🤝 emoji flanked by the two labels and the center text below. Memes can be downloaded as PNG, shared via URL, and submitted to a community feed with upvotes.

---

## 2. Visual Design

### Typography
- **Single font throughout:** `Press Start 2P` (Google Fonts) — pixel/retro style, used for all text including headings, body, inputs, buttons, cards, marquee, and tabs.

### Color Palette
- Background: `#ffffff` (white)
- Text: `#111111`
- Borders: `1px solid #ddd` (default), `1px solid #111` (active/hover)
- Accent: `#FFD600` (yellow) — used only on the primary Generate button and the center label pill
- Muted backgrounds: `#fafafa` for secondary sections

### Interaction
- **Hover effect on all interactive elements:** element shifts `translate(-2px, -2px)` and gains `box-shadow: 4px 4px 0 #111`
- **Active/press:** snaps back `translate(1px, 1px)`, shadow removed
- Inputs on focus: `border-color: #111`, `box-shadow: 3px 3px 0 #111`

### Navigation
- No traditional header bar with logo
- A segmented pill group of connected bordered boxes, left-aligned, flush shared borders, `Press Start 2P` 9px font, lowercase labels
- Items: `generate` | `wall` | `twitter`
- Active item: `background: #111; color: #fff`
- Inactive hover: `background: #f5f5f5`

---

## 3. Pages & Routes

### `app/page.tsx` — Generator (home)

A **client component** (uses `useSearchParams` for auto-fill + client state for inputs/download).

**Sections (top to bottom):**
1. **Nav** — segmented nav, `generate` active
2. **Hero** — centered heading, subtitle, meme canvas
3. **Meme Canvas** (`components/Handshake.tsx`)
4. **Inputs** — two side-by-side inputs (left / right) + full-width center input
5. **Buttons** — `generate` (yellow primary) | `random` | `download`
6. **Submit banner** — shown after successful generation; "like this one? add it to the wall" + Submit button. Validation: left and right must be non-empty strings. Submit shows a loading state, then success ("added!") or error ("try again") message. No duplicate prevention in v1.
7. **Marquee** (`components/Marquee.tsx`)

**Auto-fill:** On mount, reads `?l=`, `?r=`, `?c=` from `useSearchParams` and pre-fills inputs. If all three are present, auto-triggers the meme render.

---

### `app/wall/page.tsx` — Community Wall

A **server component** for initial data fetch, with a client component for tab switching and load-more.

**Sections:**
1. **Nav** — segmented nav, `wall` active
2. **Heading** — "the wall 🏆"
3. **Leaderboard tabs** — `today` | `this week` | `all time` (same segmented style as nav)
4. **Card grid** — responsive 3→2→1 col, `components/Card.tsx`
5. **Load more button** — loads 12 more cards per click; hidden when no more results

Default page size: **12 cards**.

---

### `app/s/page.tsx` — Shareable Meme Page

Exists solely to provide correct OG meta tags for social sharing. Reads `l`, `r`, `c` from `searchParams` (server component), renders the meme, and sets:
```html
<meta property="og:image" content="/api/og?l=...&r=...&c=..." />
<meta property="og:title" content="{left} 🤝 {right}" />
<meta property="og:description" content=""{center}"" />
<meta name="twitter:card" content="summary_large_image" />
```

The generator's Share button links to `/s?l=&r=&c=` (not `/?l=...`), ensuring OG tags are present when the link is shared on Twitter/Discord/iMessage.

---

### `app/api/og/route.tsx` — OG Image

- **Edge runtime** (`export const runtime = 'edge'`)
- Uses `@vercel/og` (`ImageResponse`, 1200×630)
- Font: fetch `Press Start 2P` as `ArrayBuffer` from Google Fonts inside the handler and pass to `ImageResponse` fonts option — required for edge runtime
- Renders: left label | 🤝 emoji | right label, center label below

---

### `app/api/upvote/route.tsx` — Upvote

- **POST** method only
- Reads `{ id: string }` from request body
- Calls Supabase `increment_upvote(id)` RPC
- Returns `{ ok: true }` or error JSON

Client never calls Supabase directly for upvotes — always goes through this API route.

---

## 4. Meme Canvas Component (`components/Handshake.tsx`)

### Layout
```
[ left label ]  [  🤝 80px  ]  [ right label ]
        [ center label pill — full width ]
```

- CSS Grid: `grid-template-columns: 1fr auto 1fr`
- Left label: right-aligned, `Press Start 2P` 11px
- Right label: left-aligned, `Press Start 2P` 11px
- Emoji: `font-size: 80px`, centered
- Center pill: `background: #FFD600`, `border: 1px solid #111`, `border-radius: 20px`, `Press Start 2P` 9px — spans full grid width, hidden when center text is empty
- Outer container: `border: 1px solid #ddd`, `border-radius: 10px`, hover shadow effect

### Download (html2canvas)
- Before capturing, call `document.fonts.ready` to ensure `Press Start 2P` is loaded — prevents fallback font in PNG
- `html2canvas` captures the `.meme-canvas` DOM node
- Saves as `shakeon-meme.png`
- Download button shows loading state (`downloading...`) while capturing

---

## 5. Marquee Component (`components/Marquee.tsx`)

- Reads from `lib/seeds.ts` (`SEEDS` array — all 40+ items)
- Items array duplicated so it loops seamlessly: `[...SEEDS, ...SEEDS]`
- CSS `animation: marquee` translates X from `0` to `-50%`, duration `40s linear infinite`
- `border-top: 1px solid #e8e8e8`, `background: #fafafa`
- Font size 8px, `Press Start 2P`, color `#666`
- Pure CSS animation, no JS

---

## 6. Community Feed

### Card Component (`components/Card.tsx`)

Each card displays:
- `left 🤝 right` — `Press Start 2P` 8px
- `"center text"` — italic, 7px, `#888`
- Upvote button: `▲ {count}` — bordered pill, hover shadow
- Share button: `share ↗` — links to `/s?l=&r=&c=`
- Hover: `translate(-2px, -2px)` + `box-shadow: 4px 4px 0 #111`

### Upvoting
- Tracked in `localStorage` with key `voted:{id}` — persists across browser sessions (intentional: one vote per browser, not per tab session)
- On click: optimistic UI increment, then `POST /api/upvote` with `{ id }`
- Already-voted state: button visually highlighted (`background: #FFD600`), click is no-op
- If POST fails: revert optimistic increment, show no error UI (silent fail in v1)

### Leaderboard Tabs
- `today`: `created_at >= now() - interval '1 day'` ordered by `upvotes DESC`
- `this week`: `created_at >= now() - interval '7 days'` ordered by `upvotes DESC`
- `all time`: all rows ordered by `upvotes DESC`
- Tab switching is client-side; re-fetches from Supabase on tab change

---

## 7. Backend — Supabase

### Table: `handshakes`
```sql
create table handshakes (
  id uuid primary key default gen_random_uuid(),
  "left"  text not null,
  "right" text not null,
  center  text,
  upvotes integer not null default 0,
  created_at timestamptz not null default now()
);

create index on handshakes (created_at, upvotes desc);

alter table handshakes enable row level security;
create policy "read all"   on handshakes for select using (true);
create policy "insert all" on handshakes for insert with check (true);

-- SECURITY DEFINER so anon user can execute UPDATE via RPC without UPDATE RLS policy
create or replace function increment_upvote(row_id uuid)
returns void language sql security definer as $$
  update handshakes set upvotes = upvotes + 1 where id = row_id;
$$;
```

### Supabase Clients (`lib/supabase.ts`)
Two exports:
- `supabaseBrowser` — `createClient(url, anonKey)` for client components
- `supabaseServer` — created via `@supabase/ssr` `createServerClient` for server components/API routes (uses cookies)

---

## 8. OG Image — Font Loading

`/api/og/route.tsx` must fetch the font at request time:
```ts
const fontData = await fetch(
  'https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK0nRgJ0GqfA.woff2' // or .ttf
).then(r => r.arrayBuffer())
```
Pass `fontData` to `ImageResponse` `fonts` option.

---

## 9. Seed Data (`lib/seeds.ts`)

40+ combos exported as `SEEDS: Array<{ left: string; right: string; center: string }>`.

Includes all items from the original brief plus extras:
1. people who wake up at 5am / people who stay up until 5am / telling everyone about their sleep schedule
2. iphone users / android users / judging people with green bubbles
3. frontend devs / backend devs / blaming devops
4. vegans / carnivores / making their diet a personality
5. people who hate mondays / people who love mondays / talking about it constantly
6. tea drinkers / coffee drinkers / judging the other side
7. gym rats / people who never exercise / owning gym clothes
8. introverts / extroverts / cancelling plans
9. chrome users / safari users / having too many tabs open
10. dog people / cat people / thinking their pet is superior
11. people who reply instantly / people who leave you on read / being tired
12. marvel fans / dc fans / watching every single one anyway
13. windows users / mac users / spending too much on their setup
14. tourists / locals / complaining about tourists
(+ 26 more original combos to reach 40+)

First 14 combos are pre-seeded into Supabase via SQL in README (INSERT statements).

Random button picks one at random from SEEDS and fills inputs.

---

## 10. Loading Splash (`components/Splash.tsx`)

- First visit only: check `sessionStorage.getItem('seen-splash')` — if present, skip
- Full-screen white overlay (`z-index: 50`)
- Centered logo text animates: `opacity 0 → 1` over `0.5s`
- Stays fully visible from `0.5s → 1.2s`
- Fades out: `opacity 1 → 0` over `0.3s` (starts at `1.2s`, ends at `1.5s`)
- Unmounts from DOM after fade-out completes
- Set `sessionStorage.setItem('seen-splash', '1')` on first show

---

## 11. File Structure

```
app/
  page.tsx               # Generator / home (client component)
  layout.tsx             # Root layout — fonts, Splash
  wall/
    page.tsx             # Community feed + leaderboard
  s/
    page.tsx             # Shareable meme page (OG tags)
  api/
    og/
      route.tsx          # Dynamic OG image (edge runtime)
    upvote/
      route.tsx          # POST upvote → Supabase RPC
components/
  Handshake.tsx          # Meme canvas
  Marquee.tsx            # Infinite scrolling ticker
  Card.tsx               # Community feed card
  Splash.tsx             # Loading splash overlay
lib/
  supabase.ts            # Browser + server Supabase clients
  seeds.ts               # 40+ seed combos
public/
vercel.json
.env.example
README.md
```

---

## 12. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 13. Deployment

- `vercel.json` — included (empty or minimal, Next.js 14 app router needs no special config)
- Node.js 18+
- Edge runtime for `/api/og` only

---

## 14. Mobile Responsiveness

- Meme canvas: `max-width: 100%`, shrinks on small screens
- Input row: stacks to single column below `sm` (640px)
- Card grid: 3-col → 2-col (`md`) → 1-col (`sm`)
- Nav: wraps or scrolls horizontally on very small screens
- All font sizes slightly reduced on mobile via Tailwind responsive prefixes

---

## Out of Scope (v1)

- User authentication
- Comments on cards
- Edit/delete submissions
- Server-side rate limiting on upvotes
