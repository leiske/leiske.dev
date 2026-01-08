import { Feed } from 'feed'
import { allPosts } from 'content-collections'
import { parseDate } from './date'

/**
 * Generates RSS 2.0 and Atom 1.0 feeds for the blog
 *
 * Creates a fully configured Feed object containing all published blog posts
 * sorted by date (newest first). Test posts are excluded automatically.
 * The feed includes proper metadata and can be converted to RSS or Atom format.
 *
 * @returns A configured Feed object ready to be serialized as RSS 2.0 or Atom 1.0
 *
 * @example
 * ```ts
 * import { generateFeed } from './utils/feed'
 *
 * const feed = generateFeed()
 *
 * // Get RSS 2.0 XML
 * const rssXml = feed.rss2()
 *
 * // Get Atom 1.0 XML
 * const atomXml = feed.atom1()
 * ```
 */
export function generateFeed(): Feed {
  const posts = allPosts
    .filter((post) => post.test !== true)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())

  const feed = new Feed({
    title: 'Colby Leiske',
    description: 'Thoughts on software development, programming, and technology',
    id: 'https://leiske.dev/',
    link: 'https://leiske.dev',
    language: 'en',
    copyright: `${new Date().getFullYear()} Colby Leiske`,
    feedLinks: {
      atom: 'https://leiske.dev/atom.xml',
    },
    updated: posts.length > 0 ? parseDate(posts[0].date) : new Date(),
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      description: post.description,
      link: `https://leiske.dev/blog/${post.slug}`,
      date: parseDate(post.date),
      author: [
        {
          name: 'Colby Leiske',
          email: 'colby.leiske@gmail.com',
        },
      ],
    })
  })

  return feed
}
