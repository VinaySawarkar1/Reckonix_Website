import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    title: "Mtech Expo 2025 - Showcasing Innovation in Pune",
    description: "Reckonix is excited to announce our participation in the Mtech Expo 2025, one of India's premier industrial exhibitions. This event brings together the best of machine tools, automation, and advanced manufacturing technologies. It's a powerful platform where industry leaders, manufacturers, suppliers, and professionals showcase innovations, share knowledge, and build lasting business connections. We invite you to visit our booth to explore our latest solutions in calibration systems, non-sparking tools, and vision measuring machines, designed to help industries grow smarter and faster. More details about our specific exhibits and live demonstrations will be available soon. Please check back later or contact us for more information.",
    eventDate: new Date("2025-11-20"),
    imageUrl: "/uploads/events/mtech-expo-2025.jpg",
    published: true,
    attendees: "Industry professionals, manufacturers, suppliers, and technology enthusiasts",
    content: "Join us at our booth to explore our latest solutions in calibration systems, non-sparking tools, and vision measuring machines. Live demonstrations and expert consultations available.",
    duration: "4 days (November 20-23, 2025)"
  },
  {
    title: "Explore Reckonix at Mtech Expo 2025 - Advancing Manufacturing",
    description: "Join Reckonix at the Mtech Expo 2025, a mega industrial exhibition focused on the future of manufacturing. We will be showcasing our cutting-edge range of testing, measuring, and calibration systems, along with our high-quality non-sparking tools and precision vision measuring machines. This is an unparalleled opportunity to see our products in action, discuss your specific requirements with our experts, and learn how Reckonix solutions can enhance your operational efficiency and accuracy. Don't miss this chance to network with industry peers and discover the latest technological advancements.",
    eventDate: new Date("2025-11-20"),
    imageUrl: "/uploads/events/mtech-expo-advancing-manufacturing.jpg",
    published: true,
    attendees: "Manufacturing professionals, quality control experts, and industry decision makers",
    content: "Showcasing cutting-edge range of testing, measuring, and calibration systems. Live product demonstrations and expert consultations available.",
    duration: "4 days (November 20-23, 2025)"
  },
  {
    title: "Join Reckonix at Mtech Expo 2025 - Precision Measurement Solutions",
    description: "Reckonix is proud to be an exhibitor at Mtech Expo 2025 in Pune, a must-attend event for professionals in machine tools, automation, and advanced manufacturing. Our booth will feature live demonstrations and expert insights into our comprehensive portfolio of calibration solutions, including electrical and mechanical calibrators, as well as our advanced vision measuring machines. We are dedicated to providing world-class instruments that meet the highest standards of quality and innovation. Come and see how Reckonix can be your trusted partner for precision measurement.",
    eventDate: new Date("2025-11-20"),
    imageUrl: "/uploads/events/mtech-expo-precision-solutions.jpg",
    published: true,
    attendees: "Precision measurement professionals, calibration experts, and manufacturing leaders",
    content: "Live demonstrations and expert insights into our comprehensive portfolio of calibration solutions. Visit our booth to see world-class instruments in action.",
    duration: "4 days (November 20-23, 2025)"
  }
];

async function addMtechExpoEvents() {
  console.log('📅 Adding Mtech Expo 2025 events to the database...\n');

  try {
    for (const event of events) {
      const createdEvent = await prisma.companyEvent.create({
        data: event
      });
      console.log(`✅ Added event: ${createdEvent.title}`);
    }

    console.log('\n🎉 All Mtech Expo events added successfully!');
    
    // Verify the events were added
    const allEvents = await prisma.companyEvent.findMany();
    console.log(`\n📊 Total events in database: ${allEvents.length}`);
    
    allEvents.forEach(event => {
      console.log(`- ${event.title} (${event.published ? 'Published' : 'Draft'})`);
    });

  } catch (error) {
    console.error('❌ Error adding Mtech Expo events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMtechExpoEvents()
  .then(() => {
    console.log('\n✅ Mtech Expo events addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Mtech Expo events addition failed:', error);
    process.exit(1);
  }); 