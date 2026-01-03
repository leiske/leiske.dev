import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Markdown } from '../components/Markdown'

// Mock Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: {
    to: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={to} className={className} data-testid="internal-link">
      {children}
    </a>
  ),
}))

// Mock renderMarkdown
const mockRenderMarkdown = vi.fn()
vi.mock('../utils/markdown', () => ({
  renderMarkdown: (...args: unknown[]) => mockRenderMarkdown(...args),
}))

describe('Markdown Component (Task 10.5)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders markdown content', async () => {
    const content = '# Test Content'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<h1 id="test-content">Test Content</h1>',
      headings: [{ id: 'test-content', text: 'Test Content', level: 1 }],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const heading = screen.getByRole('heading', { level: 1, name: 'Test Content' })
      expect(heading).toBeInTheDocument()
    })
    
    expect(mockRenderMarkdown).toHaveBeenCalledWith(content)
  })

  it('renders multiple headings', async () => {
    const content = '# Heading 1\n\n## Heading 2'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<h1 id="heading-1">Heading 1</h1><h2 id="heading-2">Heading 2</h2>',
      headings: [
        { id: 'heading-1', text: 'Heading 1', level: 1 },
        { id: 'heading-2', text: 'Heading 2', level: 2 },
      ],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const h1 = screen.getByRole('heading', { level: 1, name: 'Heading 1' })
      const h2 = screen.getByRole('heading', { level: 2, name: 'Heading 2' })
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
    })
  })

  it('renders inline code', async () => {
    const content = 'This is `inline code` example'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<p>This is <code>inline code</code> example</p>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const codeElement = screen.getByText('inline code')
      expect(codeElement.tagName.toLowerCase()).toBe('code')
    })
  })

  it('renders code blocks', async () => {
    const content = '```javascript\nconst x = 1;\n```'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<pre><code class="language-javascript">const x = 1;</code></pre>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const codeBlock = screen.getByText('const x = 1;')
      expect(codeBlock.tagName.toLowerCase()).toBe('code')
    })
  })

  it('renders links in markdown', async () => {
    const content = '[External Link](https://example.com)'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<p><a href="https://example.com">External Link</a></p>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'External Link' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
    })
  })

  it('renders images in markdown', async () => {
    const content = '![Alt text](/image.png)'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<p><img src="/image.png" alt="Alt text" /></p>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      const image = screen.getByAltText('Alt text')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/image.png')
    })
  })

  it('applies custom className', async () => {
    const content = '# Test'
    const customClass = 'custom-class'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<h1 id="test">Test</h1>',
      headings: [{ id: 'test', text: 'Test', level: 1 }],
    })
    
    render(<Markdown content={content} className={customClass} />)
    
    await waitFor(() => {
      const container = screen.getByRole('heading', { level: 1 }).closest(`.${customClass}`)
      expect(container).toBeInTheDocument()
    })
  })

  it('renders plain text content', async () => {
    const content = 'Just plain text content'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<p>Just plain text content</p>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      expect(screen.getByText('Just plain text content')).toBeInTheDocument()
    })
  })

  it('handles content with multiple paragraphs', async () => {
    const content = 'First paragraph\n\nSecond paragraph\n\nThird paragraph'
    mockRenderMarkdown.mockResolvedValue({
      markup: '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>',
      headings: [],
    })
    
    render(<Markdown content={content} />)
    
    await waitFor(() => {
      expect(screen.getByText('First paragraph')).toBeInTheDocument()
      expect(screen.getByText('Second paragraph')).toBeInTheDocument()
      expect(screen.getByText('Third paragraph')).toBeInTheDocument()
    })
  })

  it('returns null while loading', () => {
    const content = '# Test'
    mockRenderMarkdown.mockReturnValue(new Promise(() => {}))
    
    const { container } = render(<Markdown content={content} />)
    
    expect(container).toBeEmptyDOMElement()
  })
})
