import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportDatabase() {
  console.log('📊 Exporting database tables...\n');

  try {
    // Create exports directory
    const exportsDir = path.join(process.cwd(), 'database-exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    // Export Products
    console.log('📦 Exporting Products...');
    const products = await prisma.product.findMany({
      include: {
        images: true
      }
    });
    
    fs.writeFileSync(
      path.join(exportsDir, 'products.json'),
      JSON.stringify(products, null, 2)
    );
    console.log(`✅ Exported ${products.length} products`);

    // Export Categories
    console.log('📂 Exporting Categories...');
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      }
    });
    
    fs.writeFileSync(
      path.join(exportsDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log(`✅ Exported ${categories.length} categories`);

    // Export Customers
    console.log('👥 Exporting Customers...');
    const customers = await prisma.customer.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'customers.json'),
      JSON.stringify(customers, null, 2)
    );
    console.log(`✅ Exported ${customers.length} customers`);

    // Export Contact Messages
    console.log('💬 Exporting Contact Messages...');
    const messages = await prisma.contactMessage.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'contact-messages.json'),
      JSON.stringify(messages, null, 2)
    );
    console.log(`✅ Exported ${messages.length} contact messages`);

    // Export Job Applications
    console.log('💼 Exporting Job Applications...');
    const applications = await prisma.jobApplication.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'job-applications.json'),
      JSON.stringify(applications, null, 2)
    );
    console.log(`✅ Exported ${applications.length} job applications`);

    // Export Company Events
    console.log('📅 Exporting Company Events...');
    const events = await prisma.companyEvent.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'company-events.json'),
      JSON.stringify(events, null, 2)
    );
    console.log(`✅ Exported ${events.length} company events`);

    // Export Quote Requests
    console.log('💰 Exporting Quote Requests...');
    const quotes = await prisma.quoteRequest.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'quote-requests.json'),
      JSON.stringify(quotes, null, 2)
    );
    console.log(`✅ Exported ${quotes.length} quote requests`);

    // Export Jobs
    console.log('🔧 Exporting Jobs...');
    const jobs = await prisma.job.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'jobs.json'),
      JSON.stringify(jobs, null, 2)
    );
    console.log(`✅ Exported ${jobs.length} jobs`);

    // Export Gallery Images
    console.log('🖼️ Exporting Gallery Images...');
    const galleryImages = await prisma.galleryImage.findMany();
    
    fs.writeFileSync(
      path.join(exportsDir, 'gallery-images.json'),
      JSON.stringify(galleryImages, null, 2)
    );
    console.log(`✅ Exported ${galleryImages.length} gallery images`);

    // Create summary report
    const summary = {
      exportDate: new Date().toISOString(),
      tables: {
        products: products.length,
        categories: categories.length,
        customers: customers.length,
        contactMessages: messages.length,
        jobApplications: applications.length,
        companyEvents: events.length,
        quoteRequests: quotes.length,
        jobs: jobs.length,
        galleryImages: galleryImages.length
      },
      totalRecords: products.length + categories.length + customers.length + 
                   messages.length + applications.length + events.length + 
                   quotes.length + jobs.length + galleryImages.length
    };

    fs.writeFileSync(
      path.join(exportsDir, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n📊 Export Summary:');
    console.log(`- Products: ${products.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Contact Messages: ${messages.length}`);
    console.log(`- Job Applications: ${applications.length}`);
    console.log(`- Company Events: ${events.length}`);
    console.log(`- Quote Requests: ${quotes.length}`);
    console.log(`- Jobs: ${jobs.length}`);
    console.log(`- Gallery Images: ${galleryImages.length}`);
    console.log(`\n✅ All data exported to: ${exportsDir}`);

  } catch (error) {
    console.error('❌ Error exporting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase()
  .then(() => {
    console.log('\n🎉 Database export completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database export failed:', error);
    process.exit(1);
  }); 