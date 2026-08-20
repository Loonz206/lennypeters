import type { Metadata, Viewport } from 'next'
import Header from '@/components/header'
import Main from '@/components/main'
import Footer from '@/components/footer'
import {
  BASE_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_HANDLE,
  toAbsoluteUrl,
} from '@/lib/seo'
import '@/styles/global.scss'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: `${BASE_PATH}/manifest.webmanifest`,
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.ico`, sizes: 'any' },
      { url: `${BASE_PATH}/favicon.svg`, type: 'image/svg+xml', sizes: 'any' },
      { url: `${BASE_PATH}/favicon-32x32.png`, type: 'image/png', sizes: '32x32' },
      { url: `${BASE_PATH}/favicon-16.png`, type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: `${BASE_PATH}/favicon-180x180.png`, sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: `${BASE_PATH}/safari-pinned-tab.svg`, color: '#00F0FF' }],
  },
  alternates: {
    canonical: `${BASE_PATH}/`,
  },
  openGraph: {
    type: 'website',
    url: `${BASE_PATH}/`,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    creator: SOCIAL_HANDLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#0E0E0E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${toAbsoluteUrl('/articles/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: 'Senior Software Engineer II',
    sameAs: ['https://github.com/Loonz206', 'https://www.linkedin.com/in/lenny-peters'],
  }

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  )
}
