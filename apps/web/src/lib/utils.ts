/**
 * Joins className strings, ignoring falsy values.
 * Lightweight replacement for clsx + tailwind-merge to keep zero
 * required runtime dependencies in the UI library.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
