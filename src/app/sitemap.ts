import type { MetadataRoute } from 'next'
import { getAllArticleMetas } from '@/lib/articles'
import { toAbsoluteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: toAbsoluteUrl('/about/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/work/'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/articles/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const articleRoutes: MetadataRoute.Sitemap = getAllArticleMetas().map(article => ({
    url: toAbsoluteUrl(`/articles/${article.slug}/`),
    lastModified: new Date(article.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}
