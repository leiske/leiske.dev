import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

if (import.meta.hot) {
  import.meta.hot.accept(['.content-collections/generated/index.js', '.content-collections/generated/allPosts.js'], async () => {
    console.log('[HMR] Content-collections updated, reloading routes...')
    await router.invalidate()
    console.log('[HMR] Routes reloaded')
  })
}
