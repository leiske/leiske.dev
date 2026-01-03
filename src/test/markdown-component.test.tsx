import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Markdown } from '../components/Markdown'

const mockRenderMarkdownToReact = vi.fn()
vi.mock('../utils/markdown', () => ({
  renderMarkdownToReact: (...args: unknown[]) => mockRenderMarkdownToReact(...args),
  renderMarkdownSync: vi.fn(),
}))

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

describe('Markdown Component (Task 10.5)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders markdown content', () => {
    const content = '# Test Content'
    mockRenderMarkdownToReact.mockReturnValue(
      <h1 id="test-content">Test Content</h1>
    )

    render(<Markdown content={content} />)

    const heading = screen.getByRole('heading', { level: 1, name: 'Test Content' })
    expect(heading).toBeInTheDocument()
    expect(mockRenderMarkdownToReact).toHaveBeenCalledWith(content)
  })

  it('renders multiple headings', () => {
    const content = '# Heading 1\n\n## Heading 2'
    mockRenderMarkdownToReact.mockReturnValue(
      <>
        <h1 id="heading-1">Heading 1</h1>
        <h2 id="heading-2">Heading 2</h2>
      </>
    )

    render(<Markdown content={content} />)

    const h1 = screen.getByRole('heading', { level: 1, name: 'Heading 1' })
    const h2 = screen.getByRole('heading', { level: 2, name: 'Heading 2' })
    expect(h1).toBeInTheDocument()
    expect(h2).toBeInTheDocument()
  })

  it('renders inline code', () => {
    const content = 'This is `inline code` example'
    mockRenderMarkdownToReact.mockReturnValue(
      <p>This is <code>inline code</code> example</p>
    )

    render(<Markdown content={content} />)

    const codeElement = screen.getByText('inline code')
    expect(codeElement.tagName.toLowerCase()).toBe('code')
  })

  it('renders code blocks', () => {
    const content = '```javascript\nconst x = 1;\n```'
    mockRenderMarkdownToReact.mockReturnValue(
      <pre><code className="language-javascript">const x = 1;</code></pre>
    )

    render(<Markdown content={content} />)

    const codeBlock = screen.getByText('const x = 1;')
    expect(codeBlock.tagName.toLowerCase()).toBe('code')
  })

  it('renders links in markdown', () => {
    const content = '[External Link](https://example.com)'
    mockRenderMarkdownToReact.mockReturnValue(
      <p><a href="https://example.com">External Link</a></p>
    )

    render(<Markdown content={content} />)

    const link = screen.getByRole('link', { name: 'External Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('renders images in markdown', () => {
    const content = '![Alt text](/image.png)'
    mockRenderMarkdownToReact.mockReturnValue(
      <p><img src="/image.png" alt="Alt text" loading="lazy" /></p>
    )

    render(<Markdown content={content} />)

    const image = screen.getByAltText('Alt text')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/image.png')
  })

  it('applies custom className', () => {
    const content = '# Test'
    const customClass = 'custom-class'
    mockRenderMarkdownToReact.mockReturnValue(
      <h1 id="test">Test</h1>
    )

    render(<Markdown content={content} className={customClass} />)

    const container = screen.getByRole('heading', { level: 1 }).closest(`.${customClass}`)
    expect(container).toBeInTheDocument()
  })

  it('renders plain text content', () => {
    const content = 'Just plain text content'
    mockRenderMarkdownToReact.mockReturnValue(
      <p>Just plain text content</p>
    )

    render(<Markdown content={content} />)

    expect(screen.getByText('Just plain text content')).toBeInTheDocument()
  })

  it('handles content with multiple paragraphs', () => {
    const content = 'First paragraph\n\nSecond paragraph\n\nThird paragraph'
    mockRenderMarkdownToReact.mockReturnValue(
      <>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
      </>
    )

    render(<Markdown content={content} />)

    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
    expect(screen.getByText('Third paragraph')).toBeInTheDocument()
  })
})
