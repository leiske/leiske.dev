import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { getAllPosts } from '../src/lib/posts.js';
import { Home } from '../src/pages/Home.js';
import { BlogPost } from '../src/pages/BlogPost.js';

function ensureDirectoryExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

function renderPage(component: React.ReactElement): string {
  const renderedContent = renderToStaticMarkup(component);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/assets/style.css" rel="stylesheet">
    <title>leiske.dev</title>
  </head>
  <body>
    ${renderedContent}
  </body>
</html>`;
}

function main(): void {
  try {
    console.log('Building static site...');

    const distDir = join(process.cwd(), 'dist');
    ensureDirectoryExists(distDir);

    const allPosts = getAllPosts();
    console.log(`Found ${allPosts.length} posts`);

    const homePageHtml = renderPage(createElement(Home));
    writeFileSync(join(distDir, 'index.html'), homePageHtml);
    console.log('Homepage generated');

    allPosts.forEach((post) => {
      const blogDir = join(distDir, 'blog', post.slug);
      ensureDirectoryExists(blogDir);
      const postPageHtml = renderPage(createElement(BlogPost, { slug: post.slug }));
      writeFileSync(join(blogDir, 'index.html'), postPageHtml);
    });

    console.log(`Generated ${allPosts.length} post pages`);
    console.log('Build complete');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

main();
