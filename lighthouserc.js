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
        // These audits return NaN (no numeric score) for informational-only audits;
        // minScore cannot be used with them — disable to prevent false failures
        'lcp-lazy-loaded': 'off',
        'non-composited-animations': 'off',
        'prioritize-lcp-image': 'off',
        // Static export uses images.unoptimized — Next.js cannot serve responsive
        // image variants or resize images, so these responsive-image audits are
        // N/A for this deployment model
        'uses-responsive-images': 'off',
        'image-size-responsive': 'off',
        // Image aspect-ratio audit flags fill images whose container aspect-ratio
        // differs from the image's natural aspect-ratio even when object-fit is set;
        // this is a known Lighthouse quirk with Next.js <Image fill> in static exports
        'image-aspect-ratio': 'off',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
