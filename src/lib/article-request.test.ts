import { buildArticleRequestContext, getIssueFormField, slugifyTopic } from './article-request.js'

describe('article request helpers', () => {
  it('extracts the topic from the issue form body for article workflows', () => {
    const issueBody = `### Topic

Just in time secret management

### Description

Title: "Keeping AI Agents Honest"

### Tags

_No response_
`

    expect(getIssueFormField(issueBody, 'Topic')).toBe('Just in time secret management')
    expect(buildArticleRequestContext({ issueTitle: '[Article]', issueBody })).toMatchObject({
      topic: 'Just in time secret management',
      slug: 'just-in-time-secret-management',
      branch: 'article/just-in-time-secret-management',
      commitTitle: 'feat(article): add article — Just in time secret management',
      prTitle: 'feat(article): Just in time secret management',
    })
  })

  it('falls back to the issue title when the topic field is missing', () => {
    expect(
      buildArticleRequestContext({
        issueTitle: 'Server Components streaming patterns',
        issueBody: '### Description\n\nFocus on practical examples.\n',
      })
    ).toMatchObject({
      topic: 'Server Components streaming patterns',
      slug: 'server-components-streaming-patterns',
    })
  })

  it('treats the issue form no-response placeholder as empty', () => {
    expect(
      buildArticleRequestContext({
        issueTitle: 'Fallback title',
        issueBody: '### Topic\n\n_No response_\n',
      })
    ).toMatchObject({
      topic: 'Fallback title',
      slug: 'fallback-title',
    })
  })

  it('normalizes topic text into a stable article slug', () => {
    expect(slugifyTopic('  React 19 & Next.js 15: What changed?  ')).toBe(
      'react-19-nextjs-15-what-changed'
    )
  })
})
