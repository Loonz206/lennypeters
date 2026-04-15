/** @type {import('@lhci/cli').LighthouseRcConfig} */
export default {
  ci: {
    collect: {
      // Serve the static export produced by `npm run build`
      staticDistDir: './out',
      // Run Lighthouse three times per URL for reliable medians
      numberOfRuns: 3,
      // Pages to audit
      url: ['/', '/work/', '/articles/'],
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // ── Core Web Vitals ─────────────────────────────────────────────
        // LCP ≤ 2500 ms (Google "Good" threshold)
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        // TBT ≤ 200 ms (proxy for FID / INP — Google "Good" threshold)
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        // CLS ≤ 0.1 (Google "Good" threshold)
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // ── Additional Lighthouse score gates ───────────────────────────
        // All four Lighthouse categories must score ≥ 90 (Google "Good")
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // ── Additional performance budget items ─────────────────────────
        // FCP ≤ 1800 ms (Google "Good" threshold)
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        // Speed Index ≤ 3400 ms (Lighthouse "Good" range)
        'speed-index': ['error', { maxNumericValue: 3400 }],
        // TTI ≤ 3800 ms (Lighthouse "Good" range)
        interactive: ['error', { maxNumericValue: 3800 }],

        // ── Audits relaxed from the recommended preset ──────────────────
        // The site is a static export — no PWA / service worker is expected
        'service-worker': 'off',
        'installable-manifest': 'off',
        'apple-touch-icon': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',
        'maskable-icon': 'off',
        // HTTP → HTTPS redirect is handled by the host, not the app
        'redirects-http': 'off',
        // Uses-http2 is not applicable for a static CDN host
        'uses-http2': 'off',
        // ── Audits that produce no score (NaN) in a static export ─────────────
        // These audits are "not applicable" for static pages with no LCP image element
        // or no non-composited animations; minScore is not a valid assertion for them.
        'lcp-lazy-loaded': 'off',
        'prioritize-lcp-image': 'off',
        'non-composited-animations': 'off',
        // ── Static-export image limitations ─────────────────────────────────
        // unoptimized: true (required for `output: export`) means no srcset is
        // generated. These audits cannot pass without a server-side optimizer.
        'uses-responsive-images': 'off',
        'image-size-responsive': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
