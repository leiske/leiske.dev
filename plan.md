# Test Implementation Plan

## Overview
This plan focuses on **high-value behavioral tests** that verify user-facing outcomes and critical functionality. Tests are designed to catch real bugs without becoming fragile "change detectors" that break on implementation changes.

**Testing Philosophy:**
- Test BEHAVIOR and OUTPUT, not implementation details
- Test edge cases and error handling
- Test data transformations and user outcomes
- Avoid testing internal implementation (function calls, state, etc.)
- Focus on: given inputs → expected outputs

---

## Phase 1: Test Infrastructure Setup

### Setup Vitest and Testing Libraries

- [x] Install test dependencies
  - Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom @vitest/ui`
  - Verify packages appear in `package.json` devDependencies

- [x] Create Vitest configuration
  - Create `vitest.config.ts` with:
    ```typescript
    import { defineConfig } from 'vitest/config'
    import react from '@vitejs/plugin-react'
    import path from 'path'

    export default defineConfig({
      plugins: [react()],
      test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: './src/test/setup.ts',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    })
    ```
  - This configures React support, DOM environment, and test globals

- [x] Create test setup file
  - Create `src/test/setup.ts` with:
    ```typescript
    import '@testing-library/jest-dom'
    ```
  - This extends DOM elements with jest-dom matchers

 - [x] Add test script to package.json
   - Add to `scripts` in `package.json`:
     ```json
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:run": "vitest run"
     ```

 - [x] Verify setup works
   - Create `src/test/smoke.test.ts` with:
     ```typescript
     describe('Vitest is working', () => {
       it('can run a simple test', () => {
         expect(1 + 1).toBe(2)
       })
     })
     ```
   - Run `npm run test` and verify it passes

---

## Phase 2: Blog Utilities Unit Tests (High ROI)

### Why These Tests Matter
Blog utilities (`src/lib/posts.ts`) are the core of data processing. Bugs here affect the entire site and are hard to catch visually. Tests here prevent broken deployments.

---

### Test: calculateReadingTime()

**What to Test:**
- Various word counts produce correct reading times (200 words/minute standard)
- Empty content returns 0 or minimum value
- Content with irregular spacing still counts correctly

**File to Create:** `src/lib/__tests__/posts.test.ts`

 - [x] Test standard reading time calculations
   - Create test: `calculateReadingTime('word '.repeat(200))` returns `1`
   - Create test: `calculateReadingTime('word '.repeat(400))` returns `2`
   - Create test: `calculateReadingTime('word '.repeat(201))` returns `2` (rounds up)
   - Explanation: Verifies the 200 words/minute standard and ceiling behavior

 - [x] Test edge cases for reading time
   - Create test: `calculateReadingTime('')` returns `0` or `1` (minimum)
   - Create test: `calculateReadingTime('one')` returns `1`
   - Create test: `calculateReadingTime('word\nword\tword')` returns `1` (handles whitespace)
   - Explanation: Ensures function handles empty/short content and various whitespace

---

### Test: getPostBySlug()

**What to Test:**
- Returns null for non-existent files (ENOENT handling)
- Returns null for markdown parse errors
- Returns correct Post object with all fields populated
- Handles missing frontmatter fields with defaults and logs warnings

**File:** Continue in `src/lib/__tests__/posts.test.ts`

 - [x] Test missing post returns null
   - Create test: `getPostBySlug('non-existent-post')` returns `null`
   - Use `vi.spyOn(console, 'warn').mockImplementation(() => {})` to suppress expected errors
   - Explanation: Verifies graceful handling when post file doesn't exist

- [x] Test valid post parsing
  - Create a temporary test post in `posts/__tests__/valid-post.md` with complete frontmatter
  - Test that `getPostBySlug('valid-post')` returns object with:
    - `slug` matches the input slug
    - `title` from frontmatter
    - `date` from frontmatter
    - `description` from frontmatter
    - `tags` array from frontmatter
    - `content` is HTML (not markdown)
    - `readingTime` is a number > 0
  - Clean up test file after test
  - Explanation: Verifies end-to-end parsing from markdown to Post object

 - [x] Test markdown to HTML conversion
   - Create test post with markdown: `# Header\n\nParagraph with **bold** text`
   - Verify returned `content` contains `<h1>Header</h1>` and `<strong>bold</strong>`
   - Explanation: Ensures markdown is properly converted to HTML for rendering

 - [x] Test missing optional frontmatter fields
   - Create test post with no `tags` field
   - Verify `tags` defaults to empty array `[]`
   - Create test post with no `test` field
   - Verify `test` defaults to `false`
   - Explanation: Tests default value behavior for optional fields

 - [x] Test required field warnings
   - Create test post missing `title` field
   - Verify `title` defaults to `''` and console.warn was called
   - Create test post missing `date` field
   - Verify `date` defaults to `''` and console.warn was called
   - Create test post missing `description` field
   - Verify `description` defaults to `''` and console.warn was called
   - Use `vi.spyOn(console, 'warn')` to verify warnings are logged
   - Explanation: Ensures missing required fields are handled and warnings are logged

- [x] Test markdown parse error handling
  - Create test post that causes marked() to throw an error (malformed markdown)
  - Verify function returns `null` and console.error was called
  - Explanation: Tests that markdown parse errors don't crash the build

---

### Test: getAllPosts()

**What to Test:**
- Returns posts sorted by date (newest first)
- Excludes posts with `test: true` frontmatter
- Returns empty array when no posts exist
- Filters out null results from failed parses

**File:** Continue in `src/lib/__tests__/posts.test.ts`

- [x] Test posts sorted by date (newest first)
   - Create temporary test posts:
     - `posts/__tests__/old-post.md` with `date: 2025-01-01`
     - `posts/__tests__/new-post.md` with `date: 2027-01-01`
   - Verify `getAllPosts()[0].slug` is `new-post` (newest first)
   - Clean up test files after test
   - Explanation: Ensures chronological ordering for post listings

 - [x] Test posts with test flag are excluded
   - Create temporary test posts:
     - `posts/__tests__/production-post.md` with `test: false` or no test field
     - `posts/__tests__/test-post.md` with `test: true`
   - Verify `getAllPosts()` includes only `production-post`
   - Clean up test files after test
   - Explanation: Verifies test posts don't appear in production builds

- [ ] Test empty posts directory
  - Create test that temporarily removes all posts from `posts/` directory
  - Verify `getAllPosts()` returns empty array `[]`
  - Restore posts after test
  - Explanation: Ensures function handles empty directory gracefully

- [ ] Test filtering null results
  - Create test that mocks `getPostBySlug` to return `null` for some slugs
  - Verify `getAllPosts()` excludes null results
  - Explanation: Tests robustness against failed post parses

---

## Phase 3: Build Integration Tests (Critical)

### Why These Tests Matter
The build script (`scripts/build-static.ts`) generates all production HTML. If this fails, the entire deployment is broken. Integration tests catch these issues before deployment.

---

### Test: Build Generates All Expected Files

**What to Test:**
- Build creates `dist/index.html` (homepage)
- Build creates `dist/blog/{slug}/index.html` for each non-test post
- Build creates `dist/404.html`
- Build excludes test posts from output

**File to Create:** `scripts/__tests__/build-static.test.ts`

- [ ] Test build creates homepage
  - Run build process (execute build script or call main function)
  - Verify `dist/index.html` exists using `fs.existsSync`
  - Verify file contains valid HTML structure (`<!doctype html>`, `<html>`, `<body>`)
  - Explanation: Ensures homepage is generated for site root

- [ ] Test build creates blog post pages
  - Run build process
  - For each non-test post in `posts/`, verify `dist/blog/{slug}/index.html` exists
  - Example: If posts/ has `hello-world.md`, verify `dist/blog/hello-world/index.html` exists
  - Explanation: Ensures all production posts have static pages generated

- [ ] Test build excludes test posts
  - Add test post with `test: true` frontmatter to `posts/`
  - Run build process
  - Verify no directory/page exists for test post in `dist/blog/`
  - Clean up test post after test
  - Explanation: Verifies test flag prevents page generation

- [ ] Test build creates 404 page
  - Run build process
  - Verify `dist/404.html` exists
  - Verify file contains valid HTML structure
  - Explanation: Ensures custom 404 page is generated

---

### Test: Build HTML Structure

**What to Test:**
- Generated HTML has proper DOCTYPE
- Generated HTML includes CSS link to `/assets/style.css`
- Generated HTML has valid `<head>` with meta tags
- Generated HTML wraps component output in `<body>`

**File:** Continue in `scripts/__tests__/build-static.test.ts`

- [ ] Test HTML shell structure
  - Read `dist/index.html` content
  - Verify file contains `<!doctype html>` (case-insensitive)
  - Verify file contains `<html lang="en">`
  - Verify file contains `<meta charset="UTF-8">`
  - Verify file contains `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - Verify file contains `<link href="/assets/style.css" rel="stylesheet">`
  - Explanation: Ensures HTML template includes all required meta tags and assets

- [ ] Test homepage contains expected content
  - Read `dist/index.html` content
  - Verify page contains "Recent Posts" heading (or whatever Home component renders)
  - Verify page contains links to blog posts (`/blog/{slug}/`)
  - Explanation: Verifies homepage component rendered correctly

- [ ] Test blog post pages contain expected content
  - Pick a sample blog post, read its generated HTML
  - Verify page contains the post title (from frontmatter)
  - Verify page contains the post content (from markdown body)
  - Verify page contains reading time display
  - Verify page contains tags display
  - Explanation: Ensures blog post component renders full post data

---

### Test: Build Error Handling

**What to Test:**
- Build fails gracefully when posts directory is missing
- Build fails gracefully with clear error messages
- Build process exits with non-zero code on failure

**File:** Continue in `scripts/__tests__/build-static.test.ts`

- [ ] Test build handles missing posts directory
  - Temporarily rename `posts/` directory
  - Run build process
  - Verify build throws an error or exits with non-zero code
  - Restore `posts/` directory
  - Explanation: Ensures build fails clearly when posts are missing

- [ ] Test build handles corrupted post files
  - Create a post file with invalid YAML frontmatter (unclosed delimiters)
  - Run build process
  - Verify build completes or logs error for that specific post
  - Clean up corrupted post after test
  - Explanation: Tests robustness against malformed post files

---

## Phase 4: Component Rendering Tests (Medium ROI)

### Why These Tests Matter
Component tests verify UI renders correctly with various data inputs. These are less critical than build tests because visual issues are easier to catch in development, but they provide confidence in UI behavior.

---

### Test: PostList Component

**What to Test:**
- Renders list of post titles and dates
- Links to correct blog post URLs
- Shows "No posts available" when empty

**File to Create:** `src/components/__tests__/PostList.test.tsx`

- [ ] Test renders posts with titles and dates
  - Mock post data: `[{ slug: 'post-1', title: 'Post 1', date: '2026-01-01' }]`
  - Render `<PostList posts={mockPosts} />`
  - Verify page contains text "Post 1"
  - Verify page contains a link to `/blog/post-1/`
  - Verify page displays a formatted date
  - Explanation: Ensures component renders post list with correct links

- [ ] Test shows message when empty
  - Render `<PostList posts={[]} />`
  - Verify page contains text "No posts available"
  - Explanation: Ensures empty state is handled gracefully

---

### Test: BlogPost Component

**What to Test:**
- Renders "Post not found" for invalid slug
- Displays post content when slug is valid
- Shows "Next post" link when there is a newer post

**File to Create:** `src/pages/__tests__/BlogPost.test.tsx`

- [ ] Test renders not found for invalid slug
  - Mock `getPostBySlug` to return `null`
  - Render `<BlogPost slug="invalid-post" />`
  - Verify page contains "Post not found" heading
  - Verify page contains "← Back to home" link
  - Explanation: Ensures component handles missing posts gracefully

- [ ] Test renders post content for valid slug
  - Mock post data with title, content, date, tags, readingTime
  - Mock `getPostBySlug` to return the post
  - Render `<BlogPost slug="valid-post" />`
  - Verify page contains post title
  - Verify page displays reading time
  - Verify page displays tags
  - Explanation: Ensures component renders post metadata correctly

- [ ] Test shows next post link when applicable
  - Mock `getPostBySlug` to return current post
  - Mock `getAllPosts` to return posts where a newer post exists
  - Render `<BlogPost slug="current-post" />`
  - Verify page contains "Next post:" text
  - Verify page contains link to next post
  - Explanation: Ensures navigation to next post works

---

### Test: PostContent Component

**What to Test:**
- Displays post metadata (date, reading time, tags)
- Renders HTML content from post.body
- Shows back to home link
- Renders tags as styled badges

**File to Create:** `src/components/__tests__/PostContent.test.tsx`

- [ ] Test displays post metadata
  - Mock post with date: '2026-01-01', readingTime: 5, tags: ['react', 'testing']
  - Render `<PostContent post={mockPost} nextPost={null} />`
  - Verify page displays a formatted date
  - Verify page displays "5 min read" (or similar)
  - Verify page displays tags "react" and "testing"
  - Explanation: Ensures component renders all post metadata fields

- [ ] Test renders HTML content
  - Mock post with `content: '<h1>Hello</h1><p>World</p>'`
  - Render `<PostContent post={mockPost} nextPost={null} />`
  - Verify page contains `<h1>Hello</h1>`
  - Verify page contains `<p>World</p>`
  - Explanation: Ensures HTML content is rendered via dangerouslySetInnerHTML

- [ ] Test shows back to home link
  - Render `<PostContent post={mockPost} nextPost={null} />`
  - Verify page contains "← Back to home" text
  - Verify link href is `/`
  - Explanation: Ensures navigation back to homepage

---

### Test: Home Component

**What to Test:**
- Renders first 5 posts (slice behavior)
- Displays "Recent Posts" heading
- Links to PostList component

**File to Create:** `src/pages/__tests__/Home.test.tsx`

- [ ] Test renders recent posts heading
  - Mock `getAllPosts` to return array of posts
  - Render `<Home />`
  - Verify page contains "Recent Posts" heading
  - Explanation: Ensures component displays page title

- [ ] Test renders first 5 posts
  - Mock `getAllPosts` to return array of 10 posts
  - Render `<Home />`
  - Verify PostList component is rendered
  - Verify only 5 posts are passed to PostList (use toHaveBeenCalledWith mock)
  - Explanation: Ensures component limits to recent 5 posts

---

## Phase 5: Frontmatter Validation (Lower Priority)

### Why These Tests Matter
TypeScript catches type errors, but runtime validation catches data errors in markdown files. These tests are lower priority because they're caught quickly in development, but provide safety against data regressions.

---

**File to Create:** `src/lib/__tests__/frontmatter.test.ts`

- [ ] Test date format validation
  - Create test posts with various date formats:
    - `2026-01-01` (valid)
    - `01/01/2026` (invalid)
    - `January 1, 2026` (invalid)
  - Verify only valid format is accepted
  - Explanation: Ensures consistent date format across posts

- [ ] Test tags field validation
  - Create test post with `tags: "single-tag"` (string instead of array)
  - Verify function handles this gracefully (converts to array or logs warning)
  - Explanation: Tests robustness against malformed tags

- [ ] Test required fields presence
  - Create test post missing `title` field
  - Verify function logs warning and provides default
  - Create test post missing `date` field
  - Verify function logs warning and provides default
  - Explanation: Ensures required fields are validated

---

## Implementation Notes

### Test Organization
- Keep tests co-located with source: `src/lib/__tests__/` for `src/lib/`
- Use descriptive test names that describe the behavior, not the implementation
- Use `describe` blocks to group related tests
- Use `it` or `test` for individual test cases

### Test Isolation
- Each test should be independent and runnable in isolation
- Clean up temporary files and mocks in `afterEach` hooks
- Use `beforeEach` to reset state between tests

### Avoiding Change Detectors
- **DO** test: "When user visits /, they see the 5 most recent posts"
- **DON'T** test: "getAllPosts is called exactly once"
- **DO** test: "Post content is rendered as HTML"
- **DON'T** test: "dangerouslySetInnerHTML is called with content"

### Running Tests
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface

---

## Completion Criteria

Phase is complete when:
- [ ] All tests in the phase pass (`npm run test:run`)
- [ ] `npm run lint` passes (no new lint errors)
- [ ] `npm run build` succeeds (tests don't break build)
- [ ] Code review completed

---

## Recommended Implementation Order

1. **Phase 1**: Setup test infrastructure (1-2 hours)
2. **Phase 2**: Blog utilities tests (2-3 hours) ← START HERE (highest ROI)
3. **Phase 3**: Build integration tests (2-3 hours) ← CRITICAL
4. **Phase 4**: Component rendering tests (1-2 hours)
5. **Phase 5**: Frontmatter validation tests (optional, 1 hour)

**Total Estimated Time**: 8-12 hours for comprehensive test suite

---

## Notes for New Engineers

- Read the existing codebase before writing tests to understand the system
- Focus on the behavior tests (Phase 2-3) first for maximum impact
- Don't strive for 100% coverage - aim for high-value tests that catch real bugs
- Use the provided test examples as templates for your own tests
- Ask questions if unsure about what to test - testing is a skill that improves with practice
