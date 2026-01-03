import { createFileRoute } from '@tanstack/react-router';
import { allPosts } from 'content-collections';
import type { Post } from 'content-collections';
import { PostList } from '../components/PostList.js';

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: 'Leiske.dev - All Posts' },
      { name: 'description', content: 'Browse all blog posts' },
      { property: 'og:title', content: 'Leiske.dev - All Posts' },
      { property: 'og:description', content: 'Browse all blog posts' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Leiske.dev - All Posts' },
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
    .sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Posts</h1>
      <PostList posts={sortedPosts} />
    </div>
  );
}
