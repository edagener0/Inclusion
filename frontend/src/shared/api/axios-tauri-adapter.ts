import { fetch } from '@tauri-apps/plugin-http';
import { LazyStore } from '@tauri-apps/plugin-store';
import type { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type StoredAuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthResponseData = {
  access?: string;
  refresh?: string;
};

const store = new LazyStore('settings.json');
const SESSION_KEY = 'auth_session_v3';
const ACCESS_COOKIE_NAME = 'access_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getCookieValue = (cookieHeader: string | null, cookieName: string): string | null => {
  if (!cookieHeader) {
    return null;
  }

  const cookiePart = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookiePart) {
    return null;
  }

  const value = cookiePart.slice(cookieName.length + 1).trim();
  return value || null;
};

const extractTokensFromSetCookie = (
  setCookieHeader: string[] | string | null,
): StoredAuthSession | null => {
  if (!setCookieHeader) {
    return null;
  }

  const rawCookies = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_-]+=)/);

  const mergedCookieHeader = rawCookies
    .map((rawCookie) => rawCookie.split(';')[0]?.trim())
    .filter(Boolean)
    .join('; ');

  if (!mergedCookieHeader) {
    return null;
  }

  const accessToken = getCookieValue(mergedCookieHeader, ACCESS_COOKIE_NAME);
  const refreshToken = getCookieValue(mergedCookieHeader, REFRESH_COOKIE_NAME);

  if (!accessToken && !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
};

const extractTokensFromResponseData = (data: unknown): StoredAuthSession | null => {
  if (!isObject(data)) {
    return null;
  }

  const authData = data as AuthResponseData;
  const accessToken = typeof authData.access === 'string' ? authData.access : null;
  const refreshToken = typeof authData.refresh === 'string' ? authData.refresh : null;

  if (!accessToken && !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
};

const mergeSessions = (
  existingSession: StoredAuthSession | null,
  nextSession: StoredAuthSession | null,
): StoredAuthSession | null => {
  if (!existingSession && !nextSession) {
    return null;
  }

  return {
    accessToken: nextSession?.accessToken ?? existingSession?.accessToken ?? null,
    refreshToken: nextSession?.refreshToken ?? existingSession?.refreshToken ?? null,
  };
};

const buildCookieHeader = (session: StoredAuthSession | null): string | null => {
  if (!session) {
    return null;
  }

  const cookies = [
    session.accessToken ? `${ACCESS_COOKIE_NAME}=${session.accessToken}` : null,
    session.refreshToken ? `${REFRESH_COOKIE_NAME}=${session.refreshToken}` : null,
  ].filter(Boolean);

  return cookies.length > 0 ? cookies.join('; ') : null;
};

const persistSession = async (session: StoredAuthSession | null) => {
  await store.set(SESSION_KEY, session);
  await store.save();
};

export const axiosTauriAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  const baseURL = config.baseURL || '';
  const url = config.url ? new URL(config.url, baseURL).href : baseURL;
  const method = (config.method || 'GET').toUpperCase();
  const isRefreshRequest = url.includes('/auth/refresh');
  const isLogoutRequest = url.includes('/auth/logout');

  const headers = new Headers();
  const storedSession = (await store.get<StoredAuthSession | null>(SESSION_KEY)) ?? null;
  const storedCookieHeader = buildCookieHeader(storedSession);

  if (storedCookieHeader) {
    headers.set('Cookie', storedCookieHeader);
  }

  if (storedSession?.accessToken && !isRefreshRequest && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${storedSession.accessToken}`);
  }

  if (storedSession?.refreshToken && (isRefreshRequest || isLogoutRequest)) {
    headers.set('X-Refresh-Token', storedSession.refreshToken);
  }

  headers.set('X-Tauri-Client', '1');

  const rawHeaders =
    config.headers && typeof config.headers.toJSON === 'function'
      ? config.headers.toJSON()
      : config.headers;

  if (rawHeaders) {
    Object.entries(rawHeaders).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        headers.set(key, String(value));
      }
    });
  }

  let body: BodyInit | null | undefined = config.data;

  const isFormData =
    body instanceof FormData ||
    (body && Object.prototype.toString.call(body) === '[object FormData]');

  if (isFormData) {
    headers.delete('Content-Type');
    headers.delete('content-type');

    const mobileSafeFormData = new FormData();
    const originalFormData = body as FormData;

    for (const [key, value] of originalFormData.entries()) {
      if (typeof value !== 'string') {
        const buffer = await value.arrayBuffer();
        const cleanBlob = new Blob([buffer], { type: value.type });

        const fileName = value instanceof File ? value.name : 'upload';
        mobileSafeFormData.append(key, cleanBlob, fileName);
      } else {
        mobileSafeFormData.append(key, value);
      }
    }

    body = mobileSafeFormData;
  } else if (body !== undefined && body !== null) {
    if (typeof body === 'object') {
      body = JSON.stringify(body);
    }
    if (!headers.has('Content-Type') && !headers.has('content-type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  const responseText = await response.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = responseText;
  }

  const setCookiesArray = response.headers.getSetCookie ? response.headers.getSetCookie() : null;
  const setCookieRaw = response.headers.get('set-cookie') || response.headers.get('Set-Cookie');
  const tokensFromCookies = extractTokensFromSetCookie(
    setCookiesArray && setCookiesArray.length > 0 ? setCookiesArray : setCookieRaw,
  );
  const tokensFromBody = extractTokensFromResponseData(responseData);
  const nextSession = mergeSessions(
    storedSession,
    mergeSessions(tokensFromCookies, tokensFromBody),
  );

  if (response.status >= 200 && response.status < 300) {
    if (isLogoutRequest) {
      await persistSession(null);
    } else if (nextSession?.accessToken || nextSession?.refreshToken) {
      await persistSession(nextSession);
    }
  }

  const axiosResponse: AxiosResponse = {
    data: responseData,
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    config,
    request: response,
  };

  if (response.status >= 200 && response.status < 300) {
    return axiosResponse;
  }

  if (response.status === 401 && isRefreshRequest) {
    await persistSession(null);
  }

  const error = new Error(`Request failed with status code ${response.status}`) as AxiosError;
  error.name = 'AxiosError';
  error.config = config;
  error.request = response;
  error.response = axiosResponse;
  error.isAxiosError = true;
  error.status = response.status;
  throw error;
};
