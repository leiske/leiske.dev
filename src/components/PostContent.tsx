import type { Post } from '../types/post.js';

interface PostContentProps {
  post: Post;
  nextPost: Post | null;
}

export function PostContent({ post, nextPost }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
        <time>{new Date(post.date).toLocaleDateString()}</time>
        <span>•</span>
        <span>{post.readingTime} min read</span>
        {post.tags.length > 0 && (
          <>
            <span>•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-12 pt-8 border-t flex justify-between items-center">
        <a
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to home
        </a>
        {nextPost && (
          <a
            href={`/blog/${nextPost.slug}/`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Next post: {nextPost.title} →
          </a>
        )}
      </div>
    </article>
  );
}
