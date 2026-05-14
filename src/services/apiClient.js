const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function getToken() {
  return localStorage.getItem('accessToken');
}

async function request(method, path, body, authenticated = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (authenticated) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content
  if (response.status === 204) return null;

  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `HTTP ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data;
}

export const api = {
  get: (path, authenticated = true) => request('GET', path, undefined, authenticated),
  post: (path, body, authenticated = true) => request('POST', path, body, authenticated),
  put: (path, body, authenticated = true) => request('PUT', path, body, authenticated),
  patch: (path, body, authenticated = true) => request('PATCH', path, body, authenticated),
  delete: (path, authenticated = true) => request('DELETE', path, undefined, authenticated),
};

export { ApiError };
export default api;
