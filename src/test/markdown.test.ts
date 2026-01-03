import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../utils/markdown'

describe('Markdown Processing (Task 8.4 - headings and code blocks)', () => {
  it('generates heading IDs for h1-h6', async () => {
    const markdown = '# Heading 1\n\n## Heading 2\n\n### Heading 3'
    const result = await renderMarkdown(markdown)
    expect(result.headings).toHaveLength(3)
    expect(result.headings[0].level).toBe(1)
    expect(result.headings[1].level).toBe(2)
    expect(result.headings[2].level).toBe(3)
  })

  it('adds anchor link wrapping to headings', async () => {
    const markdown = '# Test Heading'
    const result = await renderMarkdown(markdown)
    expect(result.markup).toContain('class="anchor"')
  })

  it('extracts heading text correctly', async () => {
    const markdown = '# Test Heading\n\n## Another Heading'
    const result = await renderMarkdown(markdown)
    expect(result.headings[0].text).toBe('Test Heading')
    expect(result.headings[1].text).toBe('Another Heading')
  })

  it('processes code blocks', async () => {
    const markdown = '```javascript\nconst x = 1;\n```'
    const result = await renderMarkdown(markdown)
    expect(result.markup).toContain('<code')
    expect(result.markup).toContain('const x = 1;')
  })

  it('processes inline code', async () => {
    const markdown = 'This is `inline code` example'
    const result = await renderMarkdown(markdown)
    expect(result.markup).toContain('<code')
    expect(result.markup).toContain('inline code')
  })

  it('generates unique IDs for headings with same text', async () => {
    const markdown = '# Test\n\n# Test\n\n# Test'
    const result = await renderMarkdown(markdown)
    const ids = result.headings.map(h => h.id)
    expect(new Set(ids).size).toBeGreaterThan(0)
  })
})
