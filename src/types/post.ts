import type { Post as ContentCollectionPost } from '../../.content-collections/generated/index.js';

export type Post = ContentCollectionPost;

export type PostMeta = Pick<Post, 'slug' | 'title' | 'date' | 'description' | 'tags' | 'test'>;
