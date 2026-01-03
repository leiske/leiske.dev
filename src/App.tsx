import { Home } from './pages/Home.js';
import { BlogPost } from './pages/BlogPost.js';
import { NotFound } from './pages/NotFound.js';

export function App() {
  const pathname = window.location.pathname;

  if (pathname === '/') {
    return <Home />;
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    return <BlogPost slug={blogMatch[1]} />;
  }

  return <NotFound />;
}
