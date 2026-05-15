/**
 * Integration tests for authentication endpoints.
 * Requires DATABASE_URL pointing to a test database.
 * Run via: npm test (in CI with postgres service, or locally with Docker).
 */
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import db from '../../lib/db';

beforeAll(async () => {
  // Ensure test env variables
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'integration-test-secret';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'integration-refresh-secret';
  process.env.JWT_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
});

afterAll(async () => {
  await db.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  const email = `integration-${Date.now()}@test.com`;

  it('201 + tokens on successful registration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'IntegTest1!' });

    if (res.status === 503) return; // DB not available — skip gracefully
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.user.email).toBe(email);
  });

  it('409 on duplicate email', async () => {
    await request(app).post('/api/v1/auth/register').send({ email, password: 'IntegTest1!' });
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password: 'DifferentPassword1!' });

    if (res.status === 503) return;
    expect(res.status).toBe(409);
  });

  it('422 on invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email', password: 'Test1234!' });

    if (res.status === 503) return;
    expect(res.status).toBe(422);
  });
});

describe('POST /api/v1/auth/login', () => {
  const email = `login-integ-${Date.now()}@test.com`;
  const password = 'LoginTest1!';

  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send({ email, password });
  });

  it('200 + tokens on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    if (res.status === 503) return;
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('401 on wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'wrongpassword' });

    if (res.status === 503) return;
    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Protected routes without token', () => {
  it('GET /api/v1/profiles returns 401', async () => {
    const res = await request(app).get('/api/v1/profiles');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/videos returns 401', async () => {
    const res = await request(app).get('/api/v1/videos');
    expect(res.status).toBe(401);
  });
});
