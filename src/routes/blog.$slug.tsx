import { createFileRoute, notFound } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import type { Post } from 'content-collections'
import { PostContent } from '../components/PostContent'
import { parseDate } from '../utils/date.js'

export const Route = createFileRoute('/blog/$slug')({
  ssr: true,
  loader: async ({ params }) => {
    const { slug } = params
    
    const post = allPosts.find((p: Post) => p.slug === slug)
    
    if (!post) {
      throw notFound()
    }
    
    const isDevelopment = import.meta.env.DEV
    
    if (!isDevelopment && post.test) {
      throw notFound()
    }
    
    const filteredPosts = allPosts
      .filter((p: Post) => !p.test)
      .sort((a: Post, b: Post) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
    
    const currentIndex = filteredPosts.findIndex((p: Post) => p.slug === slug)
    const nextPost = currentIndex > 0 ? filteredPosts[currentIndex - 1] : null
    
    return { post, nextPost }
  },
  
  head: ({ loaderData }) => {
    if (!loaderData) throw new Error('Loader data is required')
    
    return {
      meta: [
        { title: loaderData.post.title },
        { name: 'description', content: loaderData.post.description },
        { property: 'og:title', content: loaderData.post.title },
        { property: 'og:description', content: loaderData.post.description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `https://leiske.dev/blog/${loaderData.post.slug}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: loaderData.post.title },
        { name: 'twitter:description', content: loaderData.post.description },
      ],
      links: [
        { rel: 'canonical', href: `https://leiske.dev/blog/${loaderData.post.slug}` },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: loaderData.post.title,
            description: loaderData.post.description,
            datePublished: loaderData.post.date,
            keywords: loaderData.post.tags,
          }),
        },
      ],
    }
  },
  
  component: BlogPost,
})

function BlogPost() {
  const { post, nextPost } = Route.useLoaderData()
  
  return <PostContent post={post} nextPost={nextPost} />
}
