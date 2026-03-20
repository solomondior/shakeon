import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Handshake from '@/components/Handshake'

interface Props {
  searchParams: Promise<{ l?: string; r?: string; c?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const l = params.l ?? ''
  const r = params.r ?? ''
  const c = params.c ?? ''
  const ogUrl = `/api/og?l=${encodeURIComponent(l)}&r=${encodeURIComponent(r)}&c=${encodeURIComponent(c)}`

  return {
    title: `${l} 🤝 ${r} — Handshake`,
    description: c ? `"${c}"` : 'Two sides. One handshake.',
    openGraph: {
      title: `${l} 🤝 ${r}`,
      description: c ? `"${c}"` : 'Two sides. One handshake.',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${l} 🤝 ${r}`,
      description: c ? `"${c}"` : 'Two sides. One handshake.',
      images: [ogUrl],
    },
  }
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams
  const l = params.l ?? ''
  const r = params.r ?? ''
  const c = params.c ?? ''

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p
          className="text-[8px] text-gray-400 mb-8"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          shared handshake
        </p>
        <Handshake left={l} right={r} center={c} />
        <div className="mt-8">
          <a
            href={`/?l=${encodeURIComponent(l)}&r=${encodeURIComponent(r)}&c=${encodeURIComponent(c)}`}
            className="inline-block bg-[#FFD600] border border-black rounded-lg px-5 py-3
                       text-[9px] leading-none shadow-[3px_3px_0_#111] transition-all
                       hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111]
                       text-black"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            make your own →
          </a>
        </div>
      </div>
    </main>
  )
}
