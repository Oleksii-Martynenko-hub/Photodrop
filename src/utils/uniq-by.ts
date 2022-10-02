export const uniqBy = <T>(arr: any[], predicate: ((o: any) => any) | string): T[] => {
  const cb = typeof predicate === 'function' ? predicate : (o: any) => o[predicate]

  return [
    ...arr
      .reduce((map: Map<string, T>, item) => {
        const key = item === null || item === undefined ? item : cb(item)

        map.has(key) || map.set(key, item)

        return map
      }, new Map())
      .values(),
  ]
}
