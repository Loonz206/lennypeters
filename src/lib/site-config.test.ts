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
})
