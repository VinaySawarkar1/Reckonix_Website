const { Client } = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection
const pgClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_RWaTvuVAjX47@ep-weathered-fog-a1qzxqwa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// MongoDB connection
const mongoUri = 'mongodb+srv://vinaysawarkar0:vgP9DZNlkiJWNNMH@cluster0.4adl4tl.mongodb.net/';
const mongoClient = new MongoClient(mongoUri);

async function getAllTables() {
  const res = await pgClient.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  `);
  return res.rows.map(row => row.table_name);
}

async function migrateTable(table, db) {
  const res = await pgClient.query(`SELECT * FROM ${table}`);
  const rows = res.rows;
  if (rows.length === 0) return;
  await db.collection(table).insertMany(rows);
  console.log(`Migrated ${rows.length} rows from ${table}`);
}

async function migrateAll() {
  await pgClient.connect();
  await mongoClient.connect();
  const db = mongoClient.db('reckonix'); // Use your MongoDB database name

  const tables = await getAllTables();
  for (const table of tables) {
    await migrateTable(table, db);
  }

  await pgClient.end();
  await mongoClient.close();
  console.log('All data migrated!');
}

migrateAll().catch(console.error);
