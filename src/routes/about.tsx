import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Page } from 'content-collections'
import { PageContent } from '../components/PageContent'

export const Route = createFileRoute('/about')({
  ssr: true,
  loader: async () => {
    const { allPages } = await import('content-collections')
    const page = allPages.find((p: Page) => p.slug === 'about')

    if (!page) {
      throw redirect({
        to: '/404',
      })
    }

    return { page }
  },

  head: ({ loaderData }) => {
    if (!loaderData) throw new Error('Loader data is required')

    return {
      meta: [
        { title: loaderData.page.title },
        { name: 'description', content: loaderData.page.description },
        { property: 'og:title', content: loaderData.page.title },
        { property: 'og:description', content: loaderData.page.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://leiske.dev/about' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: loaderData.page.title },
        { name: 'twitter:description', content: loaderData.page.description },
      ],
      links: [
        { rel: 'canonical', href: 'https://leiske.dev/about' },
      ],
    }
  },

  component: AboutPage,
})

function AboutPage() {
  const { page } = Route.useLoaderData()

  return <PageContent page={page} />
}
