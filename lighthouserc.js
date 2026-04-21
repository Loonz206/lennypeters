/** @type {import('@lhci/cli').LighthouseRcConfig} */
export default {
  ci: {
    collect: {
      staticDistDir: './out',
      numberOfRuns: 3,
      url: ['/', '/about/', '/articles/'],
    },
    assert: {
      // Disable PWA audits — this is a static GitHub Pages site, not a PWA
      preset: 'no-pwa',
      assertions: {
        // Core Web Vitals — Google "Good" thresholds
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Lighthouse category scores — 0.8 is a fair bar for a static personal site
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.8 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // These audits return NaN (no value) on pages that lack an LCP image or
        // animations, so "minScore" is not a valid assertion for them.
        // Disable to prevent spurious "Audit did not produce a value" failures.
        'lcp-lazy-loaded': 'off',
        'non-composited-animations': 'off',
        'prioritize-lcp-image': 'off',

        // Images are served unoptimized (required for static export to GitHub Pages).
        // uses-responsive-images will always flag oversized images in this setup;
        // downgrade to a warning so it is visible but does not block CI.
        // TODO: Replace with Next.js <Image> optimization once a CDN/server is added.
        'uses-responsive-images': ['warn', { maxLength: 20 }],

        // Downgrade noisy best-practices audits to warnings so they are visible
        // without blocking CI on a personal portfolio site.
        // Thresholds mirror the "Good" bar (0.9) so improvements are surfaced
        // as ⚠️  in CI output while not causing an exit-code-1 failure.
        'errors-in-console': ['warn', { minScore: 0.9 }],
        'target-size': ['warn', { minScore: 0.9 }],
        'label-content-name-mismatch': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
}
