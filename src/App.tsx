import { Home } from './pages/Home.js';
import { BlogPost } from './pages/BlogPost.js';

export function App() {
  const pathname = window.location.pathname;

  if (pathname === '/') {
    return <Home />;
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    return <BlogPost slug={blogMatch[1]} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">404 - Not Found</h1>
      <a href="/" className="text-blue-600 hover:text-blue-800">
        ← Back to home
      </a>
    </div>
  );
}
