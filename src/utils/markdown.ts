import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import rehypeReact from 'rehype-react'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Element } from 'hast'
import type { Node } from 'unist'
import type { ReactNode } from 'react'
import { createElement, Fragment } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'
import { Link } from '@tanstack/react-router'

export interface MarkdownHeading {
  id: string
  text: string
  level: number
}

export interface MarkdownResult {
  markup: string
  headings: MarkdownHeading[]
}

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: MarkdownHeading[] = []

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] }
    })
    .use(() => (tree: Node) => {
      visit(tree, 'element', (node: unknown) => {
        const element = node as Element
        if (element.tagName && /^h[1-6]$/.test(element.tagName)) {
          const id = String(element.properties?.id || '')
          const text = toString(element)
          const level = parseInt(element.tagName.charAt(1), 10)

          if (id) {
            headings.push({ id, text, level })
          }
        }
      })
    })
    .use(rehypeStringify)

  const result = await processor.process(content)
  const markup = String(result)

  return { markup, headings }
}

export function renderMarkdownSync(content: string): MarkdownResult {
  const headings: MarkdownHeading[] = []

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] }
    })
    .use(() => (tree: Node) => {
      visit(tree, 'element', (node: unknown) => {
        const element = node as Element
        if (element.tagName && /^h[1-6]$/.test(element.tagName)) {
          const id = String(element.properties?.id || '')
          const text = toString(element)
          const level = parseInt(element.tagName.charAt(1), 10)

          if (id) {
            headings.push({ id, text, level })
          }
        }
      })
    })
    .use(rehypeStringify)

  const result = processor.processSync(content)
  const markup = String(result)

  return { markup, headings }
}

function CustomLink({ href, className, children }: { href?: string; className?: string; children?: ReactNode }) {
  if (href && href.startsWith('/')) {
    return createElement(Link, { to: href, className }, children)
  }
  return createElement('a', { href, className }, children)
}

function CustomImg({ src, alt = '', className }: { src?: string; alt?: string; className?: string }) {
  return createElement('img', { src, alt, loading: 'lazy', className })
}

export function renderMarkdownToReact(content: string): ReactNode {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: { className: ['anchor'] }
    })
    .use(rehypeReact, {
      createElement,
      Fragment,
      jsx,
      jsxs,
      components: {
        a: CustomLink,
        img: CustomImg
      }
    })

  const result = processor.processSync(content)
  return result.result
}
