import { createFileRoute } from '@tanstack/react-router'
import { SocialLinks } from '../components/SocialLinks'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return <div>
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Hi, I'm Colby Leiske</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
        <p>I love computers and writing software. Been exploring this world since I was 10.</p>
        <p>Usually slinging JavaScript or YAML or PHP or Go or whatever I feel like on any given day.</p>
        <p>When I'm not coding, I'm playing games like Factorio or <span className="text-red-600">WoW</span>.</p>
      </div>

      <div className="mt-8 pt-8 border-t">
        <SocialLinks />
      </div>
    </article>
  </div>
}
