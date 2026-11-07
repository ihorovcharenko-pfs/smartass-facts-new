'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import '../../styles/comic.scss'

/** Tiny toast: const { toast, node } = useToast(); render {node}; call toast('Copied!'). */
export function useToast(ms = 3800) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toast = useCallback((m: string) => {
    setMsg(m)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), ms)
  }, [ms])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const node = msg ? <div className="cp-toast" role="status" aria-live="polite">{msg}</div> : null
  return { toast, node }
}
