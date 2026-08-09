async function loadSiteConfigModule() {
  jest.resetModules()
  return import('@/lib/site-config')
}

afterEach(() => {
  jest.resetModules()
})

describe('site-config', () => {
  it('uses an explicitly configured base path', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ configuredBasePath: 'lennypeters' })).toBe('/lennypeters')
  })

  it('uses the root path for an explicitly configured custom domain', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ customDomain: 'lennypeters.com' })).toBe('')
  })

  it('uses the root path for an explicit custom site URL', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ siteUrl: 'https://lennypeters.com' })).toBe('')
  })

  it('infers the repository base path for project pages in GitHub Actions', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(
      resolveBasePath({
        githubActions: 'true',
        githubRepository: 'Loonz206/lennypeters',
      })
    ).toBe('/lennypeters')
  })

  it('uses the root path for a user pages repository', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(
      resolveBasePath({
        githubActions: 'true',
        githubRepository: 'Loonz206/Loonz206.github.io',
      })
    ).toBe('')
  })

  it('returns the configured base path unchanged when it already starts with "/"', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ configuredBasePath: '/docs' })).toBe('/docs')
  })

  it('returns an empty string when no options are provided', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({})).toBe('')
  })

  it('treats a configured base path of "/" as root', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ configuredBasePath: '/' })).toBe('')
  })

  it('treats a whitespace-only configured base path as root', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ configuredBasePath: '   ' })).toBe('')
  })

  it('ignores a blank custom domain', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ customDomain: '   ', siteUrl: 'https://lennypeters.com' })).toBe('')
  })

  it('returns the root path for a localhost site URL', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ siteUrl: 'https://localhost' })).toBe('')
  })

  it('returns the root path for a 127.0.0.1 site URL', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ siteUrl: 'http://127.0.0.1:3000' })).toBe('')
  })

  it('returns the root path for a github.io site URL', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ siteUrl: 'https://user.github.io' })).toBe('')
  })

  it('returns the root path when the site URL is invalid', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ siteUrl: 'not-a-valid-url' })).toBe('')
  })

  it('returns the root path when GitHub Actions is not enabled', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ githubRepository: 'Loonz206/lennypeters' })).toBe('')
  })

  it('returns the root path when the repository has no repo name', async () => {
    const { resolveBasePath } = await loadSiteConfigModule()

    expect(resolveBasePath({ githubActions: 'true', githubRepository: 'Loonz206' })).toBe('')
  })
})
