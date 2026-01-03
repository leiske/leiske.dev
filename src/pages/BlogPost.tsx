import { PostContent } from '../components/PostContent.js';
import { getAllPosts, getPostBySlug } from '../lib/posts.js';

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const currentPostIndex = allPosts.findIndex((p) => p.slug === slug);
  const nextPost = currentPostIndex > 0 ? allPosts[currentPostIndex - 1] : null;

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <a href="/" className="text-blue-600 hover:text-blue-800">
          ← Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PostContent post={post} nextPost={nextPost} />
    </div>
  );
}
