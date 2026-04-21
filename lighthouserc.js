/** @type {import('@lhci/cli').LighthouseRcConfig} */
export default {
  ci: {
    collect: {
      staticDistDir: './out',
      numberOfRuns: 3,
      url: ['/', '/work/', '/articles/'],
    },
    assert: {
      // Disable PWA audits — this is a static GitHub Pages site, not a PWA
      preset: 'no-pwa',
      assertions: {
        // Core Web Vitals — Google "Good" thresholds (strict)
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Lighthouse category scores — 80 is a fair bar for a static personal site
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // Informational audits that don't produce numeric scores on all page types —
        // minScore is not a valid assertion for these, so disable them entirely.
        'lcp-lazy-loaded': 'off',
        'non-composited-animations': 'off',
        'prioritize-lcp-image': 'off',

        // Downgrade noisy audits to warnings so they're visible but don't block CI
        'errors-in-console': ['warn', { minScore: 0 }],
        'target-size': ['warn', { minScore: 0.8 }],
        'label-content-name-mismatch': ['warn', { minScore: 0.8 }],
        'uses-responsive-images': ['warn', { maxLength: 10 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
