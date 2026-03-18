# ShakeOn 🤝

> Build handshake memes. Two sides. One truth.

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key (Settings → API) |

## Supabase Setup

Run this SQL in your Supabase SQL editor (Database → SQL Editor):

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

-- SECURITY DEFINER lets anon users trigger an UPDATE via RPC
create or replace function increment_upvote(row_id uuid)
returns void language sql security definer as $$
  update handshakes set upvotes = upvotes + 1 where id = row_id;
$$;
```

### Seed starter submissions

```sql
insert into handshakes ("left", "right", center) values
  ('people who wake up at 5am', 'people who stay up until 5am', 'telling everyone about their sleep schedule'),
  ('iphone users', 'android users', 'judging people with green bubbles'),
  ('frontend devs', 'backend devs', 'blaming devops'),
  ('vegans', 'carnivores', 'making their diet a personality'),
  ('people who hate mondays', 'people who love mondays', 'talking about it constantly'),
  ('tea drinkers', 'coffee drinkers', 'judging the other side'),
  ('gym rats', 'people who never exercise', 'owning gym clothes'),
  ('introverts', 'extroverts', 'cancelling plans'),
  ('chrome users', 'safari users', 'having too many tabs open'),
  ('dog people', 'cat people', 'thinking their pet is superior'),
  ('people who reply instantly', 'people who leave you on read', 'being tired'),
  ('marvel fans', 'dc fans', 'watching every single one anyway'),
  ('windows users', 'mac users', 'spending too much on their setup'),
  ('tourists', 'locals', 'complaining about tourists');
```

## Deployment

1. Push to GitHub
2. Import at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Postgres + RLS
- [html2canvas](https://html2canvas.hertzen.com) — PNG download
- [@vercel/og](https://vercel.com/docs/og-image-generation) — OG image generation
- [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) — pixel font
