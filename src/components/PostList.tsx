import type { PostMeta } from '../types/post.js';

interface PostListProps {
  posts: PostMeta[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-gray-500">No posts available</p>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.slug} className="border-b pb-4 last:border-b-0">
          <a
            href={`/blog/${post.slug}/`}
            className="block text-xl font-semibold hover:text-blue-600 transition-colors"
          >
            {post.title}
          </a>
          <time className="text-sm text-gray-600">
            {new Date(post.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
          </time>
        </li>
      ))}
    </ul>
  );
}
