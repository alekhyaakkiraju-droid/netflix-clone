import { describe, it, expect } from 'vitest';
import { mapVideoMetadataForBrowse } from './mapVideoMetadata';

describe('mapVideoMetadataForBrowse', () => {
  it('maps API fields and derives thumbnail class from filename', () => {
    const out = mapVideoMetadataForBrowse({
      videoTitle: 'Saw X',
      videoThumbnail: 'saw_x.jpg',
      releaseYear: 2023,
      suggestionCategory: 'Now Playing',
      videoCategory: 'Horror',
      videoRating: '7.0',
    });
    expect(out.thumbnail).toBe('saw_x_thumbnail');
    expect(out.videoTitle).toBe('Saw X');
    expect(out.releaseYear).toBe(2023);
  });
});
