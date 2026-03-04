import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/app/router';

import { QueryProvider } from './app/provider/QueryProvider';
import './app/styles/index.css';
import { ThemeProvider } from './app/provider/ThemeProvider';
import { queryClient } from './shared/api/query-client';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <RouterProvider router={router} context={{ queryClient }} />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
