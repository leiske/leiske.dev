import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import contentCollections from '@content-collections/vite'
import { sitemapPlugin } from '@corentints/tanstack-router-sitemap'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    contentCollections(),
    tsConfigPaths(),
    tanstackStart(),
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
        const { allPosts } = await import('./.content-collections/generated/index.js')
        const posts = allPosts.filter((post: any) => !post.test)
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
