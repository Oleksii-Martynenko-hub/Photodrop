import { useEffect, useRef } from 'react'

export const useDidMountEffect = (
  func: React.EffectCallback,
  deps?: React.DependencyList | undefined,
): void => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      func()
    } else {
      didMount.current = true
    }
  }, deps)
}
