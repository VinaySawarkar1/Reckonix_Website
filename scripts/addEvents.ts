import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    title: "Reckonix at IMTEX 2024",
    description: "Join us at IMTEX 2024, India's premier machine tool exhibition, where we'll showcase our latest calibration and measuring systems. Visit our booth to see live demonstrations of our precision instruments and meet our technical experts.",
    eventDate: new Date("2024-01-25"),
    imageUrl: "/uploads/events/imtex-2024.jpg",
    published: true
  },
  {
    title: "Calibration Technology Workshop",
    description: "Free workshop on modern calibration techniques and best practices. Learn about the latest standards in calibration, hands-on demonstrations, and networking with industry professionals.",
    eventDate: new Date("2024-02-15"),
    imageUrl: "/uploads/events/calibration-workshop.jpg",
    published: true
  },
  {
    title: "Product Launch: Next-Gen Vision Measuring Systems",
    description: "Exclusive launch event for our new range of advanced vision measuring systems. Features include AI-powered measurement, enhanced accuracy, and cloud-based reporting capabilities.",
    eventDate: new Date("2024-03-10"),
    imageUrl: "/uploads/events/product-launch-2024.jpg",
    published: true
  }
];

async function addEvents() {
  console.log('📅 Adding company events to the database...\n');

  try {
    for (const event of events) {
      const createdEvent = await prisma.companyEvent.create({
        data: event
      });
      console.log(`✅ Added event: ${createdEvent.title}`);
    }

    console.log('\n🎉 All events added successfully!');
    
    // Verify the events were added
    const allEvents = await prisma.companyEvent.findMany();
    console.log(`\n📊 Total events in database: ${allEvents.length}`);
    
    allEvents.forEach(event => {
      console.log(`- ${event.title} (${event.published ? 'Published' : 'Draft'})`);
    });

  } catch (error) {
    console.error('❌ Error adding events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEvents()
  .then(() => {
    console.log('\n✅ Event addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Event addition failed:', error);
    process.exit(1);
  }); 