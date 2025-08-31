import { getDb } from '../server/mongo.js';

const customers = [
  {
    name: "Morya Calibration and Services LLP",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Professional calibration services for industrial instruments and equipment",
    website: null,
    featured: true
  },
  {
    name: "24k mech labs",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Mechanical testing and calibration laboratory services",
    website: null,
    featured: false
  },
  {
    name: "Reckon Calibration Services",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Comprehensive calibration services for precision instruments",
    website: null,
    featured: true
  },
  {
    name: "Spica narrow fabric",
    location: "Surat, Gujarat",
    logoUrl: null,
    description: "Specialized narrow fabric manufacturing and quality control",
    website: null,
    featured: false
  },
  {
    name: "Universal Industrial Products",
    location: "Ahmedabad, Gujarat",
    logoUrl: null,
    description: "Manufacturing of industrial products and components",
    website: null,
    featured: false
  },
  {
    name: "Ram Technology",
    location: "Bangalore, Karnataka",
    logoUrl: null,
    description: "Technology solutions and industrial automation services",
    website: null,
    featured: false
  },
  {
    name: "Shree Enterprises",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Manufacturing enterprise with quality control requirements",
    website: null,
    featured: false
  },
  {
    name: "precise calibration centre",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Precision calibration center for industrial instruments",
    website: null,
    featured: false
  },
  {
    name: "Calpoint",
    location: "Delhi, NCR",
    logoUrl: null,
    description: "Professional calibration point services",
    website: null,
    featured: false
  },
  {
    name: "Horizon Instruments & Engineering Solutions",
    location: "Chennai, Tamil Nadu",
    logoUrl: null,
    description: "Instrumentation and engineering solutions provider",
    website: null,
    featured: false
  },
  {
    name: "Unimark Calibration",
    location: "Hyderabad, Telangana",
    logoUrl: null,
    description: "Calibration services with quality assurance",
    website: null,
    featured: false
  },
  {
    name: "krishna Calibration Centre",
    location: "Vadodara, Gujarat",
    logoUrl: null,
    description: "Calibration center serving industrial clients",
    website: null,
    featured: false
  },
  {
    name: "Jyoti test house",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Testing house for various industrial applications",
    website: null,
    featured: false
  },
  {
    name: "ITCPL",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Information Technology and Calibration Services",
    website: null,
    featured: false
  },
  {
    name: "Sigma Advanced Systems PVT Ltd",
    location: "Bangalore, Karnataka",
    logoUrl: null,
    description: "Advanced systems and technology solutions",
    website: null,
    featured: false
  },
  {
    name: "Morya Instrumentation Pvt Ltd",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Instrumentation solutions and services",
    website: null,
    featured: false
  },
  {
    name: "Testron Engineering Solutions",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Engineering solutions and testing services",
    website: null,
    featured: false
  },
  {
    name: "Sri Lata Rajaram Instruments Servicing & Calibration",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Instrument servicing and calibration services",
    website: null,
    featured: false
  },
  {
    name: "L&T Technology Services",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Larsen & Toubro technology services division",
    website: null,
    featured: true
  },
  {
    name: "PASCAL PHYSICAL LABORATORY",
    location: "Chennai, Tamil Nadu",
    logoUrl: null,
    description: "Physical laboratory for testing and analysis",
    website: null,
    featured: false
  },
  {
    name: "Mastertech Systems Calibration Services",
    location: "Delhi, NCR",
    logoUrl: null,
    description: "Master technology systems calibration services",
    website: null,
    featured: false
  },
  {
    name: "Venugrams Instruments and Calibration PVT LTD",
    location: "Coimbatore, Tamil Nadu",
    logoUrl: null,
    description: "Instruments and calibration services provider",
    website: null,
    featured: false
  },
  {
    name: "Marshal MFG & Exports",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Manufacturing and export company",
    website: null,
    featured: false
  },
  {
    name: "ALL Test",
    location: "Pune, Maharashtra",
    logoUrl: null,
    description: "Comprehensive testing services provider",
    website: null,
    featured: false
  },
  {
    name: "Schaltek",
    location: "Bangalore, Karnataka",
    logoUrl: null,
    description: "Technology solutions and services",
    website: null,
    featured: false
  },
  {
    name: "MRCREST INSTRUMENTS LLP",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "Instrumentation and measurement solutions",
    website: null,
    featured: false
  },
  {
    name: "Afro Asian",
    location: "Mumbai, Maharashtra",
    logoUrl: null,
    description: "International trade and business services",
    website: null,
    featured: false
  }
];

async function main() {
  console.log('Importing customer companies...\n');

  try {
    const db = await getDb();
    const customersCollection = db.collection('Customer');

    let createdCount = 0;
    let updatedCount = 0;

    for (const customer of customers) {
      try {
        // Check if customer already exists
        const existingCustomer = await customersCollection.findOne({ name: customer.name });

        if (existingCustomer) {
          // Update existing customer
          await customersCollection.updateOne(
            { name: customer.name },
            { $set: customer }
          );
          updatedCount++;
          console.log(`Updated: ${customer.name}`);
        } else {
          // Create new customer
          await customersCollection.insertOne(customer);
          createdCount++;
          console.log(`Created: ${customer.name}`);
        }
      } catch (error) {
        console.error(`Error processing ${customer.name}:`, error);
      }
    }

    console.log(`\nImport completed successfully!`);
    console.log(`Created: ${createdCount} customers`);
    console.log(`Updated: ${updatedCount} customers`);
    console.log(`Total processed: ${createdCount + updatedCount} customers`);

  } catch (error) {
    console.error('Error during import:', error);
  }
}

main()
  .then(() => {
    console.log('\nCustomer import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Customer import failed:', error);
    process.exit(1);
  });
