import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Auth Service (port 3001) ──────────────────────────────────────────────
// Android emulator → 10.0.2.2 maps to machine's localhost
// iOS simulator    → use 'localhost'
// Physical device  → use your machine's local IP (e.g. 192.168.x.x)
const AUTH_BASE_URL = 'http://10.0.2.2:3001/api/v1/auth';

// ─── News Service (port 3003) ─────────────────────────────────────────────
const NEWS_BASE_URL = 'http://10.0.2.2:3003/api/v1/news';

// ─── Generic request (no auth) ────────────────────────────────────────────
async function request(method, path, body) {
  const url = `${AUTH_BASE_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data?.message || data?.error || 'Request failed');
    err.response = { status: response.status, data };
    throw err;
  }

  return { status: response.status, data };
}

// ─── News request (with JWT auth token) ──────────────────────────────────
async function newsRequest(method, path, body) {
  const url = `${NEWS_BASE_URL}${path}`;
  const token = await AsyncStorage.getItem('authToken');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data?.message || data?.error || 'Request failed');
    err.response = { status: response.status, data };
    throw err;
  }

  return { status: response.status, data };
}

// ─── Auth API ─────────────────────────────────────────────────────────────
export const API = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};

// ─── News API (authenticated) ─────────────────────────────────────────────
export const NEWS_API = {
  get:    (path)        => newsRequest('GET',    path),
  post:   (path, body)  => newsRequest('POST',   path, body),
  put:    (path, body)  => newsRequest('PUT',    path, body),
  patch:  (path, body)  => newsRequest('PATCH',  path, body),
  delete: (path)        => newsRequest('DELETE', path),
};
