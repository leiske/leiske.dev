import { renderMarkdownToReact } from '../utils/markdown'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return <div className={className}>{renderMarkdownToReact(content)}</div>
}
