import { defineCollection, defineConfig } from '@content-collections/core'
import matter from 'gray-matter'
import { z } from 'zod'
import { estimateReadingTime } from './src/utils/reading-time.js'

const posts = defineCollection({
  name: 'posts',
  directory: './posts',
  include: '*.md',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    wip: z.boolean().optional(),
    content: z.string(),
  }),
  transform: (document) => {
    const { content: body } = matter(document.content)
    const readingTime = estimateReadingTime(body)

    return {
      title: document.title,
      date: document.date,
      description: document.description,
      slug: document._meta.path,
      tags: document.tags,
      wip: document.wip,
      content: body,
      readingTime,
    }
  },
})

const pages = defineCollection({
  name: 'pages',
  directory: './src/pages',
  include: '*.md',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    content: z.string(),
  }),
  transform: (document) => {
    const { content: body } = matter(document.content)
    
    return {
      title: document.title,
      slug: document.slug,
      description: document.description,
      content: body,
    }
  },
})

export default defineConfig({
  collections: [posts, pages],
})
