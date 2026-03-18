import { createSupabaseServerClient } from '@/lib/supabase-server'
import type { Handshake } from '@/lib/supabase'
import Nav from '@/components/Nav'

const px  = { fontFamily: 'var(--font-pixel)' }
const ser = { fontFamily: 'Georgia, "Times New Roman", serif' }

export default async function LorePage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('handshakes')
    .select('*')
    .order('upvotes', { ascending: false })
    .limit(4)

  const notable = (data ?? []) as Handshake[]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="max-w-2xl mx-auto w-full px-6 py-16">

        {/* ── Header ── */}
        <div className="text-center mb-14 border-b border-gray-200 pb-10">
          <p className="text-[7px] text-gray-400 mb-3 tracking-widest uppercase" style={px}>
            official documentation
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4 leading-tight" style={ser}>
            The ShakeOn Accords
          </h1>
          <p className="text-sm text-gray-500 italic" style={ser}>
            A living record of shared truths. Established March 2026.
          </p>
        </div>

        {/* ── Origin ── */}
        <Section title="I. Origin">
          <p>
            ShakeOn was established in March 2026 following a period of unprecedented
            global disagreement. Two hands reached across the divide. The rest is history.
          </p>
          <p>
            The founders, whose identities remain undisclosed, observed that beneath every
            argument lay a truth neither side wished to acknowledge. The handshake was
            chosen as the symbol — ancient, universal, impossible to misinterpret.
          </p>
        </Section>

        {/* ── Mission ── */}
        <Section title="II. Mission Statement">
          <p className="text-lg font-medium leading-relaxed" style={{ ...ser, fontStyle: 'italic' }}>
            &ldquo;To document every truth that two opposing sides secretly share.&rdquo;
          </p>
        </Section>

        {/* ── Anatomy ── */}
        <Section title="III. Anatomy of a Handshake">
          <p className="mb-8">
            The ShakeOn format follows a precise three-part structure, each component
            carrying specific semantic weight within the taxonomy of shared truths.
          </p>

          {/* Diagram */}
          <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 my-8 select-none">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-right">
                <div className="inline-block border border-black rounded px-3 py-1.5 text-[8px] bg-white" style={px}>
                  people who reply instantly
                </div>
              </div>
              <div className="text-5xl leading-none">🤝</div>
              <div className="text-left">
                <div className="inline-block border border-black rounded px-3 py-1.5 text-[8px] bg-white" style={px}>
                  people who leave you on read
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="border border-gray-300 rounded-full px-5 py-1.5 text-[8px] bg-white text-gray-600" style={px}>
                being tired
              </div>
            </div>
            {/* Labels */}
            <div className="flex justify-between mt-8 px-2">
              <div className="text-center max-w-[120px]">
                <div className="w-px h-4 bg-gray-400 mx-auto mb-1" />
                <p className="text-[7px] text-gray-500 italic" style={ser}>
                  <strong>The Left Hand.</strong> A position held publicly.
                </p>
              </div>
              <div className="text-center max-w-[100px]">
                <div className="w-px h-4 bg-gray-400 mx-auto mb-1" />
                <p className="text-[7px] text-gray-500 italic" style={ser}>
                  <strong>The Center Label.</strong> The uncomfortable truth.
                </p>
              </div>
              <div className="text-center max-w-[120px]">
                <div className="w-px h-4 bg-gray-400 mx-auto mb-1" />
                <p className="text-[7px] text-gray-500 italic" style={ser}>
                  <strong>The Right Hand.</strong> Its public opposite.
                </p>
              </div>
            </div>
          </div>

          <p>
            When both hands and a center label are present, the formation is considered
            a <em>complete accord</em>. When the center label is absent, the handshake
            is classified as <em>implicit</em> — the truth is left to the reader.
          </p>
        </Section>

        {/* ── Notable Handshakes ── */}
        {notable.length > 0 && (
          <Section title="IV. Notable Handshakes">
            <p className="mb-8">
              The following handshakes have been preserved as historical artefacts,
              selected for their cultural resonance and documented reception.
            </p>
            <div className="space-y-6">
              {notable.map((item, i) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-[6px] text-gray-400 tracking-widest uppercase" style={px}>
                      Artefact {String(i + 1).padStart(3, '0')}
                    </span>
                    <span className="text-[6px] text-gray-400" style={px}>
                      ▲ {item.upvotes} recorded votes
                    </span>
                  </div>
                  <p className="text-[9px] text-black mb-2 leading-relaxed" style={px}>
                    {item.left} 🤝 {item.right}
                  </p>
                  {item.center && (
                    <p className="text-[7px] text-gray-500 italic mb-3" style={px}>
                      &quot;{item.center}&quot;
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 italic leading-relaxed" style={ser}>
                    Submitted{item.created_at ? ` on ${new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ' anonymously'}.
                    {item.upvotes > 0 ? ` Upvoted ${item.upvotes} times in the hours following publication.` : ''}
                    {' '}Its implications remain widely discussed.
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Timeline ── */}
        <Section title="V. Historical Timeline">
          <div className="space-y-0">
            {[
              ['March 2026', 'First handshake recorded. No witnesses. No context. Simply: two sides, one truth.'],
              ['March 2026', 'The Wall opens to the public. Submissions exceed all projections within the first hour.'],
              ['March 2026', 'The Hall of Fame induction threshold is established. The criteria: 50 upvotes. The significance: immeasurable.'],
              ['March 2026', 'The ShakeOn Accords are formalised in this document. History, now, is permanent.'],
            ].map(([date, event], i) => (
              <div key={i} className="flex gap-5 pb-8 relative">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-black mt-1.5 shrink-0" />
                  {i < 3 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
                </div>
                <div className="pb-2">
                  <p className="text-[7px] text-gray-400 mb-1" style={px}>{date}</p>
                  <p className="text-sm text-gray-700 leading-relaxed" style={ser}>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer quote ── */}
        <div className="mt-16 pt-10 border-t border-gray-200 text-center">
          <p className="text-lg text-gray-500 italic leading-relaxed" style={ser}>
            &ldquo;Every handshake tells a truth nobody wanted to admit.&rdquo;
          </p>
          <p className="text-[7px] text-gray-300 mt-3" style={px}>— The ShakeOn Accords, Preamble</p>
        </div>

      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2
        className="text-[8px] text-gray-400 tracking-widest uppercase mb-5 pb-3 border-b border-gray-100"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        {children}
      </div>
    </section>
  )
}
