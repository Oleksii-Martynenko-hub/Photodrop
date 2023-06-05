import { useEffect, useState, RefObject } from 'react'

export default function useObserver(ref: RefObject<Element | undefined>, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (ref.current == null || ref.current == undefined) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin,
    })
    observer.observe(ref.current)

    return () => {
      if (ref.current == null) return
      observer.unobserve(ref.current)
    }
  }, [ref.current, rootMargin])

  return isVisible
}
