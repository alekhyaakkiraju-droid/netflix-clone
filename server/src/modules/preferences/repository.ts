import db from '../../lib/db';
import { ConflictError, NotFoundError } from '../../lib/errors';

export async function addToWatchlist(profileId: string, videoTitle: string) {
  const existing = await db.watchlist.findUnique({
    where: { profileId_videoTitle: { profileId, videoTitle } },
  });
  if (existing) {
    throw new ConflictError(`"${videoTitle}" is already in this profile's list`);
  }
  return db.watchlist.create({
    data: { profileId, videoTitle },
    select: { id: true, videoTitle: true, addedAt: true },
  });
}

export async function getWatchlist(profileId: string) {
  return db.watchlist.findMany({
    where: { profileId },
    select: { id: true, videoTitle: true, addedAt: true },
    orderBy: { addedAt: 'desc' },
  });
}

export async function removeFromWatchlist(profileId: string, videoTitle: string) {
  const item = await db.watchlist.findUnique({
    where: { profileId_videoTitle: { profileId, videoTitle } },
  });
  if (!item) throw new NotFoundError(`"${videoTitle}" is not in this profile's list`);
  await db.watchlist.delete({
    where: { profileId_videoTitle: { profileId, videoTitle } },
  });
}

export async function removeAllByProfile(profileId: string) {
  await db.watchlist.deleteMany({ where: { profileId } });
}

export async function isInWatchlist(profileId: string, videoTitle: string): Promise<boolean> {
  const count = await db.watchlist.count({
    where: { profileId_videoTitle: { profileId, videoTitle } },
  });
  return count > 0;
}
