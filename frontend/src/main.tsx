import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/app/router';

import { QueryProvider, SocketProvider, ThemeProvider } from './app/providers';
import './app/styles/index.css';
import { queryClient } from './shared/api/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <SocketProvider>
          <RouterProvider router={router} context={{ queryClient }} />
        </SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
