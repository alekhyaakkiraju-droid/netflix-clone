/**
 * Seeds the database with video metadata migrated from the original
 * MySQL video_meta_data.sql dump.
 *
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const videos = [
  // Now Playing
  { videoTitle: 'Saw X', videoThumbnail: 'saw_x.jpg', releaseYear: 2023, suggestionCategory: 'Now Playing', videoCategory: 'Horror', videoRating: '7.0' },
  { videoTitle: 'A Haunting in Venice', videoThumbnail: 'haunting_venice.jpg', releaseYear: 2023, suggestionCategory: 'Now Playing', videoCategory: 'Mystery', videoRating: '6.8' },
  { videoTitle: 'The Creator', videoThumbnail: 'the_creator.jpg', releaseYear: 2023, suggestionCategory: 'Now Playing', videoCategory: 'Sci-Fi', videoRating: '7.1' },
  { videoTitle: 'Dumb Money', videoThumbnail: 'dumb_money.jpg', releaseYear: 2023, suggestionCategory: 'Now Playing', videoCategory: 'Drama', videoRating: '7.2' },
  // Top Rated
  { videoTitle: 'Oppenheimer', videoThumbnail: 'oppenheimer.jpg', releaseYear: 2023, suggestionCategory: 'Top Rated Movies', videoCategory: 'Drama', videoRating: '8.9' },
  { videoTitle: 'Barbie', videoThumbnail: 'barbie.jpg', releaseYear: 2023, suggestionCategory: 'Top Rated Movies', videoCategory: 'Comedy', videoRating: '7.0' },
  { videoTitle: 'Killers of the Flower Moon', videoThumbnail: 'killers.jpg', releaseYear: 2023, suggestionCategory: 'Top Rated Movies', videoCategory: 'Crime', videoRating: '7.7' },
  { videoTitle: 'Past Lives', videoThumbnail: 'past_lives.jpg', releaseYear: 2023, suggestionCategory: 'Top Rated Movies', videoCategory: 'Romance', videoRating: '8.0' },
  // New Releases
  { videoTitle: 'Priscilla', videoThumbnail: 'priscilla.jpg', releaseYear: 2023, suggestionCategory: 'New Releases', videoCategory: 'Biography', videoRating: '6.8' },
  { videoTitle: 'Five Nights at Freddy\'s', videoThumbnail: 'fnaf.jpg', releaseYear: 2023, suggestionCategory: 'New Releases', videoCategory: 'Horror', videoRating: '5.7' },
  { videoTitle: 'The Marvels', videoThumbnail: 'marvels.jpg', releaseYear: 2023, suggestionCategory: 'New Releases', videoCategory: 'Action', videoRating: '6.0' },
  // Originals
  { videoTitle: 'Squid Game: The Challenge', videoThumbnail: 'squid_challenge.jpg', releaseYear: 2023, suggestionCategory: 'Originals', videoCategory: 'Reality', videoRating: '5.8' },
  { videoTitle: 'The Crown Season 6', videoThumbnail: 'crown_s6.jpg', releaseYear: 2023, suggestionCategory: 'Originals', videoCategory: 'Drama', videoRating: '7.6' },
  { videoTitle: 'Lupin Season 3', videoThumbnail: 'lupin_s3.jpg', releaseYear: 2023, suggestionCategory: 'Originals', videoCategory: 'Thriller', videoRating: '7.5' },
];

async function main() {
  console.log('Seeding video metadata...');
  for (const video of videos) {
    await prisma.videoMetadata.upsert({
      where: { id: video.videoTitle },
      update: video,
      create: video,
    });
  }
  console.log(`Seeded ${videos.length} video records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
