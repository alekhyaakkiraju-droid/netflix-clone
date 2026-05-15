import { describe, it, expect, beforeAll } from '@jest/globals';
import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';
import { UnauthorizedError } from '../../lib/errors';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-key';
  process.env.JWT_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
});

describe('JWT utilities', () => {
  it('signAccessToken + verifyAccessToken round-trip', () => {
    const token = signAccessToken({ sub: 'user-1', email: 'test@example.com' });
    expect(typeof token).toBe('string');
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('test@example.com');
  });

  it('signRefreshToken + verifyRefreshToken round-trip', () => {
    const token = signRefreshToken({ sub: 'user-2', email: 'refresh@example.com' });
    const payload = verifyRefreshToken(token);
    expect(payload.sub).toBe('user-2');
  });

  it('verifyAccessToken throws UnauthorizedError on tampered token', () => {
    const token = signAccessToken({ sub: 'user-1', email: 'test@example.com' });
    const tampered = token.slice(0, -5) + 'XXXXX';
    expect(() => verifyAccessToken(tampered)).toThrow(UnauthorizedError);
  });

  it('verifyRefreshToken throws UnauthorizedError on wrong secret', () => {
    // Sign with access token secret but verify as refresh — should fail
    const accessToken = signAccessToken({ sub: 'user-1', email: 'test@example.com' });
    expect(() => verifyRefreshToken(accessToken)).toThrow(UnauthorizedError);
  });
});
