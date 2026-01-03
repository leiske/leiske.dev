import matter from 'gray-matter';
import { marked } from 'marked';
import { readFileSync } from 'fs';
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
