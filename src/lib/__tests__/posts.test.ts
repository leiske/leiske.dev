import { calculateReadingTime, getPostBySlug } from '../posts.js';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('calculateReadingTime', () => {
  it('calculates 1 minute for 100 words', () => {
    const content = 'word '.repeat(99) + 'word';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('calculates 2 minutes for 300 words', () => {
    const content = 'word '.repeat(299) + 'word';
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('rounds up: 201 words = 2 minutes', () => {
    const content = 'word '.repeat(200) + 'word';
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('returns 1 for empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('returns 1 for single word', () => {
    expect(calculateReadingTime('one')).toBe(1);
  });

  it('handles various whitespace characters', () => {
    expect(calculateReadingTime('word\nword\tword')).toBe(1);
  });
});

describe('getPostBySlug', () => {
  it('returns null for non-existent post', () => {
    const result = getPostBySlug('non-existent-post');
    expect(result).toBe(null);
  });

  it('parses valid post with all fields', () => {
    const testSlug = 'test-valid-post';
    const testFilePath = join(process.cwd(), 'posts', `${testSlug}.md`);
    const frontmatter = `---
title: Test Post Title
date: 2026-01-02
slug: test-valid-post
description: This is a test post description
tags:
  - react
  - testing
---
# Heading

This is paragraph with **bold** text.
`;

    writeFileSync(testFilePath, frontmatter, 'utf-8');

    try {
      const result = getPostBySlug(testSlug);

      expect(result).not.toBe(null);
      expect(result?.slug).toBe(testSlug);
      expect(result?.title).toBe('Test Post Title');
      expect(result?.date).toBeTruthy();
      expect(result?.description).toBe('This is a test post description');
      expect(result?.tags).toEqual(['react', 'testing']);
      expect(result?.content).toContain('<h1>Heading</h1>');
      expect(result?.content).toContain('<strong>bold</strong>');
      expect(result?.readingTime).toBeGreaterThan(0);
      expect(typeof result?.readingTime).toBe('number');
    } finally {
      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
    }
  });

  it('defaults tags to empty array when not provided', () => {
    const testSlug = 'test-missing-tags';
    const testFilePath = join(process.cwd(), 'posts', `${testSlug}.md`);
    const frontmatter = `---
title: Test Post
date: 2026-01-02
slug: test-missing-tags
description: Test description
---
Some content
`;

    writeFileSync(testFilePath, frontmatter, 'utf-8');

    try {
      const result = getPostBySlug(testSlug);
      expect(result).not.toBe(null);
      expect(result?.tags).toEqual([]);
    } finally {
      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
    }
  });

  it('defaults test to false when not provided', () => {
    const testSlug = 'test-missing-test-field';
    const testFilePath = join(process.cwd(), 'posts', `${testSlug}.md`);
    const frontmatter = `---
title: Test Post
date: 2026-01-02
slug: test-missing-test-field
description: Test description
tags:
  - test
---
Some content
`;

    writeFileSync(testFilePath, frontmatter, 'utf-8');

    try {
      const result = getPostBySlug(testSlug);
      expect(result).not.toBe(null);
      expect(result?.test).toBe(false);
    } finally {
      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
    }
  });
});
