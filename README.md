# Leiske.dev

A blog built with TanStack Start, featuring server-side rendering, static site generation, and comprehensive SEO support.

## Tech Stack

- **Framework**: TanStack Start 1.145.3 with TanStack Router for file-based routing
- **React**: 19.2.0
- **TypeScript**: 5.9.3 with strict mode enabled
- **Styling**: Tailwind CSS v4.1.18 with @tailwindcss/typography
- **Markdown**: Unified ecosystem (remark/rehype) for markdown processing
- **Content**: @content-collections for build-time markdown processing
- **Build Tool**: Vite (rolldown-vite 7.2.5)
- **Testing**: Vitest with @testing-library/react and happy-dom

## Development

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The development server will start on `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This builds the application to `dist/` directory with both client and server bundles.

### Start Production Server

```bash
npm run start
```

This starts the production server using the built files in `dist/server/server.js`.

### Testing

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI interface
```

### Linting

```bash
npm run lint
```

## Project Structure

```
leiske.dev/
├── posts/                          # Blog post markdown files
│   └── *.md                        # Post files with frontmatter
├── public/                         # Static assets
│   ├── robots.txt                  # Robots configuration
│   └── sitemap.xml                 # Auto-generated sitemap
├── src/
│   ├── components/                 # React components
│   │   ├── Markdown.tsx            # Markdown renderer
│   │   ├── PostContent.tsx         # Full post content
│   │   └── PostList.tsx            # Post list component
│   ├── routes/                     # TanStack Router file-based routes
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Home page (/)
│   │   ├── blog.index.tsx          # Blog index (/blog)
│   │   └── blog.$slug.tsx          # Blog post (/blog/:slug)
│   ├── styles/
│   │   └── app.css                 # Main stylesheet with Tailwind import
│   ├── types/
│   │   └── post.ts                 # Post type definitions
│   ├── utils/
│   │   └── markdown.ts             # Markdown processing utilities
│   ├── main.tsx                    # Application entry point
│   ├── router.tsx                  # Router configuration
│   └── routeTree.gen.ts            # Auto-generated route tree (gitignored)
├── content-collections.ts           # Content collections configuration
├── vite.config.ts                  # Vite configuration with TanStack Start
└── tsconfig.json                   # TypeScript configuration
```

## Content Collections

Posts are defined using `@content-collections` with the schema defined in `content-collections.ts`:

### Required Frontmatter Fields

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

### Optional Fields

- `test: true` - Excludes post from production build

## Routing

TanStack Router uses file-based routing:

- `/` - Home page with 5 recent posts
- `/blog` - Blog index with all posts
- `/blog/:slug` - Individual blog post
- `*` - 404 page (handled by root route notFoundComponent)

## SEO Features

- **Meta Tags**: Dynamic title, description, and social media tags
- **Open Graph**: og:title, og:description, og:type, og:url
- **Twitter Cards**: twitter:card, twitter:title, twitter:description
- **Structured Data**: JSON-LD Article schema for blog posts
- **Canonical URLs**: Proper canonical links for all pages
- **Sitemap**: Auto-generated sitemap.xml with all routes
- **Robots.txt**: Configured to allow crawling

## RSS/Atom Feeds

The blog provides automated RSS 2.0 and Atom 1.0 feeds that auto-regenerate when content changes.

### Feed URLs

- **RSS Feed**: `https://leiske.dev/feed.xml` (RSS 2.0)
- **Atom Feed**: `https://leiske.dev/atom.xml` (Atom 1.0)

### Features

- **Auto-update**: Feeds automatically update when new blog posts are added
- **Zero maintenance**: No manual configuration required
- **Feed discovery**: RSS readers can auto-discover feeds via HTML head links
- **Test posts excluded**: Posts marked with `test: true` are not included in feeds

### Implementation

- **Feed package**: Uses `feed` npm package for generation
- **Route handlers**: Server-side routes at `/feed.xml` and `/atom.xml`
- **Utility function**: `generateFeed()` in `src/utils/feed.ts` handles feed generation
- **Discovery links**: HTML head contains `rel="alternate"` links with proper MIME types

## Migration History

This project migrated from a custom static site generator to TanStack Start in January 2026.

### Changes Made

- Replaced custom build script with TanStack Start SSR/SSG
- Migrated from `marked` to unified ecosystem for markdown processing
- Added content-collections for build-time markdown generation
- Implemented TanStack Router file-based routing
- Added comprehensive SEO support (meta tags, Open Graph, Twitter cards, structured data)
- Upgraded to Tailwind CSS v4 with @import-based configuration
- Added automated sitemap generation

### Breaking Changes

- Build command changed from custom script to `vite build`
- Server entry point is now `dist/server/server.js`
- Route files are now in `src/routes/` instead of custom routing
- Content types now imported from `content-collections` path alias

## License

Private
