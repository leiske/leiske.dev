# Blog Implementation Backlog

## Phase 1: Dependencies and Configuration

- [x] Install required dependencies
  - [x] Run: `npm install gray-matter marked @tailwindcss/typography`
  - [x] Verify installation by checking `package.json`

- [x] Configure Tailwind Typography plugin
  - [x] Update `vite.config.ts` to add typography plugin imports
  - [x] Test that `prose` classes are available (e.g., use in a test component)

- [x] Update TypeScript config to include scripts
  - [x] Modify `tsconfig.node.json` to include `"scripts/**/*.ts"` in `include` array
  - [x] Run `tsc --noEmit` to verify no errors

## Phase 2: Type Definitions

- [x] Create post type definitions
  - [x] Create `src/types/post.ts`
  - [x] Define `PostMeta` interface with fields: `slug`, `title`, `date`, `description`, `tags` (string[])
  - [x] Define `Post` interface extending `PostMeta` with: `content` (string HTML), `readingTime` (number)

- [x] Verify types are importable
  - [x] Create a test import in `src/App.tsx` to ensure types load correctly
  - [x] Remove test import after verification

## Phase 3: Post Loading Utilities

- [x] Create post parsing utilities
  - [x] Create `src/lib/posts.ts`
  - [x] Import `gray-matter` for frontmatter parsing
  - [x] Import `marked` for markdown-to-HTML conversion

- [x] Implement calculateReadingTime function
  - [x] Create `calculateReadingTime(content: string): number` function
  - [x] Count words (split by whitespace)
  - [x] Divide by 200 words per minute, round up to nearest integer
  - [x] Return reading time in minutes
  - [x] Add inline comment explaining the 200 wpm assumption

- [x] Implement getPostBySlug function
  - [x] Create `getPostBySlug(slug: string): Post | null` function
  - [x] Construct file path: `posts/${slug}.md`
  - [x] Use `fs` to read the file (handle file not found gracefully)
  - [x] Parse frontmatter with `gray-matter`
  - [x] Extract: date, title, slug, description, tags from frontmatter data
  - [x] Convert markdown body to HTML using `marked`
  - [x] Calculate reading time from markdown content
  - [x] Return `Post` object or `null` if file not found

- [x] Implement getAllPosts function
  - [x] Create `getAllPosts(): Post[]` function
  - [x] Use `fs.readdirSync` to list all `.md` files in `posts/` directory
  - [x] Filter for files ending with `.md`
  - [x] Map each filename to `getPostBySlug(filename without .md)`
  - [x] Filter out any null results (posts that failed to parse)
  - [x] Sort posts by `date` in descending order (newest first)
  - [x] Return sorted array

- [x] Test post loading functions
  - [x] Create a temporary test script or log output in `src/App.tsx`
  - [x] Test `getAllPosts()` returns the existing post
  - [x] Verify frontmatter fields are parsed correctly
  - [x] Verify markdown content is converted to HTML
  - [x] Verify reading time is calculated
  - [x] Clean up test code

## Phase 4: Update Sample Post Frontmatter

- [x] Read existing post
  - [x] Read `posts/opencode-cursor-thoughts.md`
  - [x] Identify current frontmatter format

- [x] Update frontmatter to YAML format
  - [x] Replace triple backticks with triple dashes (`---`)
  - [x] Ensure all required fields are present: `date`, `title`, `slug`, `description`, `tags`
  - [x] Format `tags` as YAML array or comma-separated string (update parser accordingly)
  - [x] Save the updated file

- [x] Verify updated post loads correctly
  - [x] Test `getPostBySlug('opencode-cursor-thoughts')` returns valid data
  - [x] Check all frontmatter fields are accessible

## Phase 5: Create Components

- [x] Create PostList component
  - [x] Create `src/components/PostList.tsx`
  - [x] Define props interface: `posts: PostMeta[]`
  - [x] Return an unordered list (`<ul>`) with Tailwind classes for styling
  - [x] Render each post as a list item (`<li>`) containing:
    - Title as a link (`<a>`) to `/blog/${slug}/`
    - Date formatted to user's locale using `new Date(post.date).toLocaleDateString()`
    - Add Tailwind classes for spacing and typography
  - [x] Handle empty array case (show "No posts available" message or empty list)

- [x] Create PostContent component
   - [x] Create `src/components/PostContent.tsx`
   - [x] Define props interface: `post: Post`, `nextPost: Post | null`
   - [x] Render post title as `<h1>` with Tailwind typography
   - [x] Render metadata row containing:
     - Date formatted to user's locale
     - Reading time (e.g., "3 min read")
     - Tags as a list of badges/spans
   - [x] Render post content HTML using `dangerouslySetInnerHTML`
   - [x] Add `prose` class from Tailwind Typography to content container
   - [x] Render "Next post" link at bottom if `nextPost` exists
   - [x] Add back to home link at bottom
   - [x] Use appropriate Tailwind classes for spacing and layout

## Phase 6: Create Page Templates

- [x] Create Home page component
   - [x] Create `src/pages/Home.tsx`
   - [x] Import `PostList` component
   - [x] Import `getAllPosts` from `src/lib/posts.ts`
   - [x] Call `getAllPosts()` to get all posts
   - [x] Slice to get first 5 posts: `.slice(0, 5)`
   - [x] Render a heading (e.g., "Recent Posts")
   - [x] Render `PostList` with the 5 posts
   - [x] Add basic page container with Tailwind classes (padding, max-width, etc.)

- [x] Create BlogPost page template
  - [x] Create `src/pages/BlogPost.tsx`
  - [x] Define props: `slug: string` (for build-time generation)
  - [x] Import `PostContent` component
  - [x] Import `getPostBySlug` and `getAllPosts` from `src/lib/posts.ts`
  - [x] Call `getPostBySlug(slug)` to get the post
  - [x] Call `getAllPosts()` to find the next post (find post with date before current post's date)
  - [x] If post is null, render "Post not found" message
  - [x] Otherwise, render `PostContent` with the post and next post
  - [x] Add page container with Tailwind classes

## Phase 7: Update App Entry Point

- [x] Update App.tsx for development
  - [x] Modify `src/App.tsx` to conditionally render based on URL
  - [x] For development mode: use simple client-side routing (check `window.location.pathname`)
    - [x] If path is `/`, render `Home`
    - [x] If path matches `/blog/{slug}/`, extract slug and render `BlogPost` with that slug
    - [x] Otherwise, render 404 or redirect to home
  - [x] Keep it simple for dev - full static generation happens in build

- [x] Test development routing
  - [x] Run `npm run dev`
  - [x] Navigate to `/` and verify posts list displays
  - [x] Navigate to `/blog/opencode-cursor-thoughts/` and verify post displays
  - [x] Check that metadata (date, reading time, tags) renders correctly

## Phase 8: Build Script for Static Generation

- [x] Create build script directory
  - [x] Create `scripts/` directory if it doesn't exist

- [x] Create build script
  - [x] Create `scripts/build-static.ts`
  - [x] Import required dependencies: `fs`, `path`, `react-dom/server`, posts utilities, page components

- [x] Implement ensureDirectoryExists utility
  - [x] Create helper function to ensure a directory exists
  - [x] Use `fs.existsSync` to check
  - [x] Use `fs.mkdirSync` with `recursive: true` if not exists

- [x] Implement renderPage utility
  - [x] Create `renderPage(jsxComponent: React.ReactElement): string` function
  - [x] Use `ReactDOMServer.renderToStaticMarkup()` to convert JSX to HTML string
  - [x] Wrap the component in a basic HTML shell with:
    - `<!DOCTYPE html>`
    - `<html>` and `<head>` with title, charset, viewport meta
    - Link to Vite-generated CSS (will need to copy from build output)
    - `<body>` with the rendered component
  - [x] Return complete HTML string

- [x] Implement build script main function
  - [x] Get `getAllPosts()` to retrieve all posts
  - [x] Render homepage using `Home` component via `renderPage`
  - [x] Write homepage HTML to `dist/index.html`

- [x] Implement blog post generation in build script
  - [x] For each post in `getAllPosts()`:
    - Create directory path: `dist/blog/${post.slug}/`
    - Use `ensureDirectoryExists` to create directory
    - Render post using `BlogPost({ slug: post.slug })` via `renderPage`
    - Write HTML to `dist/blog/${post.slug}/index.html`

- [x] Add error handling to build script
  - [x] Wrap main logic in try-catch
  - [x] Log errors clearly with file paths
  - [x] Exit with non-zero code on failure

- [x] Add console logging for build progress
  - [x] Log "Building static site..."
  - [x] Log "Homepage generated"
  - [x] Log "Generated N posts" with count
  - [x] Log "Build complete" on success

## Phase 9: Vite Configuration for Static Build

- [x] Configure Vite base path
  - [x] Update `vite.config.ts`
  - [x] Set `base: '/'` (or appropriate base path for production)
  - [x] This ensures assets are referenced correctly from nested routes

- [x] Configure build output
  - [x] Ensure `build.outDir` is set to `'dist'` (default)
  - [x] Add `build.emptyOutDir: true` to clean dist before build

- [x] Test Vite build works
  - [x] Run `npm run build` (should just run `tsc -b && vite build`)
  - [x] Verify `dist/` is created with assets
  - [x] Check that CSS and JS are generated

## Phase 10: Integrate Build Script into npm Scripts

- [x] Compile build script
  - [x] Run `tsc scripts/build-static.ts --outDir dist-scripts` or similar
  - [x] Verify compiled JS is created
  - [x] Update `tsconfig.node.json` to include `scripts` if not already done

- [x] Update package.json build script
  - [x] Modify `"build"` script in `package.json`
  - [x] Change from: `"build": "tsc -b && vite build"`
  - [x] Change to: `"build": "tsc -b && vite build && node dist-scripts/build-static.js"`
  - [x] Ensure script executes in order

 - [x] Test full build process
   - [x] Run `npm run build`
   - [x] Verify it completes without errors
   - [x] Check `dist/index.html` exists and contains homepage content
   - [x] Check `dist/blog/opencode-cursor-thoughts/index.html` exists
   - [x] Verify post page contains full post content

## Phase 11: Verify Static Output

- [x] Inspect generated HTML files
   - [x] Read `dist/index.html` - verify homepage structure
   - [x] Read `dist/blog/opencode-cursor-thoughts/index.html` - verify post structure
   - [x] Check that HTML includes proper DOCTYPE, head, and body

 - [x] Test preview mode
   - [x] Run `npm run preview`
   - [x] Navigate to `http://localhost:4173/` (or whatever port)
   - [x] Verify homepage displays correctly
   - [x] Click on post link or navigate to `/blog/opencode-cursor-thoughts/`
   - [x] Verify post displays correctly
   - [x] Check that "Next post" link works if there are multiple posts

## Phase 12: Linting and Type Checking

 - [x] Run linter
   - [x] Execute `npm run lint`
   - [x] Fix any linting errors
   - [x] Ensure no unused imports or variables

- [x] Run TypeScript compiler
   - [x] Execute `tsc -b`
   - [x] Fix any type errors
   - [x] Ensure strict mode compliance

 - [x] Final build verification
   - [x] Run `npm run build` one final time
   - [x] Ensure no errors or warnings
   - [x] Verify generated files are correct

## Phase 13: Documentation and Cleanup

 - [x] Update AGENTS.md with new information
   - [x] Document the blog structure in `AGENTS.md`
   - [x] Add notes about post format (frontmatter schema)
   - [x] Document how to add new posts
   - [x] Document build process

 - [x] Remove any test or debug code
   - [x] Review all created files
   - [x] Remove console.log statements
   - [x] Remove temporary test imports

 - [x] Create a README for the blog feature (optional)
   - [x] Document how to create a new post
   - [x] Document required frontmatter fields
   - [x] Document build and preview process

## Phase 14: Edge Cases and Polish

- [x] Handle missing frontmatter fields gracefully
   - [x] Update `getPostBySlug` to provide default values for missing fields
   - [x] Log warnings when required fields are missing

 - [x] Handle malformed markdown
   - [x] Test with markdown that has syntax errors
   - [x] Ensure the build doesn't crash
   - [x] Log errors for problematic files

- [x] Add 404 page for static build
   - [x] Create a simple 404 page component
   - [x] Generate `dist/404.html` in build script
   - [x] Update Vite config to use custom 404 if supported

- [x] Verify date formatting edge cases
   - [x] Test with different date formats in frontmatter
   - [x] Ensure locale formatting works correctly
   - [x] Test with posts on different dates

## Phase 15: Testing with Multiple Posts

  - [x] Create additional test posts
    - [x] Create `posts/test-post-1.md` with different content
    - [x] Create `posts/test-post-2.md` with different content
    - [x] Create `posts/test-post-3.md` with different content
    - [x] Ensure proper frontmatter format

 - [x] Test post ordering
   - [x] Verify posts are sorted by date correctly
   - [x] Check homepage shows newest 5 posts
   - [x] Verify "Next post" links work in chronological order

  - [x] Test tag rendering
    - [x] Ensure tags are rendered as badges or list items
    - [x] Test with varying numbers of tags (0, 1, many)

 - [x] Test reading time calculation
   - [x] Create a very short post and verify reading time
   - [x] Create a long post and verify reading time
   - [x] Check that reading time is reasonable

- [x] Clean up test posts
  - [x] Delete test posts after verification
  - [x] Or keep them as examples if desired

## Completion Criteria

- [x] Homepage (`/`) displays up to 5 most recent posts with titles and dates
- [x] Post pages (`/blog/{slug}/`) display full content with metadata
- [x] All pages are pre-rendered as static HTML
- [x] Date formatting uses user's locale
- [x] Reading time is displayed on post pages
- [x] "Next post" navigation works when applicable
- [x] Build process completes without errors
- [x] `npm run lint` passes
- [x] `npm run build` generates correct static files
- [x] `npm run preview` shows working static site
