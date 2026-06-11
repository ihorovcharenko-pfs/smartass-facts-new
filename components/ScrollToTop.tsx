'use client'

import { useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function ScrollToTop() {
  const { pathname } = useApp()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
