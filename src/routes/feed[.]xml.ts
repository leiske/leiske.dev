import { createFileRoute } from '@tanstack/react-router'
import { generateFeed } from '../utils/feed.js'

export const Route = createFileRoute('/feed.xml')({
  server: {
    handlers: {
      GET: async () => {
        const feed = generateFeed()
        return new Response(feed.rss2(), {
          headers: {
            'Content-Type': 'application/rss+xml',
          },
        })
      },
    },
  },
})
