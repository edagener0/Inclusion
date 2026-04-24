import { fetch } from '@tauri-apps/plugin-http';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL, IS_AUTH_MARKER } from '@/shared/config';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  adapter: 'fetch',
  fetchOptions: { fetch },
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<void> | null = null;

const clearAuth = () => {
  refreshPromise = null;
};

// This interceptor implements a "Silent Refresh" strategy: when a request fails with a 401 Unauthorized error,
// it traps the failure and initiates a single refresh token request. By storing the `refreshPromise`,
// it ensures that multiple simultaneous failing requests wait for the same refresh process instead of triggering redundant API calls.
// If the refresh succeeds, the original requests are automatically retried; if it fails,
// it clears the authentication marker from `localStorage` to signal the router to redirect the user to the login page.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthRequest = originalRequest.url?.includes('/auth/sign-in');

    if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
            } catch (refreshError) {
              clearAuth();
              localStorage.removeItem(IS_AUTH_MARKER);
              throw refreshError;
            } finally {
              refreshPromise = null;
            }
          })();
        }

        await refreshPromise;

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
