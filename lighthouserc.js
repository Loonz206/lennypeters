/** @type {import('@lhci/cli').LighthouseRcConfig} */
export default {
  ci: {
    collect: {
      staticDistDir: './out',
      numberOfRuns: 3,
      url: ['/', '/work/', '/articles/'],
    },
    assert: {
      assertions: {
        // Core Web Vitals — Google "Good" thresholds
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Lighthouse category scores — all four must reach ≥ 90
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
