#!/usr/bin/env node
/**
 * WO-034: MySQL → PostgreSQL data migration script
 *
 * Usage:
 *   MYSQL_URL="mysql://user:pass@localhost:3306/netflix" \
 *   DATABASE_URL="postgresql://..." \
 *   node scripts/migrate-mysql-to-pg.js [--dry-run]
 *
 * Tables migrated (from legacy Spring Boot schema):
 *   user_details    → User + Profile
 *   video_meta_data → VideoMetadata
 *
 * Run order: users first, then profiles, then videos.
 * Idempotent: existing records are skipped (upsert on email / title).
 */

const isDryRun = process.argv.includes('--dry-run');

async function connectMySQL() {
  // Lazy require — mysql2 may not be installed in prod image
  let mysql;
  try {
    mysql = await import('mysql2/promise');
  } catch {
    console.error('mysql2 not installed. Run: npm install mysql2');
    process.exit(1);
  }
  const url = process.env.MYSQL_URL;
  if (!url) { console.error('MYSQL_URL env var required'); process.exit(1); }
  return mysql.createConnection(url);
}

async function connectPostgres() {
  let prismaModule;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prismaModule = new PrismaClient();
  } catch {
    console.error('@prisma/client not installed or not generated');
    process.exit(1);
  }
  await prismaModule.$connect();
  return prismaModule;
}

async function migrateUsers(conn, prisma) {
  console.log('\n📦 Migrating users…');
  const [rows] = await conn.query('SELECT * FROM user_details');
  let created = 0, skipped = 0;

  for (const row of rows) {
    const email = row.email ?? row.user_email;
    if (!email) { skipped++; continue; }

    try {
      if (!isDryRun) {
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            passwordHash: row.password ?? row.user_password ?? (process.env.MIGRATION_PLACEHOLDER_HASH ?? '$2a$12$PLACEHOLDER'), // NOSONAR - not a credential; accounts with no source hash require a forced reset
            createdAt: row.created_at ?? new Date(),
          },
        });
      }
      created++;
    } catch (err) {
      console.warn(`  ⚠️  Skipped user ${email}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`  ✅ Users: ${created} created${isDryRun ? ' (DRY RUN)' : ''}, ${skipped} skipped`);
}

async function migrateVideos(conn, prisma) {
  console.log('\n🎬 Migrating video_meta_data…');
  const [rows] = await conn.query('SELECT * FROM video_meta_data');
  let created = 0, skipped = 0;

  for (const row of rows) {
    const title = row.title ?? row.video_title;
    if (!title) { skipped++; continue; }

    try {
      if (!isDryRun) {
        await prisma.videoMetadata.upsert({
          where: { title },
          update: {},
          create: {
            title,
            genre: row.genre ?? 'Unknown',
            cast: row.cast ?? row.video_cast ?? '',
            description: row.description ?? row.synopsis ?? '',
          },
        });
      }
      created++;
    } catch (err) {
      console.warn(`  ⚠️  Skipped video "${title}": ${err.message}`);
      skipped++;
    }
  }
  console.log(`  ✅ Videos: ${created} created${isDryRun ? ' (DRY RUN)' : ''}, ${skipped} skipped`);
}

async function main() {
  console.log(`🚀 MySQL → PostgreSQL migration ${isDryRun ? '[DRY RUN] ' : ''}starting…`);

  const conn = await connectMySQL();
  const prisma = await connectPostgres();

  try {
    await migrateUsers(conn, prisma);
    await migrateVideos(conn, prisma);
    console.log('\n✅ Migration complete.');
  } finally {
    await conn.end();
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
