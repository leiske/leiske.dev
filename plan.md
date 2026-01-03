# TanStack Start Migration Plan

## Overview
Migrate the custom static site generator to TanStack Start with content-collections for markdown processing, Tailwind CSS integration, and comprehensive SEO support.

**Current State:**
- Custom build script using `ReactDOMServer.renderToStaticMarkup`
- Markdown processing with `marked` + `gray-matter`
- Client-side routing via `window.location.pathname`
- Posts in `/posts` directory with frontmatter (date, title, slug, description, tags, optional test field)

**Target State:**
- TanStack Start framework with SSR/SSG
- Content-collections for build-time markdown processing
- Unified ecosystem for markdown rendering
- TanStack Router for file-based routing
- Tailwind CSS integration via `@import 'tailwindcss'`
- Comprehensive SEO (meta tags, Open Graph, structured data, sitemap)

---

## Phase 1: Setup & Configuration

### 1.1 Install TanStack Start Dependencies

- [x] Install @tanstack/react-start
  - Run: `npm install @tanstack/react-start`
  - Verify package appears in dependencies

- [x] Install @tanstack/react-router
  - Run: `npm install @tanstack/react-router`
  - Verify package appears in dependencies

- [x] Install vinxi (TanStack Start's build tool)
  - Run: `npm install vinxi`
  - Verify package appears in dependencies
  - NOTE: Vinxi is no longer needed - TanStack Start now uses Vite directly (verified via research)

### 1.2 Install Content Collections Dependencies

- [x] Install @content-collections/core
  - Run: `npm install @content-collections/core`
  - Verify package appears in dependencies

- [x] Install @content-collections/vite
  - Run: `npm install @content-collections/vite`
  - Verify package appears in dependencies

### 1.3 Install Unified Markdown Processing Dependencies

 - [x] Install unified
   - Run: `npm install unified`
   - Verify package appears in dependencies

 - [x] Install remark-parse
   - Run: `npm install remark-parse`
   - Verify package appears in dependencies

- [x] Install remark-gfm
   - Run: `npm install remark-gfm`
   - Verify package appears in dependencies

 - [x] Install remark-rehype
   - Run: `npm install remark-rehype`
   - Verify package appears in dependencies

- [x] Install rehype-raw
   - Run: `npm install rehype-raw`
   - Verify package appears in dependencies

 - [x] Install rehype-slug
   - Run: `npm install rehype-slug`
   - Verify package appears in dependencies

- [ ] Install rehype-autolink-headings
  - Run: `npm install rehype-autolink-headings`
  - Verify package appears in dependencies

- [ ] Install rehype-stringify
  - Run: `npm install rehype-stringify`
  - Verify package appears in dependencies

### 1.4 Install Rendering & Utility Dependencies

- [ ] Install html-react-parser
  - Run: `npm install html-react-parser`
  - Verify package appears in dependencies

- [ ] Install shiki for syntax highlighting
  - Run: `npm install shiki`
  - Verify package appears in dependencies

- [ ] Install gray-matter (for frontmatter parsing)
  - Run: `npm install gray-matter`
  - Verify package appears in dependencies

- [x] Install zod (for schema validation)
  - Run: `npm install zod`
  - Verify package appears in dependencies

- [ ] Install unist-util-visit (AST traversal)
  - Run: `npm install unist-util-visit`
  - Verify package appears in dependencies

- [ ] Install hast-util-to-string (AST to string)
  - Run: `npm install hast-util-to-string`
  - Verify package appears in dependencies

### 1.5 Install Tailwind CSS

- [ ] Install @tailwindcss/vite
  - Run: `npm install -D @tailwindcss/vite`
  - Verify package appears in devDependencies

### 1.6 Remove Obsolete Dependencies

- [ ] Remove marked
  - Run: `npm uninstall marked`
  - Verify package removed from dependencies

- [ ] Remove @vitejs/plugin-react (TanStack Start handles this)
  - Run: `npm uninstall @vitejs/plugin-react`
  - Verify package removed from devDependencies

### 1.7 Update package.json Scripts

- [ ] Update dev script
  - Change from `vite` to use TanStack Start dev command
  - Run: `npm pkg set scripts.dev="vite"`
  - Verify scripts.dev is `"vite"`

- [ ] Update build script
  - Change from `tsc -b && vite build` to use vinxi build
  - Run: `npm pkg set scripts.build="vinxi build"`
  - Verify scripts.build is `"vinxi build"`

- [ ] Update start script
  - Change from `vite preview` to use vinxi start
  - Run: `npm pkg set scripts.start="vinxi start"`
  - Verify scripts.start is `"vinxi start"`

- [ ] Remove custom build script references
  - Remove any references to `node dist-scripts/scripts/build-static.js`
  - Ensure build process uses only TanStack Start

### 1.8 Create app.config.ts

- [ ] Create app.config.ts in project root
  - Create file with TanStack Start configuration
  - Configure vite plugins with React and Tailwind
  - Configure route file prefix as 'routes/'
  - Configure generated route tree as './src/routeTree.gen.ts'
  - Enable static prerendering with link crawling
  - Enable sitemap generation with host URL

### 1.9 Update vite.config.ts

- [ ] Simplify vite.config.ts
  - Remove old plugin configurations
  - Import app.config from TanStack Start
  - Keep minimal configuration needed for TanStack Start

### 1.10 Update tsconfig.json

- [ ] Add TanStack Router types to tsconfig.json
  - Add `@tanstack/react-router` to types array
  - Ensure configuration supports new file structure

### 1.11 Update tsconfig.app.json

- [ ] Add vitest/globals types (for test support)
  - Add `"vitest/globals"` to types array
  - This is required when vitest globals: true is configured

- [ ] Add path aliases if needed
  - Configure path aliases for cleaner imports
  - Example: `"@/*": ["./src/*"]`

---

## Phase 2: Content Collections Setup

### 2.1 Create content-collections.ts Configuration

- [ ] Create content-collections.ts in project root
  - Import defineCollection, defineConfig from @content-collections/core
  - Import matter from gray-matter
  - Import z from zod

- [ ] Create extractFrontMatter helper function
  - Accept content string parameter
  - Use matter() to parse frontmatter and body
  - Extract excerpt using gray-matter's excerpt option
  - Return data, body, and excerpt

- [ ] Define posts collection
  - Set collection name as 'posts'
  - Set directory as './posts'
  - Set include pattern as '*.md'

- [ ] Define posts schema with zod
  - title: string (required)
  - date: string (date format, required)
  - description: string (required)
  - slug: string (required)
  - tags: array of strings (required)
  - test: boolean (optional)

- [ ] Add transform function for posts collection
  - Accept content and post metadata
  - Call extractFrontMatter to parse markdown
  - Override slug to use _meta.path (directory path)
  - Calculate reading time: split body by whitespace, count words, divide by 200, use Math.ceil
  - Return transformed post object with content (body) and readingTime

- [ ] Export default configuration
  - Use defineConfig with posts array
  - Ensure proper TypeScript typing

### 2.2 Create Markdown Processor Utility

- [ ] Create src/utils/markdown.ts file
  - Import unified from 'unified'
  - Import remarkParse, remarkGfm, remarkRehype
  - Import rehypeRaw, rehypeSlug, rehypeAutolinkHeadings, rehypeStringify

- [ ] Define MarkdownHeading type
  - id: string
  - text: string
  - level: number (1-6 for h1-h6)

- [ ] Define MarkdownResult type
  - markup: string (HTML string)
  - headings: Array<MarkdownHeading>

- [ ] Create renderMarkdown function
  - Accept content string parameter
  - Return Promise<MarkdownResult>
  - Initialize empty headings array

- [ ] Configure unified pipeline
  - Add remarkParse for markdown parsing
  - Add remarkGfm for GitHub Flavored Markdown support
  - Add remarkRehype with allowDangerousHtml: true
  - Add rehypeRaw for raw HTML processing
  - Add rehypeSlug for heading IDs
  - Add rehypeAutolinkHeadings with wrap behavior and anchor className
  - Add custom plugin to extract headings from AST
  - Add rehypeStringify to serialize to HTML

- [ ] Implement heading extraction plugin
  - Import visit from unist-util-visit
  - Import toString from hast-util-to-string
  - Visit element nodes
  - Check for h1-h6 tag names
  - Extract id from properties
  - Extract text using toString
  - Extract level from tag name
  - Push to headings array

- [ ] Process and return result
  - Process content through pipeline
  - Convert result to string
  - Return markup and headings

---

## Phase 3: Tailwind CSS Integration

### 3.1 Configure Tailwind in vite.config

- [ ] Verify Tailwind plugin in app.config.ts
  - Ensure @tailwindcss/vite is imported
  - Ensure plugin is added to vite.plugins array

### 3.2 Create Tailwind CSS File

- [ ] Create src/styles directory
  - Run: `mkdir -p src/styles`

- [ ] Create src/styles/app.css
  - Add line: `@import 'tailwindcss';`
  - Save file

### 3.3 Update Root Route for Tailwind

- [ ] Create src/routes/__root.tsx
  - Import createFileRoute from @tanstack/react-router
  - Import app.css from '../styles/app.css?url'

- [ ] Configure root route
  - Use createFileRoute('/')
  - Add head function with links array
  - Add stylesheet link: `{ rel: 'stylesheet', href: appCss }`

- [ ] Add root component
  - Return Outlet component for child routes
  - Return basic HTML structure with doctype and head

### 3.4 Verify Tailwind Works

- [ ] Test dev server
  - Run: `npm run dev`
  - Verify server starts without errors
  - Check that Tailwind styles are loaded

---

## Phase 4: Route Migration

### 4.1 Create Routes Directory Structure

- [ ] Create src/routes directory
  - Run: `mkdir -p src/routes`
  - Verify directory created

### 4.2 Create Index Route (Home Page)

- [ ] Create src/routes/index.tsx
  - Import createFileRoute from @tanstack/react-router
  - Import allPosts from 'content-collections'
  - Import PostList from '../components/PostList'

- [ ] Configure route
  - Use createFileRoute('/')
  - Set component to Home function

- [ ] Add SEO meta tags
  - Add head function with meta array
  - Set title: "Leiske.dev - Blog"
  - Set description: "Thoughts on software development, programming, and technology"
  - Add Open Graph tags: og:title, og:description, og:type (website)
  - Add Twitter card tags: twitter:card (summary), twitter:title, twitter:description

- [ ] Implement Home component
  - Filter allPosts to exclude test posts (post.test !== true)
  - Sort posts by date descending (newest first)
  - Slice to get first 5 posts
  - Render heading: "Recent Posts"
  - Render PostList component with recent posts

### 4.3 Create Blog Index Route

- [ ] Create src/routes/blog.index.tsx
  - Import createFileRoute from @tanstack/react-router
  - Import allPosts from 'content-collections'
  - Import PostList from '../components/PostList'

- [ ] Configure route
  - Use createFileRoute('/blog/')
  - Set component to BlogIndex function

- [ ] Add SEO meta tags
  - Add head function with meta array
  - Set title: "Leiske.dev - All Posts"
  - Set description: "Browse all blog posts"
  - Add Open Graph tags
  - Add Twitter card tags
  - Add canonical URL: https://leiske.dev/blog

- [ ] Implement BlogIndex component
  - Filter allPosts to exclude test posts
  - Sort posts by date descending
  - Render heading: "All Posts"
  - Render PostList component with all sorted posts

### 4.4 Create Blog Post Route

- [ ] Create src/routes/blog.$slug.tsx
  - Import createFileRoute, notFound from '@tanstack/react-router'
  - Import allPosts from 'content-collections'
  - Import PostContent from '../components/PostContent'

- [ ] Configure route
  - Use createFileRoute('/blog/$slug')
  - Add loader function that accepts params

- [ ] Implement loader
  - Find post by slug in allPosts
  - If post not found, throw notFound()
  - If post.test is true in production, throw notFound()
  - Filter allPosts to exclude test posts
  - Sort posts by date descending
  - Find current post index in sorted array
  - Get nextPost if index > 0 (previous in sorted array)
  - Return { post, nextPost }

- [ ] Add SEO meta tags with dynamic data
  - Add head function that accepts loaderData
  - Set title to loaderData.post.title
  - Set description to loaderData.post.description
  - Add Open Graph tags: og:title, og:description, og:type (article), og:url
  - Add Twitter card tags: twitter:card (summary_large_image), twitter:title, twitter:description
  - Add canonical URL: https://leiske.dev/blog/{slug}
  - Add structured data (JSON-LD) with Article schema
    - @context: https://schema.org
    - @type: Article
    - headline: post.title
    - description: post.description
    - datePublished: post.date
    - tags: post.tags

- [ ] Implement BlogPost component
  - Use Route.useLoaderData() to get post and nextPost
  - Render PostContent component with post and nextPost

### 4.5 Create 404 Route

- [ ] Create src/routes/404.tsx (or src/routes/not-found.tsx)
  - Import createFileRoute from '@tanstack/react-router'

- [ ] Configure route
  - Use createFileRoute('/404')
  - Add meta tags for 404 page
  - Implement component with "Page not found" message
  - Add link back to home page

### 4.6 Generate Route Tree

- [ ] Generate route tree
  - Run: `npm run dev` (TanStack Start will auto-generate routeTree.gen.ts)
  - Verify src/routeTree.gen.ts is created
  - Verify route tree includes all routes

---

## Phase 5: Component Updates

### 5.1 Update PostList Component

- [ ] Read src/components/PostList.tsx
  - Review current implementation

- [ ] Update imports
  - Import Link from '@tanstack/react-router'
  - Keep PostMeta type import

- [ ] Update component to use Link
  - Replace anchor tags (<a>) with Link components
  - Set Link to={`/blog/${post.slug}`}
  - Keep className and styling unchanged

- [ ] Verify component exports
  - Ensure component is named export

### 5.2 Update PostContent Component

- [ ] Read src/components/PostContent.tsx
  - Review current implementation

- [ ] Add Markdown component import
  - Import Markdown from './Markdown'

- [ ] Update component signature
  - Keep Post interface type
  - Add nextPost parameter (Post | null)

- [ ] Update meta display
  - Keep date, reading time, tags display
  - Ensure proper formatting

- [ ] Replace HTML rendering with Markdown component
  - Remove dangerouslySetInnerHTML usage
  - Add Markdown component with post.content
  - Pass className="prose prose-lg max-w-none" to Markdown

- [ ] Update navigation links
  - Replace anchor tags with Link components
  - Use Link from '@tanstack/react-router'
  - Set to="/blog/{nextPost.slug}" for next post
  - Set to="/" for back to home

- [ ] Verify component exports
  - Ensure component is named export

### 5.3 Create Markdown Component

- [ ] Create src/components/Markdown.tsx
  - Import parse from html-react-parser
  - Import renderMarkdown from '../utils/markdown'
  - Import Link from '@tanstack/react-router'
  - Import useEffect, useState from 'react'

- [ ] Define Markdown component props
  - content: string
  - className?: string

- [ ] Implement markdown processing
  - useState for result (MarkdownResult | null)
  - useEffect to call renderMarkdown on content change
  - Handle loading state

- [ ] Configure html-react-parser options
  - Replace function for Element nodes
  - Handle internal links: convert <a> with href starting with '/' to Link components
  - Handle images: add loading="lazy" and className for styling

- [ ] Render markup
  - Parse result.markup with options
  - Wrap in div with className prop

---

## Phase 6: Entry Point Updates

### 6.1 Update main.tsx

- [ ] Read src/main.tsx
  - Review current implementation

- [ ] Update imports
  - Import StrictMode from 'react'
  - Import createRoot from 'react-dom/client'
  - Import RouterProvider, createRouter from '@tanstack/react-router'
  - Import routeTree from './routeTree.gen'

- [ ] Create router
  - Call createRouter({ routeTree })
  - Store in router variable

- [ ] Augment TanStack Router module
  - Add declare module '@tanstack/react-router'
  - Add interface Register with router type

- [ ] Update render call
  - Keep createRoot(document.getElementById('root')!)
  - Render RouterProvider with router prop
  - Wrap in StrictMode

- [ ] Remove old imports
  - Remove App.tsx import if present
  - Remove any routing-related imports

### 6.2 Update or Remove App.tsx

- [ ] Read src/App.tsx
  - Review current implementation

- [ ] Determine if App.tsx is needed
  - If App.tsx only contains routing logic, remove it
  - If App.tsx contains shared UI, move to root route

- [ ] Update main.tsx if App.tsx removed
  - Remove App import
  - Ensure RouterProvider is rendered directly

- [ ] Or update App.tsx for TanStack Start
  - Move shared UI to __root.tsx
  - Remove App.tsx if no longer needed

---

## Phase 7: Cleanup & Removal

### 7.1 Remove Custom Build Scripts

- [ ] Delete scripts/build-static.ts
  - Run: `rm scripts/build-static.ts`
  - Verify file is removed

- [ ] Delete dist-scripts directory if exists
  - Run: `rm -rf dist-scripts`
  - Verify directory is removed

- [ ] Remove build script references from package.json
  - Ensure no references to custom build scripts
  - Verify scripts.build uses "vinxi build"

### 7.2 Remove Old Pages

- [ ] Delete src/pages/Home.tsx
  - Run: `rm src/pages/Home.tsx`
  - Verify file is removed

- [ ] Delete src/pages/BlogPost.tsx
  - Run: `rm src/pages/BlogPost.tsx`
  - Verify file is removed

- [ ] Delete src/pages/NotFound.tsx
  - Run: `rm src/pages/NotFound.tsx`
  - Verify file is removed

- [ ] Delete src/pages directory if empty
  - Run: `rmdir src/pages`
  - Verify directory is removed

### 7.3 Remove Old Utilities

- [ ] Delete src/lib/posts.ts
  - Run: `rm src/lib/posts.ts`
  - Verify file is removed

- [ ] Delete src/lib/__tests__ directory if exists
  - Run: `rm -rf src/lib/__tests__`
  - Verify directory is removed

- [ ] Delete src/lib directory if empty
  - Run: `rmdir src/lib`
  - Verify directory is removed

### 7.4 Remove Old Types

- [ ] Review src/types/post.ts
  - Check if Post and PostMeta types are still needed

- [ ] Keep types if used by components
  - PostList uses PostMeta
  - PostContent uses Post

- [ ] Or remove types if no longer used
  - Run: `rm src/types/post.ts` if obsolete
  - Update component imports to use content-collections types

### 7.5 Clean Up index.html

- [ ] Read index.html
  - Review current contents

- [ ] Update index.html
  - Ensure it has <div id="root"></div>
  - Ensure it has proper doctype and meta tags
  - Remove any custom script tags
  - Remove any custom CSS links (handled by TanStack Start)
  - Keep minimal structure

### 7.6 Remove Old Build Artifacts

- [ ] Remove dist directory if exists
  - Run: `rm -rf dist`
  - Verify directory is removed

- [ ] Remove node_modules/.vite cache
  - Run: `rm -rf node_modules/.vite`
  - Verify cache is cleared

---

## Phase 8: Testing & Verification

### 8.1 Start Development Server

- [ ] Run dev server
  - Run: `npm run dev`
  - Wait for server to start
  - Verify no errors in console

### 8.2 Test Home Page

- [ ] Open browser to localhost (port shown in dev output)
  - Verify home page loads
  - Check for "Recent Posts" heading
  - Verify 5 most recent posts are listed
  - Click on a post link, verify navigation works

### 8.3 Test Blog Index Page

- [ ] Navigate to /blog
  - Verify "All Posts" heading is displayed
  - Verify all non-test posts are listed
  - Verify posts are sorted by date (newest first)
  - Click on a post link, verify navigation works

### 8.4 Test Individual Blog Post Page

- [ ] Navigate to a blog post
  - Verify post title is displayed
  - Verify post date is displayed
  - Verify reading time is displayed
  - Verify tags are displayed
  - Verify markdown content is rendered correctly
  - Verify code blocks are syntax highlighted (if any)
  - Verify headings have anchor links
  - Verify "← Back to home" link works
  - If there is a next post, verify "Next post:" link works

### 8.5 Test 404 Page

- [ ] Navigate to non-existent route
  - Go to /non-existent-page
  - Verify 404 page is displayed
  - Verify "Page not found" or similar message
  - Verify link back to home works

### 8.6 Test Tailwind CSS Styles

- [ ] Inspect page styles
  - Open browser dev tools
  - Inspect elements on home page
  - Verify Tailwind classes are applied
  - Check for prose typography on blog posts
  - Verify responsive design works (resize browser)

### 8.7 Test SEO Meta Tags

- [ ] Verify home page meta tags
  - Open browser dev tools
  - Check <title> tag
  - Check meta description
  - Check Open Graph tags
  - Check Twitter card tags

- [ ] Verify blog post meta tags
  - Navigate to a blog post
  - Check <title> tag (should be post title)
  - Check meta description (should be post description)
  - Check Open Graph tags (should be post-specific)
  - Check Twitter card tags
  - Check canonical URL
  - Check structured data (JSON-LD)

### 8.8 Test Navigation

- [ ] Test all internal links
  - Click on all post links
  - Verify each page loads correctly
  - Verify URL updates
  - Test browser back/forward buttons
  - Verify history navigation works

### 8.9 Run Existing Tests

- [ ] Run test suite
  - Run: `npm run test:run`
  - Review test results
  - Update tests that fail due to migration
  - Ensure no new test failures

### 8.10 Update Tests for TanStack Router

- [ ] Update test imports
  - Change routing-related imports to use TanStack Router
  - Update Link component imports

- [ ] Update routing tests
  - Modify tests that check window.location.pathname
  - Update to test TanStack Router navigation
  - Or remove obsolete routing tests

- [ ] Verify all tests pass
  - Run: `npm run test:run`
  - Ensure all tests pass

### 8.11 Build Application

- [ ] Run build command
  - Run: `npm run build`
  - Wait for build to complete
  - Verify no build errors

- [ ] Check build output
  - Verify .output directory is created (or dist, depending on config)
  - Verify HTML files are generated
  - Verify CSS files are generated
  - Verify JavaScript bundles are generated

- [ ] Preview production build
  - Run: `npm run start`
  - Wait for server to start
  - Open browser to localhost
  - Verify pages load correctly
  - Test navigation
  - Verify all functionality works

---

## Phase 9: SEO Files

### 9.1 Generate Sitemap

- [ ] Verify sitemap is configured in app.config.ts
  - Check that sitemap.enabled is true
  - Check that sitemap.host is set to 'https://leiske.dev'

- [ ] Build application to generate sitemap
  - Run: `npm run build`
  - Wait for build to complete

- [ ] Check sitemap.xml generation
  - Look for sitemap.xml in build output directory
  - Verify sitemap.xml exists
  - Read sitemap.xml content
  - Verify it contains URLs for:
    - Homepage (/)
    - Blog index (/blog)
    - All blog posts (/blog/{slug})
  - Verify URLs have correct host (https://leiske.dev)
  - Verify lastmod dates are included

### 9.2 Create robots.txt

- [ ] Create public directory if it doesn't exist
  - Run: `mkdir -p public`

- [ ] Create public/robots.txt
  - Add: `User-agent: *`
  - Add: `Allow: /`
  - Add: `Sitemap: https://leiske.dev/sitemap.xml`
  - Save file

- [ ] Verify robots.txt is served
  - Run: `npm run dev`
  - Navigate to /robots.txt
  - Verify robots.txt content is displayed

### 9.3 Test SEO Files

- [ ] Validate sitemap.xml
  - Open sitemap.xml in browser
  - Verify XML is well-formed
  - Check all URLs are accessible

- [ ] Validate robots.txt
  - Open robots.txt in browser
  - Verify content is correct
  - Use Google's robots.txt tester if desired

---

## Phase 10: Final Cleanup & Documentation

### 10.1 Update README.md

- [ ] Read current README.md
  - Review existing documentation

- [ ] Update project description
  - Mention TanStack Start framework
  - Mention content-collections for markdown
  - Mention SEO capabilities

- [ ] Update development instructions
  - Update "How to run" section to use `npm run dev`
  - Update "How to build" section to use `npm run build`
  - Update "How to test" section if needed

- [ ] Update project structure documentation
  - Document new directory structure (src/routes/)
  - Document content-collections configuration
  - Document TanStack Router usage

- [ ] Add migration notes
  - Document that this project migrated from custom build script
  - Document date of migration
  - Note any breaking changes

- [ ] Remove old deployment instructions
  - Remove GitHub Pages deployment instructions

### 10.2 Update AGENTS.md

- [ ] Read current AGENTS.md
  - Review agent instructions

- [ ] Update development commands
  - Update dev command description
  - Update build command description
  - Update tech stack section
  - Add TanStack Start, TanStack Router
  - Add content-collections
  - Add unified ecosystem for markdown
  - Update Tailwind CSS notes (import-based approach)

- [ ] Update code style guidelines
  - Add TanStack Router file-based routing conventions
  - Add route configuration patterns
  - Add head property usage for SEO

- [ ] Remove old build script references
  - Remove references to custom build scripts
  - Remove references to manual HTML generation

### 10.3 Remove GitHub Pages Deployment Workflow

- [ ] Delete .github/workflows/deploy.yml
  - Run: `rm .github/workflows/deploy.yml`
  - Verify file is removed

### 10.4 Run Linting

- [ ] Run linter
  - Run: `npm run lint`
  - Review linting errors
  - Fix any linting issues

- [ ] Run TypeScript type checking
  - Run: `tsc -b` (or use npm run build which includes typecheck)
  - Review type errors
  - Fix any type errors

### 10.5 Final Verification Checklist

- [ ] All routes work correctly
  - Home page loads
  - Blog index loads
  - Blog posts load
  - 404 page displays

- [ ] All components render correctly
  - PostList displays posts
  - PostContent displays full post
  - Markdown renders properly

- [ ] Tailwind CSS is applied
  - Styles are loaded
  - Typography looks correct
  - Responsive design works

- [ ] SEO is properly configured
  - Meta tags are present on all pages
  - Open Graph tags are present
  - Twitter cards are configured
  - Structured data (JSON-LD) is present on blog posts
  - Canonical URLs are set
  - Sitemap.xml is generated
  - robots.txt is configured

- [ ] No console errors
  - Check browser console for errors
  - Check dev server console for warnings/errors

- [ ] Tests pass
  - All existing tests pass
  - No new test failures

- [ ] Build succeeds
  - `npm run build` completes without errors
  - Build artifacts are correct

- [ ] Documentation is updated
  - README.md is updated
  - AGENTS.md is updated
  - Instructions are clear

### 10.6 Create Migration Summary Document

- [ ] Create MIGRATION.md
  - Document what was changed
  - List removed dependencies
  - List new dependencies
  - List file changes
  - Provide migration date
  - Note any breaking changes for future reference

- [ ] Commit all changes
  - Review git diff
  - Stage all changes
  - Create commit with descriptive message: "Migrate to TanStack Start"
  - Verify commit is successful

---

## Completion Criteria

Migration is complete when:

- [ ] All tasks in this plan are checked off
- [ ] Development server runs without errors (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
- [ ] All pages render correctly in browser
- [ ] Tailwind CSS styles are applied
- [ ] SEO meta tags are present and correct
- [ ] Sitemap.xml is generated
- [ ] robots.txt is configured
- [ ] All tests pass (`npm run test:run`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript type checking passes
- [ ] Documentation is updated
- [ ] Old files and code are removed
- [ ] No console errors in development or production

---

## Notes for New Engineers

### Prerequisites
- Node.js and npm installed
- Git installed
- Basic knowledge of React and TypeScript
- Familiarity with file-based routing concepts

### Getting Started
1. Read this entire plan before starting
2. Work through tasks in order (phases are sequential)
3. Check off each task as you complete it
4. Test after each phase to catch issues early
5. Ask questions if something is unclear

### Common Issues

**Content Collections Not Generating Types:**
- Ensure content-collections.ts is in project root
- Restart dev server after creating configuration
- Check for TypeScript errors in console

**Route Tree Not Generating:**
- Ensure routes directory structure is correct
- Restart dev server after adding routes
- Check for syntax errors in route files

**Tailwind Not Working:**
- Ensure app.config.ts has Tailwind plugin
- Ensure app.css has @import 'tailwindcss';
- Ensure root route imports app.css
- Check browser dev tools for loaded stylesheets

**Markdown Not Rendering:**
- Check console for errors
- Verify unified pipeline is configured correctly
- Ensure all required dependencies are installed
- Test markdown processing in isolation

### Testing Strategy
- Test incrementally after each phase
- Use browser dev tools to inspect DOM and styles
- Check console for errors and warnings
- Verify SEO meta tags in browser dev tools (Elements tab → Head section)

### Rollback Plan
If migration fails:
1. Revert to backup branch
2. Identify the issue
3. Fix the issue
4. Continue migration from that point

---

## Estimated Timeline

- **Phase 1** (Setup): 1-2 hours
- **Phase 2** (Content Collections): 2-3 hours
- **Phase 3** (Tailwind): 30 minutes
- **Phase 4** (Routes): 2-3 hours
- **Phase 5** (Components): 1-2 hours
- **Phase 6** (Entry Points): 30 minutes
- **Phase 7** (Cleanup): 30 minutes
- **Phase 8** (Testing): 2-3 hours
- **Phase 9** (SEO Files): 30 minutes
- **Phase 10** (Final): 1-2 hours

**Total Estimated Time**: 10-17 hours

---

## Dependencies Removed

- `marked` - replaced with unified ecosystem
- `@vitejs/plugin-react` - replaced by TanStack Start
- Custom build scripts - replaced by TanStack Start

## Dependencies Added

### TanStack Stack
- `@tanstack/react-start`
- `@tanstack/react-router`
- `vinxi`

### Content Collections
- `@content-collections/core`
- `@content-collections/vite`
- `zod`

### Markdown Processing
- `unified`
- `remark-parse`
- `remark-gfm`
- `remark-rehype`
- `rehype-raw`
- `rehype-slug`
- `rehype-autolink-headings`
- `rehype-stringify`
- `html-react-parser`
- `shiki`
- `gray-matter`
- `unist-util-visit`
- `hast-util-to-string`

### Styling
- `@tailwindcss/vite`

---

## Files Created

- `app.config.ts` - TanStack Start configuration
- `content-collections.ts` - Content collections configuration
- `src/utils/markdown.ts` - Markdown processor utility
- `src/components/Markdown.tsx` - Markdown rendering component
- `src/routes/__root.tsx` - Root layout route
- `src/routes/index.tsx` - Home page
- `src/routes/blog.index.tsx` - Blog index
- `src/routes/blog.$slug.tsx` - Individual blog post
- `src/routes/404.tsx` - 404 page
- `src/styles/app.css` - Tailwind CSS import
- `public/robots.txt` - Robots.txt file
- `src/routeTree.gen.ts` - Auto-generated route tree

## Files Modified

- `package.json` - Dependencies and scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - TypeScript app configuration
- `index.html` - HTML entry point
- `src/main.tsx` - Application entry point
- `src/components/PostList.tsx` - Updated to use Link
- `src/components/PostContent.tsx` - Updated to use Markdown component

## Files Deleted

- `scripts/build-static.ts` - Custom build script
- `dist-scripts/` - Build script output
- `src/pages/Home.tsx` - Old home page
- `src/pages/BlogPost.tsx` - Old blog post page
- `src/pages/NotFound.tsx` - Old 404 page
- `src/lib/posts.ts` - Old posts utility
- `src/lib/__tests__/` - Old tests
- `.github/workflows/deploy.yml` - GitHub Pages workflow

**Happy migrating!**
