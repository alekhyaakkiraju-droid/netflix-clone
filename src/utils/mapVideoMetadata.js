/**
 * Maps VideoMetadata from the API into the shape legacy Browse/VideoCard expect.
 * Thumbnail CSS classes follow `<base>_thumbnail` (e.g. saw_x.jpg → saw_x_thumbnail).
 */
export function mapVideoMetadataForBrowse(row) {
  const fileBase = (row.videoThumbnail || '')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_');
  return {
    videoTitle: row.videoTitle,
    videoCategory: row.videoCategory,
    videoRating: row.videoRating,
    releaseYear: row.releaseYear,
    thumbnail: `${fileBase}_thumbnail`,
  };
}
