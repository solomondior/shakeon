import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'
import Splash from '@/components/Splash'
import HofBanner from '@/components/HofBanner'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShakeOn — The Meme That Unites',
  description: 'Build handshake memes. Two sides. One truth.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body className="bg-white text-black antialiased">
        <Splash />
        <HofBanner />
        {children}
      </body>
    </html>
  )
}
