# RSS & Atom Feed Implementation Plan

## Overview
Add automated RSS 2.0 and Atom 1.0 feeds to leiske.dev blog using the `feed` package. Feeds will auto-regenerate when content changes with zero ongoing maintenance.

## Target URLs
- RSS Feed: `https://leiske.dev/feed.xml`
- Atom Feed: `https://leiske.dev/atom.xml`

## Metadata
- Site URL: https://leiske.dev
- Blog Title: "Leiske.dev - Blog"
- Blog Description: "Thoughts on software development, programming, and technology"
- Author Name: Colby Leiske
- Author Email: colby.leiske@gmail.com

---

## Task Backlog

### Phase 1: Preparation & Installation

- [x] Verify current project state
  - Run `npm run dev` to confirm project starts without errors
  - Visit `http://localhost:3000` to verify blog loads
  - Visit `http://localhost:3000/blog` to confirm posts display
  - **Output**: Development server running at port 3000, blog accessible

- [x] Install `feed` package dependency
   - Run `npm install feed`
   - Check `package.json` to confirm `feed` is listed in dependencies
   - **Output**: `feed` package version 5.1.0 installed and visible in package.json

- [x] Verify `feed` package installation
   - Run `npm list feed` to confirm package is properly installed
   - Check for any dependency conflicts or warnings
   - **Output**: Successful output showing `feed` package tree with no errors

- [x] Review content-collections structure
  - Read `content-collections.ts` to understand Post schema
  - Read a sample blog post from `posts/` directory to understand frontmatter
  - **Output**: Understanding of Post type structure (title, date, description, slug, tags, content)

### Phase 2: Create Feed Generation Utility

 - [x] Create `src/utils/feed.ts` file
   - Create new file with imports: `Feed` from 'feed', `allPosts` from 'content-collections'
   - Define `generateFeed()` function with no parameters
   - **Output**: New file created at `src/utils/feed.ts` with basic structure

 - [x] Implement Feed initialization in utility function
   - Create new `Feed` instance with metadata (title, description, id, link, language, copyright)
   - Use "Leiske.dev - Blog" as title
   - Use "Thoughts on software development, programming, and technology" as description
   - Use "https://leiske.dev" for id and link
   - Set language to "en"
   - Set copyright with current year and author name
   - **Output**: `Feed` object initialized with all required metadata

 - [x] Implement post filtering and sorting
   - Filter `allPosts` to exclude test posts (`post.test !== true`)
   - Sort filtered posts by date (newest first) using `parseDate()` utility
   - Handle date parsing with error handling
   - **Output**: Sorted array of published posts, excluding test posts

 - [x] Implement feed item generation loop
   - Iterate through sorted posts and add each as a feed item
   - For each post, set: title, description, link (`/blog/${slug}`), date, author
   - Add author object with name "Colby Leiske" and email "colby.leiske@gmail.com"
   - **Output**: Each post added as a feed item with all required fields

 - [x] Complete `generateFeed()` function implementation
   - Return the fully configured `Feed` object
   - Export the function as default export
   - Add TypeScript types for Feed item if needed
   - **Output**: Complete, exportable `generateFeed()` function returning Feed object

 - [x] Add TypeScript error handling for feed utility
   - Run TypeScript compiler: `npx tsc --noEmit` on `src/utils/feed.ts`
   - Fix any type errors
   - Ensure proper typing for Feed items and post data
   - **Output**: No TypeScript errors in feed utility file

### Phase 3: Create RSS Feed Route

- [x] Create RSS route file structure
  - Create new file `src/routes/feed[.]xml.ts`
  - Import `createFileRoute` from '@tanstack/react-router'
  - Import `generateFeed` function from '../utils/feed.js'
  - **Output**: New route file created with proper imports

 - [x] Implement RSS route configuration
   - Use `createFileRoute('/feed.xml')` to define route
   - Set `ssr: false` since we're returning XML, not React component
   - Add type definition for route
   - **Output**: Route configured with path and SSR disabled

- [ ] Implement GET handler for RSS route
  - Configure `server` object with `GET` handler
  - In handler, call `generateFeed()` to get Feed object
  - Get RSS XML by calling `feed.rss2()` method
  - Create Response with RSS XML string as body
  - Set `Content-Type` header to `application/rss+xml`
  - **Output**: GET handler returning valid RSS Response

- [ ] Complete RSS route export
  - Export the Route object as default
  - Ensure proper file extension and path handling
  - Verify no component function needed (XML response only)
  - **Output**: Complete RSS route ready to serve at `/feed.xml`

### Phase 4: Create Atom Feed Route

- [ ] Create Atom route file structure
  - Create new file `src/routes/atom[.]xml.ts`
  - Import `createFileRoute` from '@tanstack/react-router'
  - Import `generateFeed` function from '../utils/feed.js'
  - **Output**: New route file created with proper imports

- [ ] Implement Atom route configuration
  - Use `createFileRoute('/atom.xml')` to define route
  - Set `ssr: false` since we're returning XML, not React component
  - Add type definition for route
  - **Output**: Route configured with path and SSR disabled

- [ ] Implement GET handler for Atom route
  - Configure `server` object with `GET` handler
  - In handler, call `generateFeed()` to get Feed object
  - Get Atom XML by calling `feed.atom1()` method
  - Create Response with Atom XML string as body
  - Set `Content-Type` header to `application/atom+xml`
  - **Output**: GET handler returning valid Atom Response

- [ ] Complete Atom route export
  - Export the Route object as default
  - Ensure proper file extension and path handling
  - Verify no component function needed (XML response only)
  - **Output**: Complete Atom route ready to serve at `/atom.xml`

### Phase 5: Add Feed Discovery Links

- [ ] Read root route current configuration
  - Read `src/routes/__root.tsx`
  - Identify current `head` function structure
  - Note existing links and meta tags
  - **Output**: Understanding of current head configuration structure

- [ ] Add RSS feed discovery link to root route
  - In `head` function's `links` array, add new object:
    - `rel: 'alternate'`
    - `type: 'application/rss+xml'`
    - `href: '/feed.xml'`
    - `title: 'Leiske.dev - RSS Feed'`
  - **Output**: RSS feed discovery link added to root route head

- [ ] Add Atom feed discovery link to root route
  - In `head` function's `links` array, add new object:
    - `rel: 'alternate'`
    - `type: 'application/atom+xml'`
    - `href: '/atom.xml'`
    - `title: 'Leiske.dev - Atom Feed'`
  - **Output**: Atom feed discovery link added to root route head

- [ ] Verify feed links syntax and structure
  - Check TypeScript for any type errors in updated __root.tsx
  - Verify links array structure matches existing format
  - **Output**: Feed discovery links properly formatted with no TypeScript errors

### Phase 6: Development Testing

- [ ] Start development server
  - Stop any running dev server (Ctrl+C if running)
  - Start fresh dev server: `npm run dev`
  - Wait for server to start completely
  - **Output**: Development server running at http://localhost:3000

- [ ] Test RSS feed endpoint
  - Open browser and visit `http://localhost:3000/feed.xml`
  - Verify XML is displayed in browser
  - Check for RSS 2.0 opening tag: `<rss version="2.0">`
  - **Output**: Valid RSS XML displayed in browser

- [ ] Test Atom feed endpoint
  - Open browser and visit `http://localhost:3000/atom.xml`
  - Verify XML is displayed in browser
  - Check for Atom 1.0 opening tag: `<feed xmlns="http://www.w3.org/2005/Atom">`
  - **Output**: Valid Atom XML displayed in browser

- [ ] Verify RSS feed content
  - Inspect RSS XML content in browser
  - Verify channel title, description, link are correct
  - Check that posts appear as `<item>` elements
  - Verify post titles, links, dates are present
  - Confirm test posts are excluded
  - **Output**: RSS feed contains correct blog posts with proper metadata

- [ ] Verify Atom feed content
  - Inspect Atom XML content in browser
  - Verify feed title, description, links are correct
  - Check that posts appear as `<entry>` elements
  - Verify post titles, links, updated dates are present
  - Confirm test posts are excluded
  - **Output**: Atom feed contains correct blog posts with proper metadata

- [ ] Verify feed discovery in HTML source
  - Visit `http://localhost:3000/` (homepage)
  - Right-click and select "View Page Source"
  - Search for "feed.xml" in source (Ctrl+F)
  - Verify RSS discovery link with correct attributes present
  - Search for "atom.xml" in source
  - Verify Atom discovery link with correct attributes present
  - **Output**: Both feed discovery links found in HTML head

- [ ] Test blog page for feed discovery
  - Visit `http://localhost:3000/blog`
  - View page source
  - Verify both feed discovery links are present
  - **Output**: Feed discovery links present on blog index page

- [ ] Test individual blog post page for feed discovery
  - Visit any blog post (e.g., `http://localhost:3000/blog/test-post-1`)
  - View page source
  - Verify both feed discovery links are present
  - **Output**: Feed discovery links present on post pages

### Phase 7: Build & Production Testing

- [ ] Run TypeScript compilation check
  - Run `npx tsc -b` to compile TypeScript
  - Fix any compilation errors if present
  - **Output**: Successful TypeScript compilation with no errors

- [ ] Run ESLint check
  - Run `npm run lint` to check for linting errors
  - Fix any linting issues if present
  - **Output**: No ESLint errors or warnings

- [ ] Build production bundle
  - Run `npm run build` to create production build
  - Monitor build process for any errors
  - **Output**: Successful build completion with dist folder created

- [ ] Verify build includes feed routes
  - Check build output for feed-related files
  - Verify `dist/client` or `dist/server` contains feed route handlers
  - **Output**: Feed routes included in build output

- [ ] Test production build locally (optional)
  - Run `npm run start` to start production server
  - Visit `http://localhost:3000/feed.xml` to verify RSS works in production
  - Visit `http://localhost:3000/atom.xml` to verify Atom works in production
  - **Output**: Both feeds accessible in production mode
  - **Note**: Stop production server when done (Ctrl+C)

### Phase 8: External Validation

- [ ] Validate RSS feed with W3C Feed Validator
  - Open https://validator.w3.org/feed/
  - Enter URL: `http://localhost:3000/feed.xml` (or deploy and use production URL)
  - Click "Validate"
  - Review validation results
  - Fix any errors or warnings reported
  - **Output**: RSS feed passes W3C validation with no errors

- [ ] Validate Atom feed with W3C Feed Validator
  - Use same validator: https://validator.w3.org/feed/
  - Enter URL: `http://localhost:3000/atom.xml` (or production URL)
  - Click "Validate"
  - Review validation results
  - Fix any errors or warnings reported
  - **Output**: Atom feed passes W3C validation with no errors

- [ ] Test feed with Feedly (optional)
  - Create Feedly account or use existing one
  - Add your blog URL to Feedly
  - Verify Feedly auto-discovers the feed
  - Confirm posts appear in Feedly
  - **Output**: Feed successfully subscribed in Feedly

- [ ] Test feed with another RSS reader (optional)
  - Use another reader (e.g., Inoreader, NewsBlur, or RSS Guard)
  - Subscribe to your blog feed
  - Verify feed content displays correctly
  - **Output**: Feed works in multiple RSS readers

### Phase 9: Documentation

- [ ] Update AGENTS.md (if needed)
  - Check if AGENTS.md needs updates for feed routes
  - Add feed routes to route documentation if applicable
  - Add feed utility functions to documentation
  - **Output**: AGENTS.md updated with feed-related documentation (if changes needed)

- [ ] Create or update README with feed information
  - Add section about RSS/Atom feeds to README.md
  - Include feed URLs and usage instructions
  - Mention auto-discovery feature
  - **Output**: README.md updated with feed documentation

- [ ] Document feed utility function
  - Add JSDoc comments to `generateFeed()` function
  - Document parameters, return value, and behavior
  - Add usage examples in comments
  - **Output**: Well-documented feed utility function

### Phase 10: Deployment

- [ ] Deploy to production
  - Run `npm run deploy` to build and deploy to Cloudflare Workers
  - Monitor deployment process
  - Wait for deployment to complete
  - **Output**: Successful deployment with new feed routes live

- [ ] Verify production feed URLs
  - Visit `https://leiske.dev/feed.xml` in browser
  - Verify RSS feed loads correctly
  - Visit `https://leiske.dev/atom.xml` in browser
  - Verify Atom feed loads correctly
  - **Output**: Both feeds accessible in production

- [ ] Verify production feed discovery
  - Visit `https://leiske.dev/`
  - View page source
  - Verify feed discovery links are present
  - **Output**: Feed discovery links present in production HTML

- [ ] Test production feeds with RSS validator
  - Run W3C Feed Validator on production URLs:
    - `https://leiske.dev/feed.xml`
    - `https://leiske.dev/atom.xml`
  - Fix any issues if found
  - **Output**: Production feeds pass validation

### Phase 11: Verification & Cleanup

- [ ] Confirm zero ongoing maintenance needed
  - Test adding a new blog post
  - Re-run `npm run build`
  - Verify new post appears in feeds without code changes
  - **Output**: Feeds automatically update with new content

- [ ] Clean up development artifacts
  - Check for any temporary files created during testing
  - Remove any debug console.log statements
  - Clean up any test data
  - **Output**: Clean codebase with no temporary artifacts

- [ ] Final code review
  - Review all created/modified files
  - Ensure code follows project conventions
  - Verify TypeScript strict mode compliance
  - Check for any unused imports or variables
  - **Output**: Clean, production-ready code

- [ ] Update package.json (if needed)
  - Verify `feed` dependency is properly listed
  - Check if any scripts need updates
  - **Output**: package.json confirmed correct

- [ ] Final integration test
  - Run full integration: `npm run lint && npm run build`
  - Ensure no errors anywhere in process
  - **Output**: Clean build with zero errors

---

## Success Criteria

✅ RSS feed accessible at `https://leiske.dev/feed.xml`
✅ Atom feed accessible at `https://leiske.dev/atom.xml`
✅ Both feeds valid and pass W3C validation
✅ Feed discovery links present in HTML head
✅ Feeds auto-update when content changes
✅ No ongoing maintenance required
✅ Works with popular RSS readers (Feedly, Inoreader, etc.)
✅ TypeScript compilation succeeds
✅ ESLint passes with no errors
✅ Production deployment successful

---

## Notes

- The `[.]` syntax in route filenames (e.g., `feed[.]xml.ts`) tells TanStack Router to treat the dot as a literal character
- Feed discovery links use the `rel="alternate"` and specific MIME types for auto-discovery
- The `feed` package handles proper date formatting and XML escaping automatically
- Content-collections regeneration triggers automatic feed updates
- No caching configuration needed - server-side generation ensures fresh content
