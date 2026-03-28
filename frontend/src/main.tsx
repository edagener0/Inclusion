import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { router } from '@/app/router';

import { QueryProvider } from './app/provider/QueryProvider';
import { ThemeProvider } from './app/provider/ThemeProvider';
import './app/styles/index.css';
import { queryClient } from './shared/api/';
import { CenterSpinner } from './shared/ui/spinner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              <CenterSpinner />
            </div>
          }
        >
          <RouterProvider router={router} context={{ queryClient }} />
        </Suspense>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
