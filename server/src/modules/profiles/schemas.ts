import { z } from 'zod';

export const createProfileSchema = z.object({
  profileName: z
    .string()
    .min(1, 'Profile name is required')
    .max(50, 'Profile name too long')
    .regex(/^[a-zA-Z0-9 _-]+$/, 'Profile name contains invalid characters'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  gameHandle: z
    .string()
    .min(3, 'Game handle must be at least 3 characters')
    .max(30, 'Game handle too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Game handle can only contain letters, numbers, underscores, and hyphens')
    .optional(),
});

export const updateProfileSchema = z.object({
  profileName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9 _-]+$/)
    .optional(),
  avatarUrl: z.string().url().optional(),
  gameHandle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
});

export const profileParamsSchema = z.object({
  profileId: z.string().cuid('Invalid profile ID'),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
