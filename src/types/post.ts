export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  test?: boolean;
}

export interface Post extends PostMeta {
  content: string;
  readingTime: number;
}
