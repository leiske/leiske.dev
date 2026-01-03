# Agent Guide for leiske.dev

## Essential Commands

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Build production bundle (runs tsc + vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

### Testing
- No test suite currently configured in this project
- If tests are added, ensure running single tests is documented in scripts

### Type Checking
- Type checking is integrated into the build process via `tsc -b`
- Run `tsc -b` separately to typecheck without building

## Tech Stack
- React 19.2.0 with functional components
- TypeScript 5.9.3 (strict mode enabled)
- Vite (rolldown-vite 7.2.5) as bundler
- Tailwind CSS v4.1.18 for styling
- ESLint 9.x with TypeScript, React Hooks, and React Refresh plugins

## Code Style Guidelines

### File Structure
- React components in `src/` with `.tsx` extension
- Entry point: `src/main.tsx`
- Main component: `src/App.tsx`
- Imports from `tailwindcss` in `src/index.css`

### Imports
- Use named imports: `import { StrictMode } from 'react'`
- Include file extensions for TypeScript files: `'./App.tsx'`
- Use `vermoduleSyntax: true` - import only what you need
- Third-party imports first, then local imports

### Types & TypeScript
- Strict mode enabled - all variables must be typed or inferred
- Use `!` for non-null assertions only when certain (e.g., `document.getElementById('root')!`)
- No unused locals or parameters allowed
- Type errors will fail builds
- Node types are available in tsconfig.app.json for build-time utilities (fs, path, etc.)

### Components
- Use functional components with arrow or function declaration
- Export named components: `export function App() { ... }`
- Use React 19 patterns (no explicit `import React` needed)
- Wrap root in `<StrictMode>` for development
- Use `className` prop for Tailwind classes

### Styling
- Prefer Tailwind utility classes in className prop
- Example: `className="flex flex-col items-center justify-center"`
- For complex animations/styles, add to `src/App.css` or separate CSS modules
- Tailwind imported via `@import "tailwindcss"` in index.css

### ESLint Rules
- Extends: `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`
- Enforces React Hooks rules
- Supports Fast Refresh via react-refresh plugin
- Dist folder ignored

### Naming Conventions
- Components: PascalCase (e.g., `App`, `UserProfile`)
- Functions/variables: camelCase (e.g., `createRoot`, `render`)
- CSS classes: kebab-case (e.g., `.logo`, `.read-the-docs`)
- Files: camelCase or PascalCase for components (`.tsx`)

### Error Handling
- TypeScript strict mode catches most type errors
- ESLint catches React-specific issues (hooks rules, etc.)
- Build fails on type errors - fix before committing

### React Best Practices
- Use functional components and hooks
- Follow React Hooks ESLint rules
- Use Fast Refresh-compatible patterns (no anonymous functions in JSX)
- Components are simple functions that return JSX
- Use Fragment (`<>...</>`) or explicit `<Fragment>` when needed

### When Making Changes
1. Run `npm run lint` to check for linting errors
2. Run `npm run build` to verify TypeScript and build succeeds
3. Test in development mode with `npm run dev`
4. No test command available - verify changes manually

### Project-Specific Notes
- Uses rolldown-vite instead of standard Vite for faster builds
- Tailwind v4 imported via Vite plugin, not PostCSS config
- React 19 - no need for `import React from 'react'`
- ES2022 target for app, ES2023 for build scripts

### Static Site Generation
- Build script in `scripts/build-static.ts` generates static HTML pages
- Compile build script separately: `npx tsc scripts/build-static.ts --outDir dist-scripts --module esnext --target es2023 --moduleResolution bundler --jsx react-jsx --skipLibCheck --strict`
- Run compiled script: `node dist-scripts/scripts/build-static.js`
- Build script is excluded from `tsconfig.node.json` to avoid JSX conflicts
- Vite configured to output CSS with fixed names (no hashing) via `vite.config.ts`
- `dist-scripts/` directory is gitignored

### Blog Feature

#### Blog Structure
- Blog posts stored as markdown files in `posts/` directory
- Post metadata defined in `src/types/post.ts`:
  - `PostMeta`: slug, title, date, description, tags
  - `Post`: extends PostMeta with content (HTML) and readingTime
- Post utilities in `src/lib/posts.ts`:
  - `calculateReadingTime(content)`: Calculates reading time in minutes (200 wpm)
  - `getPostBySlug(slug)`: Loads a single post by slug
  - `getAllPosts()`: Returns all posts sorted by date (newest first)

#### Post Format
All blog posts must have YAML frontmatter between `---` delimiters:

```yaml
---
date: YYYY-MM-DD
title: Post Title
slug: post-slug
description: Brief description of post content
tags:
  - tag1
  - tag2
---
```

Required fields:
- `date`: ISO date string (YYYY-MM-DD format)
- `title`: Post title (string)
- `slug`: URL-friendly identifier (matches filename without .md)
- `description`: Brief post description for metadata
- `tags`: Array of tag strings (optional but recommended)

#### Adding New Posts
1. Create new markdown file in `posts/` directory
2. Use slug as filename: `posts/your-post-slug.md`
3. Add frontmatter with all required fields
4. Write markdown content below frontmatter
5. Build will automatically include new post

#### Blog Components
- `src/components/PostList.tsx`: Displays list of posts with titles and dates
- `src/components/PostContent.tsx`: Renders full post with metadata and navigation
- `src/pages/Home.tsx`: Homepage showing 5 most recent posts
- `src/pages/BlogPost.tsx`: Individual post page with "next post" navigation

#### Blog Build Process
The build process (`npm run build`) performs these steps:
1. TypeScript compilation (`tsc -b`)
2. Vite build (generates assets in `dist/`)
3. Static HTML generation (`node dist-scripts/build-static.js`):
   - Generates `dist/index.html` (homepage)
   - Generates `dist/blog/{slug}/index.html` for each post
   - Uses `ReactDOMServer.renderToStaticMarkup()` for SSR
   - Wraps content in HTML shell with links to Vite-generated assets

#### Development vs Production
- Development: Client-side routing in `src/App.tsx` uses `window.location.pathname`
- Production: Pre-rendered static HTML generated by build script
- Both modes use the same components and utilities

#### Blog Styling
- Content uses Tailwind Typography plugin via `prose` class
- Tailwind classes for layout and spacing
- Tags rendered as blue badges with rounded corners
- Responsive design with mobile-friendly breakpoints
