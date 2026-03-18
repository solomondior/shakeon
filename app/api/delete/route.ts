import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { id, secret } = await req.json()
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'invalid id' }, { status: 400 })
    }
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.from('handshakes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
