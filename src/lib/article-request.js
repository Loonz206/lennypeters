const ISSUE_FORM_NO_RESPONSE = '_No response_'

function normalizeFieldValue(value) {
  if (typeof value !== 'string') return ''

  const normalized = value.trim()
  return normalized === ISSUE_FORM_NO_RESPONSE ? '' : normalized
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getIssueFormField(issueBody, fieldLabel) {
  if (typeof issueBody !== 'string' || issueBody.trim().length === 0) return ''

  const pattern = new RegExp(
    `(?:^|\\n)### ${escapeRegExp(fieldLabel)}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`
  )
  const match = pattern.exec(issueBody)

  return normalizeFieldValue(match?.[1] ?? '')
}

function slugifyTopic(value) {
  const slug = normalizeFieldValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9 \-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-$/g, '')

  return slug || 'article'
}

function buildArticleRequestContext({ issueTitle, issueBody }) {
  const topic =
    getIssueFormField(issueBody, 'Topic') || normalizeFieldValue(issueTitle) || 'Article'
  const slug = slugifyTopic(topic)

  return {
    topic,
    slug,
    branch: `article/${slug}`,
    commitTitle: `feat(article): add article — ${topic}`,
    prTitle: `feat(article): ${topic}`,
  }
}

module.exports = {
  buildArticleRequestContext,
  getIssueFormField,
  slugifyTopic,
}
