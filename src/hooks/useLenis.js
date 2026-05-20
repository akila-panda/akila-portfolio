import { useEffect } from 'react'

export function useLenis(callback, deps = []) {
  useEffect(() => {
    const lenis = window.lenis
    if (!lenis || !callback) return
    lenis.on('scroll', callback)
    return () => lenis.off('scroll', callback)
  }, deps)
}