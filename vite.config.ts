import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contentCollections from '@content-collections/vite'
import { sitemapPlugin } from '@corentints/tanstack-router-sitemap'
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: {
    port: 3000,
    watch: {
      ignored: ['**/.content-collections/**', '**/src/routeTree.gen.ts'],
    },
  },
  plugins: [
    contentCollections(),
    tsConfigPaths(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      prerender: {
        enabled: true,
        autoSubfolderIndex: true,
        crawlLinks: true,
      },
    }),
    tailwindcss(),
    viteReact(),
    sitemapPlugin({
      baseUrl: 'https://leiske.dev',
      outputPath: 'public/sitemap.xml',
      routeOptions: {
        '/': {
          priority: 1.0,
          changefreq: 'daily',
        },
        '/blog': {
          priority: 0.9,
          changefreq: 'weekly',
        },
      },
      manualRoutes: async () => {
        // Dynamic import from generated files - this runs at build time after content-collections generates
        const { allPosts } = await import('./.content-collections/generated/index.js')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const posts = allPosts.filter((post: any) => !post.test)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return posts.map((post: any) => ({
          location: `/blog/${post.slug}`,
          priority: 0.8,
          changeFrequency: 'weekly' as const,
          lastMod: post.date,
        }))
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
