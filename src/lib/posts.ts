import matter from 'gray-matter';
import { marked } from 'marked';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { Post, PostMeta } from '../types/post.js';

