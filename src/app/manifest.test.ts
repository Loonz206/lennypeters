import manifest from './manifest'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from '@/lib/seo'

describe('manifest', () => {
  it('returns the app manifest metadata', () => {
    const result = manifest()

    expect(result.name).toBe(SITE_TITLE)
    expect(result.short_name).toBe(SITE_NAME)
    expect(result.description).toBe(SITE_DESCRIPTION)
    expect(result.start_url).toBe('/')
    expect(result.display).toBe('standalone')
    expect(result.background_color).toBe('#0E0E0E')
    expect(result.theme_color).toBe('#0E0E0E')
    expect(result.icons).toEqual([
      { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ])
  })
})
