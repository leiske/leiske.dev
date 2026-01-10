import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/404')({
  component: NotFound,
})

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
