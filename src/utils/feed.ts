import { Feed } from 'feed'
import { allPosts } from 'content-collections'
import { parseDate } from './date'

export function generateFeed(): Feed {
  const feed = new Feed({
    title: 'Colby Leiske',
    description: 'Thoughts on software development, programming, and technology',
    id: 'https://leiske.dev',
    link: 'https://leiske.dev',
    language: 'en',
    copyright: `© ${new Date().getFullYear()} Colby Leiske`,
  })

  const posts = allPosts
    .filter((post) => post.test !== true)
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      description: post.description,
      link: `/blog/${post.slug}`,
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
