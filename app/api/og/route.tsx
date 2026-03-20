import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const left   = searchParams.get('l') ?? ''
  const right  = searchParams.get('r') ?? ''
  const center = searchParams.get('c') ?? ''

  // Fetch Press Start 2P font — must be done at request time on edge runtime
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK0nRgJ0GqfA.ttf'
  ).then(r => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          fontFamily: '"PressStart2P"',
          gap: '32px',
          padding: '60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <span style={{ fontSize: '36px', textAlign: 'right', maxWidth: '320px', lineHeight: 1.6, color: '#111' }}>
            {left}
          </span>
          <span style={{ fontSize: '120px', lineHeight: 1 }}>🤝</span>
          <span style={{ fontSize: '36px', textAlign: 'left', maxWidth: '320px', lineHeight: 1.6, color: '#111' }}>
            {right}
          </span>
        </div>
        {center && (
          <div
            style={{
              backgroundColor: '#FFD600',
              border: '2px solid #111',
              borderRadius: '40px',
              padding: '16px 40px',
              fontSize: '22px',
              color: '#111',
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {center}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '14px',
            color: '#aaa',
          }}
        >
          handshake
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'PressStart2P', data: fontData, style: 'normal' }],
    }
  )
}
