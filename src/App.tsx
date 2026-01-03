import { Home } from './pages/Home.tsx';
import { BlogPost } from './pages/BlogPost.tsx';
import { NotFound } from './pages/NotFound.tsx';

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
