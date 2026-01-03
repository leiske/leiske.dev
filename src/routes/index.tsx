import { createFileRoute } from '@tanstack/react-router';
import { allPosts } from '.content-collections/generated';
import type { Post } from '.content-collections/generated';
import { PostList } from '../components/PostList.js';

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: 'Leiske.dev - Blog' },
      { name: 'description', content: 'Thoughts on software development, programming, and technology' },
      { property: 'og:title', content: 'Leiske.dev - Blog' },
      { property: 'og:description', content: 'Thoughts on software development, programming, and technology' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Leiske.dev - Blog' },
      { name: 'twitter:description', content: 'Thoughts on software development, programming, and technology' },
    ],
  }),
});

function Home() {
  const recentPosts = allPosts
    .filter((post: Post) => !post.test)
    .sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>
      <PostList posts={recentPosts} />
    </div>
  );
}
