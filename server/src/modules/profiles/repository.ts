import db from '../../lib/db';
import type { CreateProfileInput, UpdateProfileInput } from './schemas';
import { NotFoundError, ConflictError } from '../../lib/errors';

export async function createProfile(userId: string, input: CreateProfileInput) {
  const existing = await db.profile.findFirst({
    where: { userId, profileName: input.profileName },
  });
  if (existing) {
    throw new ConflictError(`Profile name "${input.profileName}" is already taken`);
  }

  if (input.gameHandle) {
    const gameHandleTaken = await db.profile.findUnique({
      where: { gameHandle: input.gameHandle },
    });
    if (gameHandleTaken) {
      throw new ConflictError(`Game handle "${input.gameHandle}" is already taken`);
    }
  }

  return db.profile.create({
    data: { userId, ...input },
    select: { id: true, profileName: true, avatarUrl: true, gameHandle: true, createdAt: true },
  });
}

export async function getProfilesByUser(userId: string) {
  return db.profile.findMany({
    where: { userId },
    select: { id: true, profileName: true, avatarUrl: true, gameHandle: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getProfileById(profileId: string, userId: string) {
  const profile = await db.profile.findFirst({
    where: { id: profileId, userId },
    select: { id: true, profileName: true, avatarUrl: true, gameHandle: true, createdAt: true, updatedAt: true },
  });
  if (!profile) throw new NotFoundError('Profile not found');
  return profile;
}

export async function updateProfile(
  profileId: string,
  userId: string,
  input: UpdateProfileInput,
) {
  const profile = await db.profile.findFirst({ where: { id: profileId, userId } });
  if (!profile) throw new NotFoundError('Profile not found');

  if (input.profileName && input.profileName !== profile.profileName) {
    const nameTaken = await db.profile.findFirst({
      where: { userId, profileName: input.profileName },
    });
    if (nameTaken) throw new ConflictError(`Profile name "${input.profileName}" is already taken`);
  }

  return db.profile.update({
    where: { id: profileId },
    data: input,
    select: { id: true, profileName: true, avatarUrl: true, gameHandle: true, updatedAt: true },
  });
}

export async function deleteProfile(profileId: string, userId: string) {
  const profile = await db.profile.findFirst({ where: { id: profileId, userId } });
  if (!profile) throw new NotFoundError('Profile not found');
  await db.profile.delete({ where: { id: profileId } });
}

export async function validateProfileName(userId: string, profileName: string): Promise<boolean> {
  const count = await db.profile.count({ where: { userId, profileName } });
  return count === 0;
}

export async function validateGameHandle(gameHandle: string): Promise<boolean> {
  const count = await db.profile.count({ where: { gameHandle } });
  return count === 0;
}
