import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { PostContent } from '../components/PostContent'

// Mock the Markdown component
vi.mock('../components/Markdown', () => ({
  Markdown: ({ content, className }: { content: string; className?: string }) => (
    <div className={className} data-testid="markdown-content">
      {content}
    </div>
  ),
}))

// Mock Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, params }: any) => (
    <a href={params ? `${to.replace('$slug', params.slug)}` : to} className={className}>
      {children}
    </a>
  ),
}))

describe('Blog Post Page (Task 8.4)', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    date: '2026-01-01',
    description: 'Test description',
    content: '# Heading 1\n\nThis is test content.',
    tags: ['test', 'blog'],
    readingTime: 3,
  }

  const mockNextPost = {
    slug: 'next-post',
    title: 'Next Post Title',
    date: '2026-01-02',
    description: 'Next post description',
    content: '# Next Heading',
    tags: ['next'],
    readingTime: 2,
  }

  it('displays post title', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const title = screen.getByRole('heading', { level: 1, name: 'Test Post Title' })
    expect(title).toBeInTheDocument()
  })

  it('displays post date', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const date = screen.getByRole('time')
    expect(date).toBeInTheDocument()
  })

  it('displays reading time', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const readingTime = screen.getByText('3 min read')
    expect(readingTime).toBeInTheDocument()
  })

  it('displays tags when present', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const testTag = screen.getByText('test')
    const blogTag = screen.getByText('blog')
    expect(testTag).toBeInTheDocument()
    expect(blogTag).toBeInTheDocument()
  })

  it('does not display tag section when no tags', () => {
    const postWithoutTags = { ...mockPost, tags: [] }
    render(<PostContent post={postWithoutTags as any} nextPost={null} />)
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('renders markdown content', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const markdownContent = screen.getByTestId('markdown-content')
    expect(markdownContent).toBeInTheDocument()
    expect(markdownContent).toHaveTextContent('This is test content')
  })

  it('has back to home link', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const backLink = screen.getByText('← Back to home')
    expect(backLink).toBeInTheDocument()
    const linkElement = backLink.closest('a')
    expect(linkElement).toHaveAttribute('href', '/')
  })

  it('displays next post link when next post exists', () => {
    render(<PostContent post={mockPost as any} nextPost={mockNextPost as any} />)
    const nextLink = screen.getByText(/Next post: Next Post Title/i)
    expect(nextLink).toBeInTheDocument()
  })

  it('does not display next post link when no next post', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    expect(screen.queryByText(/Next post:/i)).not.toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const article = screen.getByRole('article')
    expect(article).toHaveClass('max-w-3xl', 'mx-auto', 'px-4', 'py-8')
  })

  it('displays date, reading time, and tags in correct order with separators', () => {
    render(<PostContent post={mockPost as any} nextPost={null} />)
    const dateElement = screen.getByRole('time')
    const metaContainer = dateElement.parentElement
    expect(metaContainer).toBeInTheDocument()
    expect(within(metaContainer!).getAllByText('•').length).toBeGreaterThanOrEqual(1)
  })
})
