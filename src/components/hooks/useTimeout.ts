import { useCallback, useEffect, useRef } from 'react'

export function useTimeout(callback: () => any, delay: number) {
  const firstRenderRef = useRef(true)
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const set = useCallback(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay)
  }, [delay])

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    set()
    return clear
  }, [delay, set, clear])

  const reset = useCallback(() => {
    clear()
    set()
  }, [clear, set])

  return [reset, clear]
}
