import { SITE_URL } from '@/lib/seo'
import robots from './robots'

describe('robots', () => {
  it('returns the robots.txt configuration', () => {
    const result = robots()

    expect(result.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`)
    expect(result.host).toBe(SITE_URL)
  })
})
