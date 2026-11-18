import fs from 'node:fs'
import path from 'node:path'

describe('Lighthouse performance budget', () => {
  const configPath = path.resolve(process.cwd(), '.lighthouserc.json')
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

  test('collects exactly three Lighthouse runs', () => {
    expect(config.ci.collect.numberOfRuns).toBe(3)
  })

  test('enforces the requested performance and DOM thresholds', () => {
    expect(config.ci.assert.assertions).toMatchObject({
      'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
      'categories:best-practices': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
      interactive: ['error', { maxNumericValue: 3000, aggregationMethod: 'median' }],
      'cumulative-layout-shift': ['error', { maxNumericValue: 0.1, aggregationMethod: 'median' }],
      'server-response-time': ['error', { maxNumericValue: 600, aggregationMethod: 'median' }],
      'largest-contentful-paint': ['error', { maxNumericValue: 2500, aggregationMethod: 'median' }],
      'dom-size-insight': ['error', { maxNumericValue: 1500, aggregationMethod: 'median' }],
    })
  })

  test('the arithmetic-mean check includes the three-second DOM load budget', () => {
    const scriptPath = path.resolve(process.cwd(), 'scripts/check-lighthouse-budget.mjs')
    const script = fs.readFileSync(scriptPath, 'utf8')

    expect(script).toContain("'dom-content-loaded'")
    expect(script).toContain('observedDomContentLoaded')
    expect(script).toContain('max: 3000')
  })
})
