import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseJson<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue
  try {
    return JSON.parse(json) as T
  } catch {
    return defaultValue
  }
}

export function stringifyJson<T>(data: T): string {
  return JSON.stringify(data)
}
