export function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        ← Back to home
      </a>
    </div>
  );
}
