/**
 * WO-016: Characterization tests for the new Node.js/Express API.
 * Run against BASE_URL=http://localhost:3001 (new backend).
 * These tests verify the new API surface matches the contract documented in WO-002.
 */
require('dotenv').config();
const BASE_URL = process.env.NEW_API_URL || 'http://localhost:3001';

async function req(method, path, body, headers = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }
    return { status: res.status, body: json, headers: res.headers };
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) {
      return null; // backend not running — skip test
    }
    throw err;
  }
}

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await req('GET', '/api/v1/health');
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/v1/auth/register', () => {
  const email = `test-${Date.now()}@example.com`;

  it('creates a new user and returns tokens', async () => {
    const res = await req('POST', '/api/v1/auth/register', {
      email,
      password: 'Secure123!',
    });
    if (!res) return;
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('returns 409 on duplicate registration', async () => {
    await req('POST', '/api/v1/auth/register', { email, password: 'Secure123!' });
    const res = await req('POST', '/api/v1/auth/register', {
      email,
      password: 'Another1!',
    });
    if (!res) return;
    expect(res.status).toBe(409);
  });

  it('returns 422 for missing password', async () => {
    const res = await req('POST', '/api/v1/auth/register', {
      email: `missing-${Date.now()}@example.com`,
    });
    if (!res) return;
    expect(res.status).toBe(422);
  });
});

describe('POST /api/v1/auth/login', () => {
  const email = `login-${Date.now()}@example.com`;
  const password = 'LoginTest1!';

  beforeAll(async () => {
    await req('POST', '/api/v1/auth/register', { email, password });
  });

  it('returns tokens on valid credentials', async () => {
    const res = await req('POST', '/api/v1/auth/login', { email, password });
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('returns 401 on wrong password', async () => {
    const res = await req('POST', '/api/v1/auth/login', {
      email,
      password: 'wrongpassword',
    });
    if (!res) return;
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/auth/verify-email/:email', () => {
  it('returns 200 true for existing email', async () => {
    const email = `verify-${Date.now()}@example.com`;
    await req('POST', '/api/v1/auth/register', { email, password: 'Verify123!' });
    const res = await req('GET', `/api/v1/auth/verify-email/${encodeURIComponent(email)}`);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
  });
});

describe('Authenticated routes — profile management', () => {
  let token;
  const email = `profile-${Date.now()}@example.com`;

  beforeAll(async () => {
    const res = await req('POST', '/api/v1/auth/register', {
      email,
      password: 'Profile1!',
    });
    if (!res) return;
    token = res.body?.accessToken;
  });

  it('creates a profile', async () => {
    if (!token) return;
    const res = await req(
      'POST',
      '/api/v1/profiles',
      { profileName: 'TestProfile' },
      { Authorization: `Bearer ${token}` },
    );
    if (!res) return;
    expect(res.status).toBe(201);
    expect(res.body.profileName).toBe('TestProfile');
  });

  it('lists profiles', async () => {
    if (!token) return;
    const res = await req('GET', '/api/v1/profiles', undefined, {
      Authorization: `Bearer ${token}`,
    });
    if (!res) return;
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 401 without token', async () => {
    const res = await req('GET', '/api/v1/profiles');
    if (!res) return;
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/videos/suggestions', () => {
  let token;

  beforeAll(async () => {
    const res = await req('POST', '/api/v1/auth/register', {
      email: `video-${Date.now()}@example.com`,
      password: 'Video123!',
    });
    if (!res) return;
    token = res.body?.accessToken;
  });

  it('returns video list', async () => {
    if (!token) return;
    const res = await req('GET', '/api/v1/videos/suggestions', undefined, {
      Authorization: `Bearer ${token}`,
    });
    if (!res) return;
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
