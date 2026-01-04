import { createFileRoute } from '@tanstack/react-router'
import { generateFeed } from '../utils/feed.js'

export const Route = createFileRoute('/atom.xml')({
  server: {
    handlers: {
      GET: async () => {
        const feed = generateFeed()
        return new Response(feed.atom1(), {
          headers: {
            'Content-Type': 'application/atom+xml',
          },
        })
      },
    },
  },
})
