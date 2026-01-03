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

- [ ] Create post type definitions
  - [ ] Create `src/types/post.ts`
  - [ ] Define `PostMeta` interface with fields: `slug`, `title`, `date`, `description`, `tags` (string[])
  - [ ] Define `Post` interface extending `PostMeta` with: `content` (string HTML), `readingTime` (number)

- [ ] Verify types are importable
  - [ ] Create a test import in `src/App.tsx` to ensure types load correctly
  - [ ] Remove test import after verification

## Phase 3: Post Loading Utilities

- [ ] Create post parsing utilities
  - [ ] Create `src/lib/posts.ts`
  - [ ] Import `gray-matter` for frontmatter parsing
  - [ ] Import `marked` for markdown-to-HTML conversion

- [ ] Implement calculateReadingTime function
  - [ ] Create `calculateReadingTime(content: string): number` function
  - [ ] Count words (split by whitespace)
  - [ ] Divide by 200 words per minute, round up to nearest integer
  - [ ] Return reading time in minutes
  - [ ] Add inline comment explaining the 200 wpm assumption

- [ ] Implement getPostBySlug function
  - [ ] Create `getPostBySlug(slug: string): Post | null` function
  - [ ] Construct file path: `posts/${slug}.md`
  - [ ] Use `fs` to read the file (handle file not found gracefully)
  - [ ] Parse frontmatter with `gray-matter`
  - [ ] Extract: date, title, slug, description, tags from frontmatter data
  - [ ] Convert markdown body to HTML using `marked`
  - [ ] Calculate reading time from markdown content
  - [ ] Return `Post` object or `null` if file not found

- [ ] Implement getAllPosts function
  - [ ] Create `getAllPosts(): Post[]` function
  - [ ] Use `fs.readdirSync` to list all `.md` files in `posts/` directory
  - [ ] Filter for files ending with `.md`
  - [ ] Map each filename to `getPostBySlug(filename without .md)`
  - [ ] Filter out any null results (posts that failed to parse)
  - [ ] Sort posts by `date` in descending order (newest first)
  - [ ] Return sorted array

- [ ] Test post loading functions
  - [ ] Create a temporary test script or log output in `src/App.tsx`
  - [ ] Test `getAllPosts()` returns the existing post
  - [ ] Verify frontmatter fields are parsed correctly
  - [ ] Verify markdown content is converted to HTML
  - [ ] Verify reading time is calculated
  - [ ] Clean up test code

## Phase 4: Update Sample Post Frontmatter

- [ ] Read existing post
  - [ ] Read `posts/opencode-cursor-thoughts.md`
  - [ ] Identify current frontmatter format

- [ ] Update frontmatter to YAML format
  - [ ] Replace triple backticks with triple dashes (`---`)
  - [ ] Ensure all required fields are present: `date`, `title`, `slug`, `description`, `tags`
  - [ ] Format `tags` as YAML array or comma-separated string (update parser accordingly)
  - [ ] Save the updated file

- [ ] Verify updated post loads correctly
  - [ ] Test `getPostBySlug('opencode-cursor-thoughts')` returns valid data
  - [ ] Check all frontmatter fields are accessible

## Phase 5: Create Components

- [ ] Create PostList component
  - [ ] Create `src/components/PostList.tsx`
  - [ ] Define props interface: `posts: PostMeta[]`
  - [ ] Return an unordered list (`<ul>`) with Tailwind classes for styling
  - [ ] Render each post as a list item (`<li>`) containing:
    - Title as a link (`<a>`) to `/blog/${slug}/`
    - Date formatted to user's locale using `new Date(post.date).toLocaleDateString()`
    - Add Tailwind classes for spacing and typography
  - [ ] Handle empty array case (show "No posts available" message or empty list)

- [ ] Create PostContent component
  - [ ] Create `src/components/PostContent.tsx`
  - [ ] Define props interface: `post: Post`, `nextPost: Post | null`
  - [ ] Render post title as `<h1>` with Tailwind typography
  - [ ] Render metadata row containing:
    - Date formatted to user's locale
    - Reading time (e.g., "3 min read")
    - Tags as a list of badges/spans
  - [ ] Render post content HTML using `dangerouslySetInnerHTML`
  - [ ] Add `prose` class from Tailwind Typography to content container
  - [ ] Render "Next post" link at bottom if `nextPost` exists
  - [ ] Add back to home link at bottom
  - [ ] Use appropriate Tailwind classes for spacing and layout

## Phase 6: Create Page Templates

- [ ] Create Home page component
  - [ ] Create `src/pages/Home.tsx`
  - [ ] Import `PostList` component
  - [ ] Import `getAllPosts` from `src/lib/posts.ts`
  - [ ] Call `getAllPosts()` to get all posts
  - [ ] Slice to get first 5 posts: `.slice(0, 5)`
  - [ ] Render a heading (e.g., "Recent Posts")
  - [ ] Render `PostList` with the 5 posts
  - [ ] Add basic page container with Tailwind classes (padding, max-width, etc.)

- [ ] Create BlogPost page template
  - [ ] Create `src/pages/BlogPost.tsx`
  - [ ] Define props: `slug: string` (for build-time generation)
  - [ ] Import `PostContent` component
  - [ ] Import `getPostBySlug` and `getAllPosts` from `src/lib/posts.ts`
  - [ ] Call `getPostBySlug(slug)` to get the post
  - [ ] Call `getAllPosts()` to find the next post (find post with date before current post's date)
  - [ ] If post is null, render "Post not found" message
  - [ ] Otherwise, render `PostContent` with the post and next post
  - [ ] Add page container with Tailwind classes

## Phase 7: Update App Entry Point

- [ ] Update App.tsx for development
  - [ ] Modify `src/App.tsx` to conditionally render based on URL
  - [ ] For development mode: use simple client-side routing (check `window.location.pathname`)
    - If path is `/`, render `Home`
    - If path matches `/blog/{slug}/`, extract slug and render `BlogPost` with that slug
    - Otherwise, render 404 or redirect to home
  - [ ] Keep it simple for dev - full static generation happens in build

- [ ] Test development routing
  - [ ] Run `npm run dev`
  - [ ] Navigate to `/` and verify posts list displays
  - [ ] Navigate to `/blog/opencode-cursor-thoughts/` and verify post displays
  - [ ] Check that metadata (date, reading time, tags) renders correctly

## Phase 8: Build Script for Static Generation

- [ ] Create build script directory
  - [ ] Create `scripts/` directory if it doesn't exist

- [ ] Create build script
  - [ ] Create `scripts/build-static.ts`
  - [ ] Import required dependencies: `fs`, `path`, `react-dom/server`, posts utilities, page components

- [ ] Implement ensureDirectoryExists utility
  - [ ] Create helper function to ensure a directory exists
  - [ ] Use `fs.existsSync` to check
  - [ ] Use `fs.mkdirSync` with `recursive: true` if not exists

- [ ] Implement renderPage utility
  - [ ] Create `renderPage(jsxComponent: React.ReactElement): string` function
  - [ ] Use `ReactDOMServer.renderToStaticMarkup()` to convert JSX to HTML string
  - [ ] Wrap the component in a basic HTML shell with:
    - `<!DOCTYPE html>`
    - `<html>` and `<head>` with title, charset, viewport meta
    - Link to Vite-generated CSS (will need to copy from build output)
    - `<body>` with the rendered component
  - [ ] Return complete HTML string

- [ ] Implement build script main function
  - [ ] Get `getAllPosts()` to retrieve all posts
  - [ ] Render homepage using `Home` component via `renderPage`
  - [ ] Write homepage HTML to `dist/index.html`

- [ ] Implement blog post generation in build script
  - [ ] For each post in `getAllPosts()`:
    - Create directory path: `dist/blog/${post.slug}/`
    - Use `ensureDirectoryExists` to create directory
    - Render post using `BlogPost({ slug: post.slug })` via `renderPage`
    - Write HTML to `dist/blog/${post.slug}/index.html`

- [ ] Add error handling to build script
  - [ ] Wrap main logic in try-catch
  - [ ] Log errors clearly with file paths
  - [ ] Exit with non-zero code on failure

- [ ] Add console logging for build progress
  - [ ] Log "Building static site..."
  - [ ] Log "Homepage generated"
  - [ ] Log "Generated N posts" with count
  - [ ] Log "Build complete" on success

## Phase 9: Vite Configuration for Static Build

- [ ] Configure Vite base path
  - [ ] Update `vite.config.ts`
  - [ ] Set `base: '/'` (or appropriate base path for production)
  - [ ] This ensures assets are referenced correctly from nested routes

- [ ] Configure build output
  - [ ] Ensure `build.outDir` is set to `'dist'` (default)
  - [ ] Add `build.emptyOutDir: true` to clean dist before build

- [ ] Test Vite build works
  - [ ] Run `npm run build` (should just run `tsc -b && vite build`)
  - [ ] Verify `dist/` is created with assets
  - [ ] Check that CSS and JS are generated

## Phase 10: Integrate Build Script into npm Scripts

- [ ] Compile build script
  - [ ] Run `tsc scripts/build-static.ts --outDir dist-scripts` or similar
  - [ ] Verify compiled JS is created
  - [ ] Update `tsconfig.node.json` to include `scripts` if not already done

- [ ] Update package.json build script
  - [ ] Modify `"build"` script in `package.json`
  - [ ] Change from: `"build": "tsc -b && vite build"`
  - [ ] Change to: `"build": "tsc -b && vite build && node dist-scripts/build-static.js"`
  - [ ] Ensure script executes in order

- [ ] Test full build process
  - [ ] Run `npm run build`
  - [ ] Verify it completes without errors
  - [ ] Check `dist/index.html` exists and contains homepage content
  - [ ] Check `dist/blog/opencode-cursor-thoughts/index.html` exists
  - [ ] Verify post page contains full post content

## Phase 11: Verify Static Output

- [ ] Inspect generated HTML files
  - [ ] Read `dist/index.html` - verify homepage structure
  - [ ] Read `dist/blog/opencode-cursor-thoughts/index.html` - verify post structure
  - [ ] Check that HTML includes proper DOCTYPE, head, and body

- [ ] Test preview mode
  - [ ] Run `npm run preview`
  - [ ] Navigate to `http://localhost:4173/` (or whatever port)
  - [ ] Verify homepage displays correctly
  - [ ] Click on post link or navigate to `/blog/opencode-cursor-thoughts/`
  - [ ] Verify post displays correctly
  - [ ] Check that "Next post" link works if there are multiple posts

## Phase 12: Linting and Type Checking

- [ ] Run linter
  - [ ] Execute `npm run lint`
  - [ ] Fix any linting errors
  - [ ] Ensure no unused imports or variables

- [ ] Run TypeScript compiler
  - [ ] Execute `tsc -b`
  - [ ] Fix any type errors
  - [ ] Ensure strict mode compliance

- [ ] Final build verification
  - [ ] Run `npm run build` one final time
  - [ ] Ensure no errors or warnings
  - [ ] Verify generated files are correct

## Phase 13: Documentation and Cleanup

- [ ] Update AGENTS.md with new information
  - [ ] Document the blog structure in `AGENTS.md`
  - [ ] Add notes about post format (frontmatter schema)
  - [ ] Document how to add new posts
  - [ ] Document build process

- [ ] Remove any test or debug code
  - [ ] Review all created files
  - [ ] Remove console.log statements
  - [ ] Remove temporary test imports

- [ ] Create a README for the blog feature (optional)
  - [ ] Document how to create a new post
  - [ ] Document required frontmatter fields
  - [ ] Document build and preview process

## Phase 14: Edge Cases and Polish

- [ ] Handle missing frontmatter fields gracefully
  - [ ] Update `getPostBySlug` to provide default values for missing fields
  - [ ] Log warnings when required fields are missing

- [ ] Handle malformed markdown
  - [ ] Test with markdown that has syntax errors
  - [ ] Ensure the build doesn't crash
  - [ ] Log errors for problematic files

- [ ] Add 404 page for static build
  - [ ] Create a simple 404 page component
  - [ ] Generate `dist/404.html` in build script
  - [ ] Update Vite config to use custom 404 if supported

- [ ] Verify date formatting edge cases
  - [ ] Test with different date formats in frontmatter
  - [ ] Ensure locale formatting works correctly
  - [ ] Test with posts on different dates

## Phase 15: Testing with Multiple Posts

- [ ] Create additional test posts
  - [ ] Create `posts/test-post-2.md` with different content
  - [ ] Create `posts/test-post-3.md` with different content
  - [ ] Ensure proper frontmatter format

- [ ] Test post ordering
  - [ ] Verify posts are sorted by date correctly
  - [ ] Check homepage shows newest 5 posts
  - [ ] Verify "Next post" links work in chronological order

- [ ] Test tag rendering
  - [ ] Ensure tags are rendered as badges or list items
  - [ ] Test with varying numbers of tags (0, 1, many)

- [ ] Test reading time calculation
  - [ ] Create a very short post and verify reading time
  - [ ] Create a long post and verify reading time
  - [ ] Check that reading time is reasonable

- [ ] Clean up test posts
  - [ ] Delete test posts after verification
  - [ ] Or keep them as examples if desired

## Completion Criteria

- [ ] Homepage (`/`) displays up to 5 most recent posts with titles and dates
- [ ] Post pages (`/blog/{slug}/`) display full content with metadata
- [ ] All pages are pre-rendered as static HTML
- [ ] Date formatting uses user's locale
- [ ] Reading time is displayed on post pages
- [ ] "Next post" navigation works when applicable
- [ ] Build process completes without errors
- [ ] `npm run lint` passes
- [ ] `npm run build` generates correct static files
- [ ] `npm run preview` shows working static site
