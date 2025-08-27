import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const customers = [
  {
    name: "Morya Calibration and Services LLP",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/morya-logo.png"
  },
  {
    name: "24k mech labs",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/24k-logo.png"
  },
  {
    name: "Reckon Calibration Services",
    location: "Delhi, India",
    logoUrl: "/uploads/customers/reckon-logo.png"
  },
  {
    name: "Spica narrow fabric",
    location: "Surat, Gujarat",
    logoUrl: "/uploads/customers/spica-logo.png"
  },
  {
    name: "Universal Industrial Products",
    location: "Chennai, Tamil Nadu",
    logoUrl: "/uploads/customers/universal-logo.png"
  },
  {
    name: "Ram Technology",
    location: "Bangalore, Karnataka",
    logoUrl: "/uploads/customers/ram-tech-logo.png"
  },
  {
    name: "Shree Enterprises",
    location: "Ahmedabad, Gujarat",
    logoUrl: "/uploads/customers/shree-logo.png"
  },
  {
    name: "precise calibration centre",
    location: "Hyderabad, Telangana",
    logoUrl: "/uploads/customers/precise-logo.png"
  },
  {
    name: "Horizon Instruments & Engineering Solutions",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/horizon-logo.png"
  },
  {
    name: "Unimark Calibration",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/unimark-logo.png"
  },
  {
    name: "krishna Calibration Centre",
    location: "Vadodara, Gujarat",
    logoUrl: "/uploads/customers/krishna-logo.png"
  },
  {
    name: "Jyoti test house",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/jyoti-logo.png"
  },
  {
    name: "ITCPL",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/itcpl-logo.png"
  },
  {
    name: "Sigma Advanced Systems PVT Ltd",
    location: "Bangalore, Karnataka",
    logoUrl: "/uploads/customers/sigma-logo.png"
  },
  {
    name: "Morya Instrumentation Pvt Ltd",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/morya-instr-logo.png"
  },
  {
    name: "Testron Engineering Solutions",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/testron-logo.png"
  },
  {
    name: "Sri Lata Rajaram Instruments Servicing & Calibration",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/sri-lata-logo.png"
  },
  {
    name: "L&T Technology Services",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/lt-logo.png"
  },
  {
    name: "PASCAL PHYSICAL LABORATORY",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/pascal-logo.png"
  },
  {
    name: "Mastertech Systems Calibration Services",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/mastertech-logo.png"
  },
  {
    name: "Venugrams Instruments and Calibration PVT LTD",
    location: "Chennai, Tamil Nadu",
    logoUrl: "/uploads/customers/venugrams-logo.png"
  },
  {
    name: "Marshal MFG & Exports",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/marshal-logo.png"
  },
  {
    name: "ALL Test",
    location: "Pune, Maharashtra",
    logoUrl: "/uploads/customers/alltest-logo.png"
  },
  {
    name: "Schaltek",
    location: "Bangalore, Karnataka",
    logoUrl: "/uploads/customers/schaltek-logo.png"
  },
  {
    name: "MRCREST INSTRUMENTS LLP",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/mrcrest-logo.png"
  },
  {
    name: "Afro Asian",
    location: "Mumbai, Maharashtra",
    logoUrl: "/uploads/customers/afro-asian-logo.png"
  }
];

async function addCustomers() {
  console.log('👥 Adding customers to the database...\n');

  try {
    for (const customer of customers) {
      const createdCustomer = await prisma.customer.create({
        data: customer
      });
      console.log(`✅ Added customer: ${createdCustomer.name}`);
    }

    console.log('\n🎉 All customers added successfully!');
    
    // Verify the customers were added
    const allCustomers = await prisma.customer.findMany();
    console.log(`\n📊 Total customers in database: ${allCustomers.length}`);
    
    allCustomers.forEach(customer => {
      console.log(`- ${customer.name} (${customer.location})`);
    });

  } catch (error) {
    console.error('❌ Error adding customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addCustomers()
  .then(() => {
    console.log('\n✅ Customer addition completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Customer addition failed:', error);
    process.exit(1);
  }); 