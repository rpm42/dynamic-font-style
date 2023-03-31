import { useState, useEffect } from 'react'
import { BehaviorSubject, Observable } from 'rxjs'

export function useObservable<T>(ob$: Observable<T>, initialValue?: T): [T] {
  const [value, set] = useState<T>(initialValue)
  useEffect(() => {
    const sub = ob$.subscribe(set)
    return () => sub?.unsubscribe()
  })
  return [value]
}

export function useBehaviorSubject<T>(bs$: BehaviorSubject<T>): [T, (value: T) => void] {
  const [value, set] = useState<T>(bs$.value)
  useEffect(() => {
    const sub = bs$.subscribe(set)
    return () => sub?.unsubscribe()
  })
  return [value, bs$.next.bind(bs$)]
}

export const isBrowser = () => typeof window !== 'undefined'
