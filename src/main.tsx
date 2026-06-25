import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
  routeTree,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

declare module '@tanstack/react-router' {
  interface HistoryState {
    userState?: {
      username?: string;
      roomID?: string;
    };
    sankhyaState?: {
      difficulty?: string;
      noQuestions?: number;
      mode?: string;
      roomID?: string;
    };
  }
}