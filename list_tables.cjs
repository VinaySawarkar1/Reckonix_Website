const { Client } = require('pg');

const pgClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_RWaTvuVAjX47@ep-weathered-fog-a1qzxqwa-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function listTables() {
  await pgClient.connect();
  const res = await pgClient.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
  `);
  await pgClient.end();
  console.log('Tables in public schema:');
  res.rows.forEach(row => console.log(row.table_name));
}

listTables().catch(console.error);
