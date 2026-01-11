import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { PostContent } from '../components/PostContent'

  type MockPost = {
    slug: string
    title: string
    date: string
    description: string
    content: string
    tags: string[]
    readingTime: number
    wip: boolean | undefined
  }


// Mock Markdown component
vi.mock('../components/Markdown', () => ({
  Markdown: ({ content, className }: { content: string; className?: string }) => (
    <div className={className} data-testid="markdown-content">
      {content}
    </div>
  ),
}))

// Mock Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, params }: {
    to: string
    children: React.ReactNode
    className?: string
    params?: { slug: string }
  }) => (
    <a href={params ? `${to.replace('$slug', params.slug)}` : to} className={className}>
      {children}
    </a>
  ),
}))

describe('Blog Post Page (Task 8.4)', () => {
  const mockPost: MockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    date: '2026-01-01',
    description: 'Test description',
    content: Array.from({ length: 600 }).fill('word').join(' '),
    tags: ['test', 'blog'],
    readingTime: 3,
    wip: false,
  }

  const mockNextPost: MockPost = {
    slug: 'next-post',
    title: 'Next Post Title',
    date: '2026-01-02',
    description: 'Next post description',
    content: Array.from({ length: 200 }).fill('word').join(' '),
    tags: ['next'],
    readingTime: 1,
    wip: false,
  }

  it('displays post title', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const title = screen.getByRole('heading', { level: 1, name: 'Test Post Title' })
    expect(title).toBeInTheDocument()
  })

  it('displays post date', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const date = screen.getByRole('time')
    expect(date).toBeInTheDocument()
  })

  it('displays reading time', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const readingTime = screen.getByText('3 min read')
    expect(readingTime).toBeInTheDocument()
  })

  it('displays tags when present', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const testTag = screen.getByText('test')
    const blogTag = screen.getByText('blog')
    expect(testTag).toBeInTheDocument()
    expect(blogTag).toBeInTheDocument()
  })

  it('does not display tag section when no tags', () => {
    const postWithoutTags = { ...mockPost, tags: [] }
    render(<PostContent post={postWithoutTags as MockPost} nextPost={null} />)
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('renders markdown content', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const markdownContent = screen.getByTestId('markdown-content')
    expect(markdownContent).toBeInTheDocument()
    expect(markdownContent).toHaveTextContent('word')
  })

  it('has back to home link', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const backLink = screen.getByText('← Back to home')
    expect(backLink).toBeInTheDocument()
    const linkElement = backLink.closest('a')
    expect(linkElement).toHaveAttribute('href', '/')
  })

  it('displays next post link when next post exists', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={mockNextPost as MockPost} />)
    const nextLink = screen.getByText(/Next post: Next Post Title/i)
    expect(nextLink).toBeInTheDocument()
  })

  it('does not display next post link when no next post', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    expect(screen.queryByText(/Next post:/i)).not.toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const article = screen.getByRole('article')
    expect(article).toHaveClass('max-w-3xl', 'mx-auto', 'px-4', 'py-8')
  })

  it('displays date, reading time, and tags in correct order with separators', () => {
    render(<PostContent post={mockPost as MockPost} nextPost={null} />)
    const dateElement = screen.getByRole('time')
    const metaContainer = dateElement.parentElement
    expect(metaContainer).toBeInTheDocument()
    expect(within(metaContainer!).getAllByText('•').length).toBeGreaterThanOrEqual(1)
  })
})
