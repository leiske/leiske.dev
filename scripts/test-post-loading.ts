import { getPostBySlug } from '../src/lib/posts.ts';

const post = getPostBySlug('opencode-cursor-thoughts');

if (post) {
  console.log('✓ Post loaded successfully');
  console.log('Title:', post.title);
  console.log('Date:', post.date);
  console.log('Reading time:', post.readingTime, 'minutes');
  console.log('Tags:', post.tags);
  console.log('Description:', post.description);
  console.log('Content preview:', post.content.substring(0, 100) + '...');
} else {
  console.log('✗ Post not found or failed to parse');
}