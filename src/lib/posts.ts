import matter from 'gray-matter';
import { marked } from 'marked';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Post, PostMeta } from '../types/post.js';

export function calculateReadingTime(content: string): number {
  const wordCount = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}
