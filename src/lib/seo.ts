const FALLBACK_SITE_URL = 'https://lennypeters.com'

export const SITE_NAME = 'Lenny Peters'
export const SITE_TITLE = 'Lenny Peters — Web Engineer'
export const SITE_DESCRIPTION =
  'Web Engineer crafting fast, accessible, and beautiful web experiences.'
export const SOCIAL_HANDLE = '@lennypeters'
export const DEFAULT_OG_IMAGE = '/file.svg'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/+$/, '')

export function toAbsoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString()
}
