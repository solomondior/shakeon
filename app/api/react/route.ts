import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const VALID = new Set(['laugh', 'skull', 'shake'])

export async function POST(req: NextRequest) {
  try {
    const { id, reaction } = await req.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 })
    }
    if (!VALID.has(reaction)) {
      return NextResponse.json({ error: 'invalid reaction' }, { status: 400 })
    }
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.rpc('increment_reaction', { row_id: id, reaction })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
