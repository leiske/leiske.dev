import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Colby Leiske',
      },
    ],
    links: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
        title: 'leiske.dev - RSS Feed',
      },
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        href: '/atom.xml',
        title: 'leiske.dev - Atom Feed',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className="overflow-y-scroll">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="z-10">
          <div className="flex items-center max-w-4xl mx-auto px-4 py-4">
            <Link to="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
              colby leiske
            </Link>
            {/* <Link to="/blog" className="text-gray-600 hover:text-blue-600 ml-6">
              Blog
            </Link> */}
            <Link to="/about" className="text-gray-600 hover:text-blue-600 ml-auto">
              about
            </Link>
          </div>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-gray-900">404 - Page not found</h1>
      <p className="mt-4 text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 text-blue-600 hover:text-blue-800">
        Back to home
      </Link>
    </div>
  )
}
