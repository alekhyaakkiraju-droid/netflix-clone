import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  profileId: z.string().cuid('Invalid profile ID'),
  videoTitle: z.string().min(1, 'Video title is required').max(255),
});

export const watchlistParamsSchema = z.object({
  profileId: z.string().cuid('Invalid profile ID'),
  videoTitle: z.string().min(1).max(255).optional(),
});

export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>;
