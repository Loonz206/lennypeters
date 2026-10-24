import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

jest.mock('unified', () => ({
  unified: () => ({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({ toString: () => '<p>rendered</p>' }),
  }),
}))
jest.mock('remark-parse', () => ({ default: jest.fn() }))
jest.mock('remark-rehype', () => ({ default: jest.fn() }))
jest.mock('rehype-stringify', () => ({ default: jest.fn() }))
jest.mock('rehype-pretty-code', () => ({ default: jest.fn() }))
jest.mock('rehype-slug', () => ({ default: jest.fn() }))

import { getAllArticleMetas, getArticleBySlug } from '@/lib/articles'

const slug = 'keeping-ai-agents-honest-os-native-secrets-storage-no-plaintext-required'
const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`)

describe('article content files', () => {
  it('includes the VS Code Copilot MCP article in the article index', () => {
    const vscodeMcpSlug = 'setting-up-and-migrating-vscode-copilot-mcp-servers'
    const article = getAllArticleMetas().find(meta => meta.slug === vscodeMcpSlug)

    expect(article).toMatchObject({
      slug: vscodeMcpSlug,
      title: 'Setting Up and Migrating VS Code Copilot MCP Servers',
      date: '2026-10-23',
    })
    expect(article?.tags).toEqual(
      expect.arrayContaining(['GitHub Copilot', 'VS Code', 'MCP', 'Developer Tools'])
    )
  })

  it('includes the npm dependency pinning article in the article index', () => {
    const npmPinningSlug = 'pinning-versions-of-npm-modules'
    const article = getAllArticleMetas().find(meta => meta.slug === npmPinningSlug)

    expect(article).toMatchObject({
      slug: npmPinningSlug,
      title: 'Pinning NPM Modules to Reduce Supply Chain Risk',
      date: '2026-10-24',
    })
    expect(article?.tags).toEqual(
      expect.arrayContaining([
        'npm',
        'Security',
        'Supply Chain',
        'Dependency Management',
        'Node.js',
      ])
    )
  })

  it('includes the OS-native secrets article in the article index', () => {
    const article = getAllArticleMetas().find(meta => meta.slug === slug)

    expect(article).toMatchObject({
      slug,
      title: 'Keeping AI Agents Honest: OS-Native Secrets Storage, No Plaintext Required',
      date: '2026-08-19',
    })
    expect(article?.tags).toEqual(
      expect.arrayContaining(['AI', 'Security', 'Secrets Management', 'Developer Tools'])
    )
  })

  it('contains the expected platform-specific sections in the markdown source', () => {
    const fileContents = fs.readFileSync(articlePath, 'utf8')
    const { content } = matter(fileContents)

    expect(content).toContain('## macOS: Keychain via `security`')
    expect(content).toContain('## Windows: PowerShell SecretManagement + SecretStore')
    expect(content).toContain('## Linux: Secret Service with `secret-tool`')
    expect(content).toContain('## Cross-platform abstraction: Python `keyring`')
    expect(content).toContain('## Defense in depth: catch mistakes anyway')
  })

  it('renders the OS-native secrets article to HTML via getArticleBySlug', async () => {
    const article = await getArticleBySlug(slug)

    expect(article).not.toBeNull()
    expect(article?.meta.slug).toBe(slug)
    expect(article?.meta.title).toBe(
      'Keeping AI Agents Honest: OS-Native Secrets Storage, No Plaintext Required'
    )
    expect(article?.contentHtml).toBe('<p>rendered</p>')
  })
})
