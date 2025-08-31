const { Client } = require('pg');
const { MongoClient } = require('mongodb');

const pgClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_RWaTvuVAjX47@ep-weathered-fog-a1qzxqwa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});
const mongoUri = 'mongodb+srv://vinaysawarkar0:vgP9DZNlkiJWNNMH@cluster0.4adl4tl.mongodb.net/';
const mongoClient = new MongoClient(mongoUri);

const tables = [
  'Category',
  'MainCatalog',
  'Product',
  'Job',
  'User',
  'QuoteRequest',
  'WebsiteView',
  'ContactMessage',
  'ProductImage',
  'Customer',
  'Subcategory',
  'CompanyEvent',
  'TeamMember',
  'Testimonial',
  'Industry'
];

async function compareTable(table, db) {
  const pgRes = await pgClient.query(`SELECT * FROM "${table}" LIMIT 5`);
  const pgRows = pgRes.rows;
  const mongoRows = await db.collection(table).find({}).limit(5).toArray();
  console.log(`\nTable: ${table}`);
  console.log('PostgreSQL sample:', pgRows);
  console.log('MongoDB sample:', mongoRows);
  console.log(`PostgreSQL count: ${pgRows.length}, MongoDB count: ${mongoRows.length}`);
}

async function compareAll() {
  await pgClient.connect();
  await mongoClient.connect();
  const db = mongoClient.db('reckonix');

  for (const table of tables) {
    await compareTable(table, db);
  }

  await pgClient.end();
  await mongoClient.close();
  console.log('\nComparison complete!');
}

compareAll().catch(console.error);
