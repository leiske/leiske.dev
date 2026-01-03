import type { Post as ContentCollectionPost } from 'content-collections';

export type Post = ContentCollectionPost;

export type PostMeta = Pick<Post, 'slug' | 'title' | 'date' | 'description' | 'tags' | 'test'>;
