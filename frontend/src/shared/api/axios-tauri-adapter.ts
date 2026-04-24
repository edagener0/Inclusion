import { fetch } from '@tauri-apps/plugin-http';
import { LazyStore } from '@tauri-apps/plugin-store';
import type { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// MADE BY AI
const store = new LazyStore('settings.json');
const COOKIE_KEY = 'auth_session_v2';

const parseAndMergeCookies = (
  setCookieHeader: string[] | string | null,
  existingCookies: string | null,
): string => {
  const map = new Map<string, string>();

  if (existingCookies) {
    existingCookies.split(';').forEach((pair) => {
      const [k, v] = pair.split('=');
      if (k && v) map.set(k.trim(), v.trim());
    });
  }

  if (setCookieHeader) {
    let rawCookies: string[] = [];
    if (Array.isArray(setCookieHeader)) {
      rawCookies = setCookieHeader;
    } else {
      rawCookies = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_-]+=)/);
    }

    rawCookies.forEach((raw) => {
      const mainPart = raw.split(';')[0];
      const [k, v] = mainPart.split('=');
      if (k && v) map.set(k.trim(), v.trim());
    });
  }

  return Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
};

export const axiosTauriAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> => {
  const baseURL = config.baseURL || '';
  const url = config.url ? new URL(config.url, baseURL).href : baseURL;

  const headers = new Headers();

  const savedCookies = (await store.get<string>(COOKIE_KEY)) || null;

  if (savedCookies) {
    headers.set('Cookie', savedCookies);
  }

  const rawHeaders =
    config.headers && typeof config.headers.toJSON === 'function'
      ? config.headers.toJSON()
      : config.headers;

  if (rawHeaders) {
    Object.entries(rawHeaders).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        headers.append(key, String(value));
      }
    });
  }

  let body: BodyInit | null | undefined = config.data;

  if (body instanceof FormData) {
    headers.delete('Content-Type');
    headers.delete('content-type');
  } else if (body !== undefined && body !== null) {
    if (typeof body === 'object') {
      body = JSON.stringify(body);
    }
    if (!headers.has('Content-Type') && !headers.has('content-type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    method: (config.method || 'GET').toUpperCase(),
    headers,
    body: body,
  });

  const setCookiesArray = response.headers.getSetCookie ? response.headers.getSetCookie() : null;
  const setCookieRaw = response.headers.get('set-cookie') || response.headers.get('Set-Cookie');
  const headerToParse =
    setCookiesArray && setCookiesArray.length > 0 ? setCookiesArray : setCookieRaw;

  if (headerToParse) {
    const newCookieString = parseAndMergeCookies(headerToParse, savedCookies);
    if (newCookieString && newCookieString !== savedCookies) {
      await store.set(COOKIE_KEY, newCookieString);
      await store.save();
    }
  }

  const responseText = await response.text();
  let responseData: unknown;
  try {
    responseData = JSON.parse(responseText);
  } catch {
    responseData = responseText;
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
  } else {
    const error = new Error(`Request failed with status code ${response.status}`) as AxiosError;
    error.name = 'AxiosError';
    error.config = config;
    error.request = response;
    error.response = axiosResponse;
    error.isAxiosError = true;
    error.status = response.status;
    throw error;
  }
};
