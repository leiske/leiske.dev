import matter from 'gray-matter';
import { marked } from 'marked';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Post } from '../types/post.js';

export function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = join(process.cwd(), 'posts', `${slug}.md`);

  try {
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const htmlContent = marked(content) as string;
    const readingTime = calculateReadingTime(content);

    if (!data.title) console.warn(`Missing 'title' in frontmatter for post: ${slug}`);
    if (!data.date) console.warn(`Missing 'date' in frontmatter for post: ${slug}`);
    if (!data.description) console.warn(`Missing 'description' in frontmatter for post: ${slug}`);

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      content: htmlContent,
      readingTime,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export function getAllPosts(): Post[] {
  const postsDir = join(process.cwd(), 'posts');
  const fileNames = readdirSync(postsDir);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''))
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPosts;
}
