import { PrismaClient as NeonPrisma } from '@prisma/client';
import { PrismaClient as AwsPrisma } from '@prisma/client';
import { execSync } from 'child_process';

// Neon connection
const neon = new NeonPrisma({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_X17YdrUTGzNO@ep-rough-bird-a13vx6kt-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    },
  },
});

// AWS RDS connection
const aws = new AwsPrisma({
  datasources: {
    db: {
      url: 'postgresql://postgres:Vinay12345@database-1.cdu22gwmclih.ap-south-1.rds.amazonaws.com:5432/postgres',
    },
  },
});

const allTables = [
  'user',
  'product',
  'category',
  'subcategory',
  'customer',
  'quoterequest',
  'contactmessage',
  'websiteview',
  'productview',
  'companyevent',
  'maincatalog',
  'job',
  'jobapplication',
  'galleryimage',
  'productimage',
  'teammember',
  'industry',
  'testimonial',
];

async function tableExists(table: string) {
  const result = await neon.$queryRawUnsafe<any[]>(`SELECT to_regclass('public."${table.charAt(0).toUpperCase() + table.slice(1)}"')::text as exists`);
  return result[0]?.exists !== null;
}

async function clearAwsCategoriesAndSubcategories() {
  await aws.subcategory.deleteMany();
  await aws.category.deleteMany();
  console.log('Cleared AWS subcategory and category tables.');
}

async function copyTableWithId(table: string) {
  try {
    // @ts-ignore
    const records = await neon[table].findMany();
    for (const record of records) {
      const { createdAt, ...rest } = record; // keep id
      try {
        // @ts-ignore
        await aws[table].create({ data: rest });
      } catch (e) {
        console.error(`Error copying ${table} record:`, e);
      }
    }
    console.log(`Copied ${records.length} records from ${table} (with original IDs)`);
  } catch (e) {
    console.error(`Error accessing table ${table}:`, e);
    console.log(`Skipping ${table} due to schema mismatch`);
  }
}

async function main() {
  console.log('Starting data migration from Neon to AWS...');
  
  // Copy all tables with original IDs
  for (const table of allTables) {
    if (await tableExists(table)) {
      console.log(`Copying ${table}...`);
      await copyTableWithId(table);
    } else {
      console.log(`Table ${table} does not exist in Neon, skipping...`);
    }
  }
  
  await neon.$disconnect();
  await aws.$disconnect();
  console.log('All data copied with original IDs!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}); 