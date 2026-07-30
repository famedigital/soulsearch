'use client'

import { useEffect, useState } from 'react'

export function useSlideshow(count: number, autoPlay: boolean, interval: number) {
  const [index, setIndex] = useState(0)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!autoPlay || count <= 1) return
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % count), interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, count])

  // Guards against an out-of-range index if slides are removed from the CMS.
  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [index, count])

  return { index, setIndex, hasMounted }
}
