import bcrypt from 'bcryptjs';
import db from '../../lib/db';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';
import { ConflictError, UnauthorizedError } from '../../lib/errors';
import { audit } from '../../lib/audit';
import type { RegisterInput, LoginInput, RefreshInput } from './schemas';

const BCRYPT_ROUNDS = 12;

export async function register(input: RegisterInput) {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await db.user.create({
    data: { email: input.email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });

  await audit('USER_REGISTERED', user.id, { email: user.email });
  return { user, accessToken, refreshToken };
}

export async function login(input: LoginInput) {
  const user = await db.user.findUnique({ where: { email: input.email } });

  // Constant-time comparison even if user doesn't exist (prevents timing attacks)
  const dummyHash = '$2a$12$dummyhashtopreventtimingattacks000000000000000000000000';
  const passwordMatch = await bcrypt.compare(
    input.password,
    user?.passwordHash ?? dummyHash,
  );

  if (!user || !passwordMatch) {
    await audit('LOGIN_FAILED', null, { email: input.email });
    throw new UnauthorizedError('Invalid email or password');
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken({ sub: user.id, email: user.email });

  await audit('LOGIN_SUCCESS', user.id, { email: user.email });
  return {
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
  };
}

export async function refresh(input: RefreshInput) {
  const payload = verifyRefreshToken(input.refreshToken);

  const user = await db.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new UnauthorizedError('User no longer exists');
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  return { accessToken };
}

export async function verifyEmailExists(email: string): Promise<boolean> {
  const count = await db.user.count({ where: { email } });
  return count > 0;
}
