import { defineCollection, defineConfig } from '@content-collections/core'
import matter from 'gray-matter'
import { z } from 'zod'

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
    const wordCount = body.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    
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

export default defineConfig({
  collections: [posts],
})
