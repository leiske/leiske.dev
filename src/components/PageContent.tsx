import type { Page } from 'content-collections'
import { Markdown } from './Markdown'
import { SocialLinks } from './SocialLinks'

interface PageContentProps {
  page: Page
}

export function PageContent({ page }: PageContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{page.title}</h1>
      
      {page.description && (
        <p className="text-lg text-gray-700 mb-8">{page.description}</p>
      )}
      
      <Markdown content={page.content} className="prose prose-lg max-w-none" />
      
      <div className="mt-12 pt-8 border-t">
        <SocialLinks />
      </div>
    </article>
  )
}
