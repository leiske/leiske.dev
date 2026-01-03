import { PostList } from '../components/PostList.js';
import { getAllPosts } from '../lib/posts.js';

export function Home() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>
      <PostList posts={recentPosts} />
    </div>
  );
}
