// src/api/client.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, STORAGE_KEYS, API_PATHS } from '../config/constants';

const STORAGE = {
  ACCESS: STORAGE_KEYS.ACCESS_TOKEN,
  REFRESH: STORAGE_KEYS.REFRESH_TOKEN,
};

let refreshingPromise = null; // single-flight lock

async function logoutAndThrow() {
  await AsyncStorage.multiRemove([STORAGE.ACCESS, STORAGE.REFRESH]);
  // Энэ мөрийг төслийнхөө login замд тааруул
  // Жишээ: expo-router ашиглавал: import { router } ... router.replace('/auth')
  throw new Error('UNAUTHORIZED'); // дуудаж буй тал нь хэрэгцээндээ тааруулж барина
}

async function refreshToken() {
  if (refreshingPromise) return refreshingPromise; // явж байгааг дахин ашиглах
  refreshingPromise = (async () => {
    const refresh = await AsyncStorage.getItem(STORAGE.REFRESH);
    if (!refresh) throw new Error('NO_REFRESH');

    const r = await fetch(`${BASE_URL}${API_PATHS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!r.ok) throw new Error('REFRESH_FAIL');

    const data = await r.json().catch(() => ({}));
    const access = data?.access || data?.access_token;
    if (!access) throw new Error('NO_ACCESS');

    await AsyncStorage.setItem(STORAGE.ACCESS, access);
    return access;
  })();

  try {
    return await refreshingPromise;
  } finally {
    refreshingPromise = null;
  }
}

function resolveUrl(path) {
  if (!path) return BASE_URL; // defensive
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path}`;
}

function buildHeaders(token, extraHeaders, body) {
  const headers = { ...(extraHeaders || {}) };
  // FormData үед Content-Type-ийг fetch өөрөө тогтооно
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function withTimeout(ms = 15000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

export async function api(path, opts = {}) {
  const token = await AsyncStorage.getItem(STORAGE.ACCESS);
  const url = resolveUrl(path);

  const { signal, cancel } = withTimeout(opts.timeoutMs || 15000);
  const headers = buildHeaders(token, opts.headers, opts.body);

  let res;
  try {
    res = await fetch(url, { ...opts, headers, signal });
  } catch (e) {
    cancel();
    throw new Error('NETWORK_ERROR');
  }
  cancel();

  // 401 → refresh → retry
  if (res.status === 401) {
    try {
      const newToken = await refreshToken();
      const retryHeaders = buildHeaders(newToken, opts.headers, opts.body);
      const { signal: s2, cancel: c2 } = withTimeout(opts.timeoutMs || 15000);
      res = await fetch(url, { ...opts, headers: retryHeaders, signal: s2 });
      c2();
      if (res.status === 401) await logoutAndThrow();
    } catch {
      await logoutAndThrow();
    }
  }

  return res;
}

/**
 * JSON helper: амжилтгүй response үед JSON алдааг уншаад шиднэ.
 * @returns { data, status, ok }
 */
export async function apiJson(path, opts = {}) {
  const res = await api(path, opts);
  const status = res.status;
  const ok = res.ok;

  if (status === 204) return { data: null, status, ok };

  let data = null;
  try {
    data = await res.json();
  } catch {
    // хоосон body
  }

  if (!ok) {
    const detail =
      data?.detail ||
      data?.error ||
      data?.message ||
      (typeof data === 'string' ? data : 'Request failed');
    const err = new Error(detail);
    err.status = status;
    err.payload = data;
    throw err;
  }

  return { data, status, ok };
}

/** Туслах GET/POST богино функцууд */
export const get = (path, params) => {
  const url =
    params && Object.keys(params).length
      ? `${path}?${new URLSearchParams(params).toString()}`
      : path;
  return apiJson(url, { method: 'GET' });
};

export const post = (path, body) =>
  apiJson(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    headers: body instanceof FormData ? {} : undefined,
  });

export const patch = (path, body) =>
  apiJson(path, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    headers: body instanceof FormData ? {} : undefined,
  });

export const del = (path) => apiJson(path, { method: 'DELETE' });
