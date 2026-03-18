'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/s'

  const links = [
    { href: '/#generator', label: 'generate', scrollTo: 'generator' },
    { href: '/#wall',      label: 'wall',     scrollTo: 'wall' },
    { href: '/stats',      label: 'stats',    scrollTo: '' },
  ]

  function handleScroll(e: React.MouseEvent, scrollTo: string) {
    if (!isHome) return
    e.preventDefault()
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="p-4 border-b border-gray-100">
      <div className="inline-flex border border-black rounded overflow-hidden">
        {links.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={e => handleScroll(e, link.scrollTo)}
            className={`px-4 py-2 text-[9px] leading-none transition-colors ${i < links.length - 1 ? 'border-r border-black' : ''} bg-white text-black hover:bg-gray-100`}
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            {link.label}
          </Link>
        ))}
        <a
          href="https://twitter.com/intent/tweet?text=Check+out+ShakeOn+%F0%9F%A4%9D&url=https://shakeon.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-[9px] leading-none transition-colors bg-white text-black hover:bg-gray-100"
          style={{ fontFamily: 'var(--font-pixel)' }}
        >
          twitter
        </a>
      </div>
    </nav>
  )
}
