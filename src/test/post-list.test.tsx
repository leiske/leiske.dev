import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostList } from '../components/PostList'
import type { PostMeta } from '../types/post'

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

describe('PostList Component (Task 10.5)', () => {
  const mockPosts: PostMeta[] = [
    {
      slug: 'post-1',
      title: 'First Post Title',
      date: '2026-01-01',
      description: 'First post description',
      tags: ['test', 'first'],
      wip: false,
    },
    {
      slug: 'post-2',
      title: 'Second Post Title',
      date: '2026-01-02',
      description: 'Second post description',
      tags: ['test', 'second'],
      wip: false,
    },
  ]

  it('renders all posts in the list', () => {
    render(<PostList posts={mockPosts} />)
    
    const firstTitle = screen.getByText('First Post Title')
    const secondTitle = screen.getByText('Second Post Title')
    
    expect(firstTitle).toBeInTheDocument()
    expect(secondTitle).toBeInTheDocument()
  })

  it('displays post titles as links', () => {
    render(<PostList posts={mockPosts} />)
    
    const firstLink = screen.getByText('First Post Title').closest('a')
    const secondLink = screen.getByText('Second Post Title').closest('a')
    
    expect(firstLink).toBeInTheDocument()
    expect(firstLink).toHaveAttribute('href', '/blog/post-1')
    expect(secondLink).toBeInTheDocument()
    expect(secondLink).toHaveAttribute('href', '/blog/post-2')
  })

  it('displays post dates', () => {
    render(<PostList posts={mockPosts} />)
    
    const dates = screen.getAllByRole('time')
    expect(dates).toHaveLength(2)
  })

  it('displays empty message when no posts', () => {
    render(<PostList posts={[]} />)
    
    const emptyMessage = screen.getByText('No posts available')
    expect(emptyMessage).toBeInTheDocument()
    expect(emptyMessage).toHaveClass('text-gray-500')
  })

  it('applies correct styling classes', () => {
    render(<PostList posts={mockPosts} />)
    
    const list = screen.getByRole('list')
    expect(list).toHaveClass('space-y-4')
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveClass('border-b', 'pb-4', 'last:border-b-0')
  })

  it('displays posts in order', () => {
    render(<PostList posts={mockPosts} />)
    
    const listItems = screen.getAllByRole('listitem')
    const firstItem = listItems[0]
    const secondItem = listItems[1]
    
    expect(firstItem).toContainElement(screen.getByText('First Post Title'))
    expect(secondItem).toContainElement(screen.getByText('Second Post Title'))
  })
})
