'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'generate' },
  { href: '/wall', label: 'wall' },
  { href: 'https://twitter.com/intent/tweet?text=Check+out+ShakeOn+%F0%9F%A4%9D&url=https://shakeon.vercel.app', label: 'twitter', external: true },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="p-4 border-b border-gray-100">
      <div className="inline-flex border border-black rounded overflow-hidden">
        {links.map((link, i) => {
          const isActive = link.href === '/'
            ? pathname === '/' || pathname === '/s'
            : pathname.startsWith(link.href)
          const isLast = i === links.length - 1
          const cls = [
            'px-4 py-2 text-[9px] leading-none font-pixel transition-colors',
            !isLast ? 'border-r border-black' : '',
            isActive ? 'bg-black text-white hover:bg-black' : 'bg-white text-black hover:bg-gray-100',
          ].join(' ')

          if ('external' in link && link.external) {
            return (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {link.label}
              </a>
            )
          }
          return (
            <Link key={link.href} href={link.href} className={cls}>
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
