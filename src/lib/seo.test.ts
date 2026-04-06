const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

function loadSeoModule(siteUrl?: string) {
  if (siteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl
  }

  jest.resetModules()
  return import('@/lib/seo')
}

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL
  }

  jest.resetModules()
})

describe('seo', () => {
  it('exports default site metadata constants', async () => {
    const seo = await loadSeoModule()

    expect(seo.SITE_NAME).toBe('Lenny Peters')
    expect(seo.SITE_TITLE).toBe('Lenny Peters — Web Engineer')
    expect(seo.SITE_DESCRIPTION).toBe(
      'Web Engineer crafting fast, accessible, and beautiful web experiences.'
    )
    expect(seo.SOCIAL_HANDLE).toBe('@lennypeters')
    expect(seo.DEFAULT_OG_IMAGE).toBe('/file.svg')
  })

  it('uses the fallback site URL when NEXT_PUBLIC_SITE_URL is not set', async () => {
    const seo = await loadSeoModule()

    expect(seo.SITE_URL).toBe('https://lennypeters.com')
  })

  it('strips trailing slashes from NEXT_PUBLIC_SITE_URL', async () => {
    const seo = await loadSeoModule('https://example.com///')

    expect(seo.SITE_URL).toBe('https://example.com')
  })

  it('builds absolute URLs from pathnames', async () => {
    const seo = await loadSeoModule('https://example.com/')

    expect(seo.toAbsoluteUrl('/about')).toBe('https://example.com/about')
    expect(seo.toAbsoluteUrl('articles')).toBe('https://example.com/articles')
  })
})
