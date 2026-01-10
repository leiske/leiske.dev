import type { Post } from '../types/post.js';
import { Link } from '@tanstack/react-router';
import { Markdown } from './Markdown';
import { SocialLinks } from './SocialLinks';
import { formatDate } from '../utils/date.js';

interface PostContentProps {
  post: Post;
  nextPost: Post | null;
}

export function PostContent({ post, nextPost }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      
      {post.wip && (
        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full mb-6">
          Draft - Work in Progress
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
        <time>{formatDate(post.date)}</time>
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
      
      <Markdown content={post.content} className="prose prose-lg max-w-none" />
      
      <div className="mt-12 pt-8 border-t flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to home
          </Link>
          {nextPost && (
            <Link
              to="/blog/$slug"
              params={{ slug: nextPost.slug }}
              className="text-blue-600 hover:text-blue-800 font-medium"
              resetScroll={true}
            >
              Next post: {nextPost.title} →
            </Link>
          )}
        </div>
        <SocialLinks />
      </div>
    </article>
  );
}
