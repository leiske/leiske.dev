import { getPostBySlug } from '../posts.js';
import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { vi } from 'vitest';

vi.mock('marked', async () => {
  const actual = await vi.importActual<typeof import('marked')>('marked');
  return {
    ...actual,
    marked: {
      ...actual,
      parse: vi.fn(),
    },
  };
});

describe('getPostBySlug - Error Handling', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null and logs error when markdown parsing fails', async () => {
    const testSlug = 'test-markdown-error';
    const testFilePath = join(process.cwd(), 'posts', `${testSlug}.md`);
    const frontmatter = `---
title: Test Post
date: 2026-01-02
slug: test-markdown-error
description: Test description
---
Some content
`;

    writeFileSync(testFilePath, frontmatter, 'utf-8');

    try {
      const { marked } = await import('marked');
      const mockMarkedParse = vi.mocked(marked.parse);

      mockMarkedParse.mockImplementation(() => {
        throw new Error('Markdown parsing failed');
      });

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = getPostBySlug(testSlug);

      expect(result).toBe(null);
      expect(errorSpy).toHaveBeenCalled();
      expect(errorSpy.mock.calls[0][0]).toContain('Failed to parse markdown for post: test-markdown-error');

      errorSpy.mockRestore();
    } finally {
      if (existsSync(testFilePath)) {
        unlinkSync(testFilePath);
      }
    }
  });
});
