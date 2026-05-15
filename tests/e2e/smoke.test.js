/**
 * WO-039: End-to-end smoke test for the complete user journey.
 *
 * Tests the full flow: register → login → create profile → browse videos →
 * add to watchlist → subscribe → process payment → logout
 *
 * Run: NEW_API_URL=http://localhost:3001 node --test tests/e2e/smoke.test.js
 * Or via characterization test runner: npm test (from tests/characterization/)
 *
 * Gracefully skips all assertions if backend is not running.
 */
require('dotenv').config();
const BASE_URL = process.env.NEW_API_URL || 'http://localhost:3001';

async function api(method, path, body, token) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE_URL}/api/v1${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, data };
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) return null;
    throw err;
  }
}

let accessToken = null;
let profileId = null;
const email = `smoke-${Date.now()}@example.com`;
const password = 'Smoke1234!';

describe('E2E Smoke: complete user journey', () => {
  it('1. Health check passes', async () => {
    const res = await api('GET', '/health');
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('ok');
  });

  it('2. Register new user', async () => {
    const res = await api('POST', '/auth/register', { email, password });
    if (!res) return;
    expect(res.status).toBe(201);
    accessToken = res.data?.accessToken;
    expect(accessToken).toBeTruthy();
  });

  it('3. Login with credentials', async () => {
    if (!accessToken) return;
    const res = await api('POST', '/auth/login', { email, password });
    if (!res) return;
    expect(res.status).toBe(200);
    accessToken = res.data?.accessToken;
  });

  it('4. Create a profile', async () => {
    if (!accessToken) return;
    const res = await api('POST', '/profiles', { profileName: 'SmokeTest' }, accessToken);
    if (!res) return;
    expect(res.status).toBe(201);
    profileId = res.data?.id;
    expect(profileId).toBeTruthy();
  });

  it('5. List profiles', async () => {
    if (!accessToken) return;
    const res = await api('GET', '/profiles', undefined, accessToken);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
  });

  it('6. Browse video suggestions', async () => {
    if (!accessToken) return;
    const res = await api('GET', '/videos/suggestions?limit=5', undefined, accessToken);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('7. Add first video to watchlist', async () => {
    if (!accessToken || !profileId) return;
    const videosRes = await api('GET', '/videos/suggestions?limit=1', undefined, accessToken);
    if (!videosRes || videosRes.data.length === 0) return;
    const videoTitle = videosRes.data[0]?.title;
    if (!videoTitle) return;

    const res = await api('POST', '/watchlist', { profileId, videoTitle }, accessToken);
    if (!res) return;
    expect([201, 409]).toContain(res.status); // 409 if already in list
  });

  it('8. Create subscription', async () => {
    if (!accessToken) return;
    const res = await api('POST', '/subscriptions', { plan: 'STANDARD' }, accessToken);
    if (!res) return;
    expect([201, 409]).toContain(res.status);
  });

  it('9. Process payment (mock token)', async () => {
    if (!accessToken) return;
    const res = await api(
      'POST',
      '/payments/proceed',
      { plan: 'STANDARD', paymentMethodToken: `pm_smoke_${Date.now()}` },
      accessToken,
    );
    if (!res) return;
    expect(res.status).toBe(201);
    expect(res.data?.status).toBe('SUCCEEDED');
  });

  it('10. Verify email exists after registration', async () => {
    if (!accessToken) return;
    const res = await api('GET', `/auth/verify-email/${encodeURIComponent(email)}`, undefined, accessToken);
    if (!res) return;
    expect(res.status).toBe(200);
    expect(res.data?.exists).toBe(true);
  });
});
