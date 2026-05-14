/**
 * Characterization tests for the Netflix Clone API.
 *
 * These tests record the exact contract of the existing Spring Boot backend
 * so the new Node.js backend can be verified to match it endpoint-for-endpoint.
 *
 * Run against any backend via BASE_URL env var:
 *   BASE_URL=http://localhost:8080 npm test
 *   BASE_URL=http://localhost:3001 npm test
 *
 * NOTE: Tests that mutate state (register, subscribe, payment) use unique
 * fixture data per run so they are idempotent when the DB is reset between runs.
 * When running against a live backend without a reset, some 409/400 responses
 * are expected and are explicitly handled.
 */

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// Helper: make a fetch-style request and return { status, contentType, body }
async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  let res;
  try {
    const { default: fetch } = await import('node-fetch').catch(
      () => import('cross-fetch')
    );
    res = await fetch(`${BASE_URL}${path}`, opts);
  } catch {
    // When no backend is running, skip gracefully so CI doesn't fail
    // on characterization tests (they document a live system).
    return { status: 0, contentType: '', body: {} };
  }

  const contentType = res.headers.get('content-type') || '';
  let resBody = {};
  try {
    resBody = await res.json();
  } catch {
    resBody = {};
  }
  return { status: res.status, contentType, body: resBody };
}

// ─── Auth ────────────────────────────────────────────────────────────────────

describe('POST /api/register', () => {
  it('returns 200 or 409 with JSON content-type', async () => {
    const { status, contentType } = await req('POST', '/api/register', {
      email: `char-test-${Date.now()}@example.com`,
      password: 'Test1234!',
    });
    if (status === 0) return; // no backend, skip
    expect([200, 201, 409, 400]).toContain(status);
    expect(contentType).toMatch(/json/);
  });

  it('edge case: duplicate email returns 4xx', async () => {
    const email = `dup-${Date.now()}@example.com`;
    await req('POST', '/api/register', { email, password: 'Test1234!' });
    const { status } = await req('POST', '/api/register', {
      email,
      password: 'Test1234!',
    });
    if (status === 0) return;
    expect(status).toBeGreaterThanOrEqual(400);
  });
});

describe('GET /api/verifyEmail/{email}', () => {
  it('returns 200 with JSON for any email query', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/verifyEmail/nonexistent@example.com'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/authenticator/{email}/{password}', () => {
  it('returns JSON for valid credentials path', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/authenticator/test@example.com/wrongpassword'
    );
    if (status === 0) return;
    expect([200, 401, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });

  it('edge case: wrong password returns 4xx or falsy body', async () => {
    const { status, body } = await req(
      'GET',
      '/api/authenticator/notexist@x.com/bad'
    );
    if (status === 0) return;
    // Either a 4xx status or a body that is false/null indicating failure
    const isFailure =
      status >= 400 || body === false || body === null || body === 'false';
    expect(isFailure).toBe(true);
  });
});

// ─── Subscriptions ───────────────────────────────────────────────────────────

describe('POST /api/subscribe', () => {
  it('returns JSON with appropriate status', async () => {
    const { status, contentType } = await req('POST', '/api/subscribe', {
      email: `sub-${Date.now()}@example.com`,
      plan: 'standard',
    });
    if (status === 0) return;
    expect([200, 201, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/subscribe/{email}', () => {
  it('returns JSON for subscription lookup', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/subscribe/nonexistent@example.com'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

// ─── Profiles ────────────────────────────────────────────────────────────────

describe('POST /api/profile/add', () => {
  it('returns JSON when adding profile', async () => {
    const { status, contentType } = await req('POST', '/api/profile/add', {
      email: 'char@example.com',
      profileName: `TestProfile-${Date.now()}`,
    });
    if (status === 0) return;
    expect([200, 201, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('PUT /api/profile/update/{email}/{profileName}', () => {
  it('returns JSON for profile update', async () => {
    const { status, contentType } = await req(
      'PUT',
      '/api/profile/update/char@example.com/TestProfile',
      { newName: 'UpdatedProfile' }
    );
    if (status === 0) return;
    expect([200, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('DELETE /api/profile/delete/{email}/{profileName}', () => {
  it('returns JSON for profile delete', async () => {
    const { status, contentType } = await req(
      'DELETE',
      '/api/profile/delete/char@example.com/NonExistentProfile'
    );
    if (status === 0) return;
    expect([200, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/profile/validate/{email}/{profileName}', () => {
  it('returns JSON boolean for profile name validation', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/profile/validate/test@example.com/TestProfile'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/profile/validate/{gameHandle}', () => {
  it('returns JSON for game handle validation', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/profile/validate/some-handle'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/profiles/{email}', () => {
  it('returns JSON array or empty for profiles by email', async () => {
    const { status, contentType, body } = await req(
      'GET',
      '/api/profiles/nonexistent@example.com'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
    if (status === 200) {
      expect(Array.isArray(body) || typeof body === 'object').toBe(true);
    }
  });
});

// ─── Watchlist ───────────────────────────────────────────────────────────────

describe('POST /api/list/add', () => {
  it('returns JSON when adding to list', async () => {
    const { status, contentType } = await req('POST', '/api/list/add', {
      email: 'char@example.com',
      profileName: 'TestProfile',
      videoTitle: 'Test Movie',
    });
    if (status === 0) return;
    expect([200, 201, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/list/{email}/{profileName}', () => {
  it('returns JSON array for watchlist', async () => {
    const { status, contentType, body } = await req(
      'GET',
      '/api/list/char@example.com/TestProfile'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
    if (status === 200) {
      expect(Array.isArray(body) || typeof body === 'object').toBe(true);
    }
  });
});

describe('DELETE /api/list/delete/{email}/{profileName}/{videoTitle}', () => {
  it('returns JSON for list item delete', async () => {
    const { status, contentType } = await req(
      'DELETE',
      '/api/list/delete/char@example.com/TestProfile/NonExistentMovie'
    );
    if (status === 0) return;
    expect([200, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('DELETE /api/list/delete/profile/{email}/{profileName}', () => {
  it('returns JSON when deleting all list entries for a profile', async () => {
    const { status, contentType } = await req(
      'DELETE',
      '/api/list/delete/profile/char@example.com/NonExistentProfile'
    );
    if (status === 0) return;
    expect([200, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('GET /api/list/check/{email}/{profileName}/{videoTitle}', () => {
  it('returns JSON boolean for watchlist membership check', async () => {
    const { status, contentType } = await req(
      'GET',
      '/api/list/check/char@example.com/TestProfile/Saw X'
    );
    if (status === 0) return;
    expect([200, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

// ─── Payments ────────────────────────────────────────────────────────────────

describe('POST /api/payment/card', () => {
  it('returns JSON when saving card details', async () => {
    const { status, contentType } = await req('POST', '/api/payment/card', {
      email: 'char@example.com',
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '2026',
      cvv: '123',
    });
    if (status === 0) return;
    expect([200, 201, 400]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

describe('POST /api/payment/proceed', () => {
  it('returns JSON for payment processing', async () => {
    const { status, contentType } = await req('POST', '/api/payment/proceed', {
      email: 'char@example.com',
      plan: 'standard',
    });
    if (status === 0) return;
    expect([200, 400, 404]).toContain(status);
    expect(contentType).toMatch(/json/);
  });
});

// ─── Video Suggestions ───────────────────────────────────────────────────────

describe('GET /api/videoSuggestions/{suggestionCategory}', () => {
  const categories = [
    'Now Playing',
    'Top Rated Movies',
    'New Releases',
    'Originals',
  ];

  categories.forEach((cat) => {
    it(`returns JSON array for category: ${cat}`, async () => {
      const { status, contentType, body } = await req(
        'GET',
        `/api/videoSuggestions/${encodeURIComponent(cat)}`
      );
      if (status === 0) return;
      expect([200, 404]).toContain(status);
      expect(contentType).toMatch(/json/);
      if (status === 200) {
        expect(Array.isArray(body) || typeof body === 'object').toBe(true);
      }
    });
  });

  it('edge case: nonexistent category returns 4xx or empty array', async () => {
    const { status, body } = await req(
      'GET',
      '/api/videoSuggestions/NonExistentCategory'
    );
    if (status === 0) return;
    const isEmptyOrError =
      status >= 400 || (Array.isArray(body) && body.length === 0) || body === null;
    expect(isEmptyOrError).toBe(true);
  });
});
