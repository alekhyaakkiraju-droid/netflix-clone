import * as repo from './repository';
import type { CreateProfileInput, UpdateProfileInput } from './schemas';

export const createProfile = (userId: string, input: CreateProfileInput) =>
  repo.createProfile(userId, input);

export const getProfilesByUser = (userId: string) =>
  repo.getProfilesByUser(userId);

export const getProfileById = (profileId: string, userId: string) =>
  repo.getProfileById(profileId, userId);

export const updateProfile = (profileId: string, userId: string, input: UpdateProfileInput) =>
  repo.updateProfile(profileId, userId, input);

export const deleteProfile = (profileId: string, userId: string) =>
  repo.deleteProfile(profileId, userId);

export const validateProfileName = (userId: string, profileName: string) =>
  repo.validateProfileName(userId, profileName);

export const validateGameHandle = (gameHandle: string) =>
  repo.validateGameHandle(gameHandle);
