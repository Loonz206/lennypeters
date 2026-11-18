import fs from 'node:fs'
import path from 'node:path'

const lighthouseDir = path.resolve('.lighthouseci')
const runFiles = fs
  .readdirSync(lighthouseDir)
  .filter(file => /^lhr-.*\.json$/.test(file))
  .map(file => path.join(lighthouseDir, file))

const budgets = {
  interactive: { label: 'Time to interactive', max: 3000, unit: 'ms' },
  'dom-content-loaded': {
    label: 'DOM content loaded',
    max: 3000,
    unit: 'ms',
    getValue: report =>
      report.audits.metrics?.details?.items?.[0]?.observedDomContentLoaded,
  },
  'cumulative-layout-shift': { label: 'Cumulative layout shift', max: 0.1, unit: '' },
  'server-response-time': { label: 'Server response time (TTFB)', max: 600, unit: 'ms' },
  'largest-contentful-paint': { label: 'Largest contentful paint', max: 2500, unit: 'ms' },
  'dom-size-insight': { label: 'DOM size', max: 1500, unit: ' elements' },
}

const reports = runFiles.map(file => JSON.parse(fs.readFileSync(file, 'utf8')))
const reportsByUrl = new Map()

for (const report of reports) {
  const url = report.finalUrl || report.requestedUrl
  const urlReports = reportsByUrl.get(url) ?? []
  urlReports.push(report)
  reportsByUrl.set(url, urlReports)
}

if (reportsByUrl.size === 0) {
  throw new Error('No Lighthouse reports found.')
}

for (const [url, urlReports] of reportsByUrl) {
  if (urlReports.length !== 3) {
    throw new Error(`Expected exactly 3 Lighthouse runs for ${url}, received ${urlReports.length}.`)
  }
}

const failures = []

for (const [url, urlReports] of reportsByUrl) {
  console.log(`\n${url}`)

  for (const [auditId, budget] of Object.entries(budgets)) {
    const values = urlReports.map(report =>
      budget.getValue
        ? budget.getValue(report)
        : report.audits[auditId]?.numericValue,
    )

    if (values.some(value => typeof value !== 'number')) {
      failures.push(`${url} — ${budget.label}: missing numeric audit value`)
      continue
    }

    const mean = values.reduce((total, value) => total + value, 0) / values.length
    const displayMean = mean.toFixed(budget.unit === '' ? 3 : 0)
    const displayLimit = budget.unit === '' ? budget.max.toFixed(1) : String(budget.max)

    console.log(`${budget.label}: ${displayMean}${budget.unit} (limit ${displayLimit}${budget.unit})`)

    if (mean > budget.max) {
      failures.push(`${url} — ${budget.label}: mean ${displayMean}${budget.unit} exceeds ${displayLimit}${budget.unit}`)
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Lighthouse performance budget failed:\n- ${failures.join('\n- ')}`)
}

console.log('Lighthouse performance budget passed (3-run arithmetic mean).')
