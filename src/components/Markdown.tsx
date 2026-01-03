import parse, { type HTMLReactParserOptions, Element } from 'html-react-parser'
import { Link } from '@tanstack/react-router'
import { renderMarkdownSync } from '../utils/markdown'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  const result = renderMarkdownSync(content)

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'a' && domNode.attribs?.href) {
        const href = domNode.attribs.href
        if (href.startsWith('/')) {
          return (
            <Link to={href} className={domNode.attribs.class}>
              {parse(domNode.children as unknown as string)}
            </Link>
          )
        }
      }

      if (domNode instanceof Element && domNode.name === 'img' && domNode.attribs?.src) {
        return (
          <img
            src={domNode.attribs.src}
            alt={domNode.attribs.alt || ''}
            loading="lazy"
            className={domNode.attribs.class}
          />
        )
      }
    }
  }

  return <div className={className}>{parse(result.markup, options)}</div>
}
