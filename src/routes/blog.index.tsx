import { createFileRoute } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import type { Post } from 'content-collections';
import { PostList } from '../components/PostList.js';
import { SocialLinks } from '../components/SocialLinks';
import { parseDate } from '../utils/date.js';

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  ssr: true,
  head: () => ({
    meta: [
      { title: 'Colby Leiske' },
      { name: 'description', content: 'Browse all blog posts' },
      { property: 'og:title', content: 'Colby Leiske' },
      { property: 'og:description', content: 'Browse all blog posts' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Colby Leiske' },
      { name: 'twitter:description', content: 'Browse all blog posts' },
    ],
    links: [
      { rel: 'canonical', href: 'https://leiske.dev/blog' },
    ],
  }),
});

function BlogIndex() {
  const sortedPosts = allPosts
    .filter((post: Post) => !post.test)
    .sort((a: Post, b: Post) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <PostList posts={sortedPosts} />
      <div className="mt-12 pt-8 border-t">
        <SocialLinks />
      </div>
    </div>
  );
}
