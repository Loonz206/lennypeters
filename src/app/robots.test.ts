import robots from './robots'
import { SITE_URL } from '@/lib/seo'

describe('robots', () => {
  it('returns the robots.txt configuration', () => {
    const result = robots()

    expect(result.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
    expect(result.host).toBe(SITE_URL)
  })
})
