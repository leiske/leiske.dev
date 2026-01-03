# Blog Feature Guide

This guide explains how to create and manage blog posts on this site.

## Overview

The blog is a static site generator built with:
- **React** for UI components
- **TypeScript** for type safety
- **Vite** for build tooling
- **Markdown** for content authoring
- **Tailwind CSS** for styling (with Typography plugin for blog content)

Blog posts are written in Markdown with YAML frontmatter, then converted to static HTML at build time.

## Creating a New Post

### 1. Create a Markdown File

Create a new `.md` file in the `posts/` directory. The filename should match the `slug` field in your frontmatter:

```bash
# Example: posts/your-post-slug.md
touch posts/your-post-slug.md
```

### 2. Add Frontmatter

Every blog post must begin with YAML frontmatter enclosed in `---` delimiters:

```yaml
---
date: 2026-01-02
title: Your Post Title
slug: your-post-slug
description: A brief description of your post content
tags:
  - tag1
  - tag2
  - tag3
---
```

### Required Frontmatter Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `date` | string | ISO date format (YYYY-MM-DD) | `2026-01-02` |
| `title` | string | Post title | `My First Blog Post` |
| `slug` | string | URL-friendly identifier (must match filename) | `my-first-blog-post` |
| `description` | string | Brief description for metadata | `An introduction to...` |
| `tags` | string[] | Array of tags for categorization | `["react", "tutorial"]` |

### 3. Write Your Content

After the frontmatter, write your post content using standard Markdown syntax:

```markdown
---
date: 2026-01-02
title: My First Blog Post
slug: my-first-blog-post
description: An introduction to blogging
tags:
  - tutorial
  - getting-started
---

# My First Blog Post

This is the introduction paragraph.

## Subsection

Here's some content with **bold** and *italic* text.

### Code Example

```javascript
console.log("Hello, world!");
```

- List item 1
- List item 2
- List item 3
```

### 4. Test Your Post

#### Development Mode

Run the development server to preview your post:

```bash
npm run dev
```

Navigate to:
- Homepage: `http://localhost:5173/`
- Your post: `http://localhost:5173/blog/your-post-slug/`

#### Production Build

Build the static site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Your post will be available at `http://localhost:4173/blog/your-post-slug/`

## How It Works

### Build Process

The build process (`npm run build`) performs these steps:

1. **TypeScript Compilation**: `tsc -b` checks for type errors
2. **Vite Build**: Bundles assets (CSS, JS) into `dist/`
3. **Static Generation**: `node dist-scripts/scripts/build-static.js` generates HTML

### Generated Files

After building, the following files are created in the `dist/` directory:

```
dist/
├── index.html                      # Homepage (shows 5 most recent posts)
├── blog/
│   ├── post-slug-1/
│   │   └── index.html             # Post page 1
│   ├── post-slug-2/
│   │   └── index.html             # Post page 2
│   └── ...
├── assets/
│   ├── index-*.css                # Stylesheets
│   └── index-*.js                 # JavaScript bundles
└── ...
```

### Blog Components

- **`PostList`** (`src/components/PostList.tsx`): Displays a list of posts with titles and dates
- **`PostContent`** (`src/components/PostContent.tsx`): Renders a single post with metadata and navigation
- **`Home`** (`src/pages/Home.tsx`): Homepage showing the 5 most recent posts
- **`BlogPost`** (`src/pages/BlogPost.tsx`): Individual post page template

### Post Utilities

- **`getAllPosts()`**: Returns all posts sorted by date (newest first)
- **`getPostBySlug(slug)`**: Loads a single post by slug
- **`calculateReadingTime(content)`**: Calculates reading time (200 words per minute)

## Post Features

### Reading Time

Reading time is automatically calculated based on word count (assuming 200 words per minute) and displayed on post pages (e.g., "3 min read").

### Tags

Tags are rendered as blue badges on post pages. Use tags to categorize your content and help readers discover related posts.

### Date Formatting

Dates are displayed in the user's locale format automatically.

### Navigation

Each post page includes:
- A "Back to home" link
- A "Next post" link when applicable (posts are ordered chronologically)

## Development Workflow

### When Working on Blog Components

If you modify components in `src/` (e.g., `PostContent.tsx`, `Home.tsx`, etc.), you must recompile the build script to use the updated components in static generation:

```bash
# Compile the build script with updated components
npx tsc scripts/build-static.ts --outDir dist-scripts --module esnext --target es2023 --moduleResolution bundler --jsx react-jsx --skipLibCheck --strict

# Then run the build
npm run build
```

### Type Checking

Run TypeScript type checking:

```bash
tsc -b
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Best Practices

1. **Use descriptive slugs**: Make them readable and SEO-friendly
2. **Write good descriptions**: These are used for metadata and previews
3. **Tag consistently**: Use existing tags when possible for better organization
4. **Test locally**: Always preview your posts before building
5. **Keep descriptions concise**: Aim for 1-2 sentences
6. **Use proper Markdown formatting**: Leverage headings, lists, and code blocks

## Troubleshooting

### Build Fails

- Check for TypeScript errors with `tsc -b`
- Verify frontmatter is properly formatted with `---` delimiters
- Ensure all required fields are present
- Check for YAML syntax errors in frontmatter

### Post Not Appearing

- Verify the filename matches the `slug` field
- Check that the `.md` file is in the `posts/` directory
- Ensure the file has valid YAML frontmatter

### Styling Issues

- Verify Tailwind Typography plugin is working
- Check that the `prose` class is applied to content containers
- Test in both development and preview modes

## File Structure

```
leiske.dev/
├── posts/                          # Blog post markdown files
│   └── *.md
├── src/
│   ├── components/
│   │   ├── PostContent.tsx         # Single post display
│   │   └── PostList.tsx            # Post list display
│   ├── lib/
│   │   └── posts.ts                # Post loading utilities
│   ├── pages/
│   │   ├── BlogPost.tsx            # Blog post page template
│   │   └── Home.tsx                # Homepage
│   └── types/
│       └── post.ts                 # Post type definitions
└── scripts/
    └── build-static.ts             # Static site generator
```

## Additional Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Frontmatter](https://jekyllrb.com/docs/front-matter/)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [Vite Documentation](https://vitejs.dev/)
