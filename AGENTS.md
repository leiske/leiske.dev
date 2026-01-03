# Agent Guide for leiske.dev

## Essential Commands

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Full build: TypeScript + Vite + static HTML generation
- `npm run preview` - Preview production build locally
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
- `src/router.tsx` - Router configuration with routeTree
- `src/routes/__root.tsx` - Root layout route
- `src/routeTree.gen.ts` - Auto-generated route tree (created by dev server)

### Plugin Order in vite.config.ts
The plugins array must have this specific order:
1. `tsConfigPaths()` - For path aliases
2. `tanstackStart()` - TanStack Start main plugin
3. `tailwindcss()` - Tailwind CSS
4. `viteReact()` - React plugin (must come after tanstackStart)

### TanStack Router Routes
- Routes in `src/routes/` directory use file-based routing
- `__root.tsx` - Root layout
- `index.tsx` - Home page (/)
- `blog.$slug.tsx` - Blog posts (/blog/:slug)
- `blog.index.tsx` - Blog index (/blog)
- Use `createFileRoute()` from '@tanstack/react-router'
- Use `Route.useLoaderData()` to access loader data in components

## Static Site Generation
- Build script at `scripts/build-static.ts` generates static HTML
- Compile separately: `npx tsc scripts/build-static.ts --outDir dist-scripts --module esnext --target es2023 --moduleResolution bundler --jsx react-jsx --skipLibCheck --strict`
- Run compiled: `node dist-scripts/scripts/build-static.js`
- If modifying `src/` components, recompile build script to update static generation
- Vite outputs CSS with fixed names (no hashing)
- `dist-scripts/` is gitignored

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
