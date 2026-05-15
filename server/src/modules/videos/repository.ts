import db from '../../lib/db';

export async function getAllVideos(query?: string) {
  return db.videoMetadata.findMany({
    where: query
      ? {
          OR: [
            { videoTitle: { contains: query, mode: 'insensitive' } },
            { videoCategory: { contains: query, mode: 'insensitive' } },
            { suggestionCategory: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { videoTitle: 'asc' },
  });
}

export async function getVideoByTitle(title: string) {
  return db.videoMetadata.findFirst({
    where: { videoTitle: { equals: title, mode: 'insensitive' } },
  });
}

export async function getSuggestions(limit = 10) {
  return db.videoMetadata.findMany({
    take: limit,
    orderBy: [{ videoTitle: 'asc' }],
  });
}

export async function getVideosByGenre(genre: string) {
  return db.videoMetadata.findMany({
    where: {
      OR: [
        { videoCategory: { contains: genre, mode: 'insensitive' } },
        { suggestionCategory: { contains: genre, mode: 'insensitive' } },
      ],
    },
    orderBy: { videoTitle: 'asc' },
  });
}
