'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useScrollProgress } from '../hooks'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({ children }) {
  const scrollProgress = useScrollProgress()
  const pathname = usePathname()
  const isWorkflowPage = pathname.startsWith('/workflow/')

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const id = hash.replace('#', '')
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 80)
      return () => clearTimeout(timer)
    }
    if (pathname === '/') window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <>
      {!isWorkflowPage && <Navbar scrollProgress={scrollProgress} />}
      {children}
      {!isWorkflowPage && <Footer />}
    </>
  )
}
