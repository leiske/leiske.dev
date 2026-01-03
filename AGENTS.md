# Agent Guide for leiske.dev

## Essential Commands

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Full build: TypeScript + Vite (builds to dist/client and dist/server)
- `npm run start` - Start production server (runs dist/server/server.js)
- `npm run lint` - Run ESLint on all files

### Testing
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- Test framework: Vitest with happy-dom environment
- Testing library: @testing-library/react with jest-dom matchers
- Test config: `vitest.config.ts`
- Test setup: `src/test/setup.ts`
- IMPORTANT: When using vitest `globals: true`, must add `"vitest/globals"` to `types` array in `tsconfig.app.json` for TypeScript support

### Type Checking
- Integrated into build via `tsc -b`
- Run `tsc -b` separately to typecheck without building

## Tech Stack
- React 19.2.0 with functional components
- TanStack Start 1.145.3 with TanStack Router for SSR/SSG and file-based routing
- TypeScript 5.9.3 (strict mode enabled)
- Vite (rolldown-vite 7.2.5) as bundler (TanStack Start migrated from Vinxi to Vite in v1.121.0)
- Tailwind CSS v4.1.18 for styling
- ESLint 9.x with TypeScript, React Hooks, and React Refresh plugins

## Code Style Guidelines

### File Structure & Imports
- React components in `src/` with `.tsx` extension
- Entry point: `src/main.tsx`, Main component: `src/App.tsx`
- Use named imports with file extensions: `import { Component } from './Component.tsx'`
- Third-party imports first, then local imports
- Type imports use `.js` extension: `import type { Post } from '../types/post.js'`

### TypeScript
- Strict mode enabled - all variables must be typed or inferred
- Use `!` for non-null assertions only when certain (e.g., `document.getElementById('root')!`)
- No unused locals or parameters allowed
- Type errors will fail builds
- Node types available for build-time utilities (fs, path)

### Components
- Export named components: `export function App() { ... }`
- React 19 patterns (no explicit `import React` needed)
- Use `className` prop for Tailwind classes
- Fragment syntax: `<>...</>`

### Styling
- Prefer Tailwind utility classes in className prop
- Example: `className="flex flex-col items-center justify-center"`
- For complex styles, add to `src/App.css`
- Tailwind imported via `@import "tailwindcss"` in index.css

### Naming Conventions
- Components: PascalCase (`App`, `UserProfile`)
- Functions/variables: camelCase (`createRoot`, `render`)
- CSS classes: kebab-case (`.logo`, `.read-the-docs`)

### Error Handling
- TypeScript strict mode catches type errors
- Use try/catch with null returns for recoverable errors
- Check for ENOENT on file operations
- Console warnings for missing optional fields

## When Making Changes
1. Run `npm run lint` to check for linting errors
2. Run `npm run build` to verify TypeScript and build succeeds
3. Test in development mode with `npm run dev`

## TanStack Start Configuration

### Required Files
- `vite.config.ts` - Main configuration with tanstackStart plugin
- `content-collections.ts` - Content collections configuration for markdown processing
- `src/router.tsx` - Router configuration with routeTree
- `src/routes/__root.tsx` - Root layout route
- `src/routeTree.gen.ts` - Auto-generated route tree (created by dev server, gitignored)

### Plugin Order in vite.config.ts
The plugins array must have this specific order:
1. `contentCollections()` - Content collections plugin (must come first)
2. `tsConfigPaths()` - For path aliases
3. `tanstackStart()` - TanStack Start main plugin
4. `tailwindcss()` - Tailwind CSS
5. `viteReact()` - React plugin (must come after tanstackStart)

### TanStack Router Routes
- Routes in `src/routes/` directory use file-based routing
- `__root.tsx` - Root layout
- `index.tsx` - Home page (/)
- `blog.$slug.tsx` - Blog posts (/blog/:slug)
- `blog.index.tsx` - Blog index (/blog)
- Use `createFileRoute()` from '@tanstack/react-router'
- Use `Route.useLoaderData()` to access loader data in components
- 404 pages: Add `notFoundComponent` to root route configuration (do NOT create separate 404.tsx file)

### TanStack Router Link Component
- Import from '@tanstack/react-router': `import { Link } from '@tanstack/react-router'`
- Static routes: `<Link to="/blog">Blog</Link>`
- Dynamic routes: Use route pattern in `to` prop and pass params via `params` prop
  - Example: `<Link to="/blog/$slug" params={{ slug: 'my-post' }}>My Post</Link>`
  - The `to` prop must match the route pattern (e.g., `/blog/$slug` for `blog.$slug.tsx`)
  - Dynamic parameters are passed separately via `params` object, not interpolated in the string

## Content Collections Configuration

### Configuration File
- `content-collections.ts` - Defines markdown processing configuration in project root
- Imports: `defineCollection`, `defineConfig` from '@content-collections/core'
- Imports: `matter` from 'gray-matter', `z` from 'zod'

### Schema Definition
- Use `defineCollection()` to define collections
- Use `z.object()` to define schema with zod validation
- Required fields: title, date, description, slug, tags, content
- Optional fields: test (boolean)

### Transform Function
- Process markdown files with gray-matter
- Override slug to use `_meta.path`
- Calculate reading time: split content by whitespace, count words, divide by 200, Math.ceil
- Return object with all schema fields plus readingTime

### Generated Files
- `.content-collections/generated/allPosts.js` - All posts data
- `.content-collections/generated/index.d.ts` - TypeScript types
- Import with: `import { allPosts } from '.content-collections/generated'`
- IMPORTANT: Generated files are gitignored and auto-generated by dev server

### Important Notes
- Add explicit `content` field to schema to avoid deprecation warning
- Transform function receives validated schema fields in `document` parameter
- Use `matter(document.content)` to separate frontmatter from markdown body
- Generated files (`.content-collections/generated/` and `src/routeTree.gen.ts`) should be gitignored

## Sitemap Generation

### Plugin
- Uses `@corentints/tanstack-router-sitemap` plugin for automatic sitemap generation
- Imported in `vite.config.ts`: `import { sitemapPlugin } from '@corentints/tanstack-router-sitemap'`

### Configuration
- Add `sitemapPlugin()` to plugins array in `vite.config.ts`
- Required option: `baseUrl` (e.g., 'https://leiske.dev')
- Optional option: `outputPath` (default: 'public/sitemap.xml')
- Optional option: `routeOptions` for custom priority and changefreq per route
- Optional option: `manualRoutes` for dynamic routes (blog posts, articles)

### Manual Routes for Dynamic Content
- Use `manualRoutes` option to include dynamic routes like blog posts
- Function can be async to fetch data from content-collections or database
- Example:
  ```typescript
  manualRoutes: async () => {
    const { allPosts } = await import('./.content-collections/generated/index.js')
    const posts = allPosts.filter((post: any) => !post.test)
    return posts.map((post: any) => ({
      location: `/blog/${post.slug}`,
      priority: 0.8,
      changeFrequency: 'weekly' as const,
      lastMod: post.date,
    }))
  }
  ```

### Generated Sitemap
- Sitemap is automatically generated during build (`npm run build`)
- Output file: `public/sitemap.xml`
- Includes static routes from route tree
- Includes dynamic routes from manualRoutes
- Excludes test posts and routes in excludeRoutes array

## Static Site Generation
- TanStack Start handles SSG automatically
- Build process generates static HTML via `npm run build`
- Vite outputs CSS with fixed names (no hashing)

## Blog Feature

### Blog Structure
- Posts in `posts/` as markdown files with YAML frontmatter
- Types in `src/types/post.ts`: `PostMeta` (slug, title, date, description, tags) and `Post` (extends PostMeta with content HTML, readingTime)
- Utilities in `src/lib/posts.ts`: `calculateReadingTime`, `getPostBySlug`, `getAllPosts`

### Post Format
Required frontmatter:
```yaml
---
date: YYYY-MM-DD
title: Post Title
slug: post-slug
description: Brief description
tags:
  - tag1
  - tag2
---
```
Optional `test: true` field excludes post from production build.

### Components
- `src/components/PostList.tsx`: Post list with titles/dates
- `src/components/PostContent.tsx`: Full post with navigation
- `src/pages/Home.tsx`: Homepage (5 recent posts)
- `src/pages/BlogPost.tsx`: Individual post page

### Build Process
1. TypeScript compilation (`tsc -b`)
2. Vite build (assets to `dist/`)
3. Static HTML generation: `dist/index.html` and `dist/blog/{slug}/index.html`
4. Uses `ReactDOMServer.renderToStaticMarkup()` for SSR

### Development vs Production
- Development: Client-side routing via `window.location.pathname`
- Production: Pre-rendered static HTML
- Same components and utilities in both modes

### Blog Styling
- Tailwind Typography plugin via `prose` class
- Tags as blue badges, responsive design
