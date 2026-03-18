'use client'
import { useEffect, useState } from 'react'

const KEY = 'shakeon_admin'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [secret, setSecret]   = useState<string | null>(null)

  useEffect(() => {
    // Check URL param — ?admin=<secret>
    const params = new URLSearchParams(window.location.search)
    const param  = params.get('admin')
    if (param) {
      localStorage.setItem(KEY, param)
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('admin')
      window.history.replaceState({}, '', url.toString())
    }

    const stored = localStorage.getItem(KEY)
    if (stored) { setIsAdmin(true); setSecret(stored) }
  }, [])

  return { isAdmin, secret }
}
