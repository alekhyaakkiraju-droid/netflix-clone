import db from '../../lib/db';

export async function getAllVideos(query?: string) {
  return db.videoMetadata.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { genre: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { title: 'asc' },
  });
}

export async function getVideoByTitle(title: string) {
  return db.videoMetadata.findFirst({
    where: { title: { equals: title, mode: 'insensitive' } },
  });
}

export async function getSuggestions(limit = 10) {
  // Ordered by cast count as a proxy for popularity (no view count in schema)
  return db.videoMetadata.findMany({
    take: limit,
    orderBy: [{ title: 'asc' }],
  });
}

export async function getVideosByGenre(genre: string) {
  return db.videoMetadata.findMany({
    where: { genre: { contains: genre, mode: 'insensitive' } },
    orderBy: { title: 'asc' },
  });
}
