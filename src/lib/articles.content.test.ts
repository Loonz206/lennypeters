import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

import { getAllArticleMetas } from '@/lib/articles'

const slug = 'keeping-ai-agents-honest-os-native-secrets-storage-no-plaintext-required'
const articlePath = path.join(process.cwd(), 'content', 'articles', `${slug}.md`)

describe('article content files', () => {
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
})
