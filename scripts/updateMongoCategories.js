const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// Use the same MongoDB URI as the server
const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

const client = new MongoClient(mongoUri, {
  serverApi: ServerApiVersion.v1,
  retryWrites: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  maxIdleTimeMS: 30000,
  retryReads: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
});

// Define the correct categories and subcategories
const categories = [
  {
    name: "Calibration",
    subcategories: [
      "Pressure Calibrator",
      "Multifunction Calibrator",
      "Decade Boxes",
      "Process Calibrators",
      "Impedance Standards",
      "Dimension Calibrators",
      "Electrical Calibrators", 
      "Thermal Calibrator",
      "Mass and Volume",
      "Flow Calibrator"
    ]
  },
  {
    name: "Metrology",
    subcategories: [
      "Coordinate Measuring Machine",
      "Vision Measuring Machine", 
      "Tool Presetter",
      "Optical Comparator",
      "Video Measuring System",
      "Height Gauge",
      "Roundness Measuring Machine",
      "Surface Roughness Tester",
      "Hardness Tester",
      "Profile Projector",
      "Linear Scale & DRO",
      "Granite Surface Plate",
      "Calibration Instruments"
    ]
  },
  {
    name: "Measuring",
    subcategories: [
      "Dataloggers",
      "Transmitters",
      "IOT Gateway",
      "Digital Calipers",
      "Digital Micrometers",
      "Dial Indicators",
      "Digital Indicators",
      "Angle Measuring Instruments",
      "Thickness Gauges"
    ]
  },
  {
    name: "Software",
    subcategories: [
      "Calibration Software",
      "Data Analysis Software",
      "Quality Management Software",
      "Measurement Software",
      "Reporting Software"
    ]
  }
];

async function updateMongoCategories() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('reckonix');
    
    // Clear existing categories and subcategories
    console.log('🗑️ Clearing existing categories...');
    await db.collection('Category').deleteMany({});
    await db.collection('Subcategory').deleteMany({});
    console.log('✅ Cleared existing categories and subcategories');

    // Insert new categories and subcategories
    console.log('📝 Inserting new categories...');
    
    for (let i = 0; i < categories.length; i++) {
      const categoryData = categories[i];
      
      // Insert category
      const categoryResult = await db.collection('Category').insertOne({
        id: i + 1,
        name: categoryData.name
      });
      
      console.log(`✅ Created category: ${categoryData.name}`);
      
      // Insert subcategories
      for (let j = 0; j < categoryData.subcategories.length; j++) {
        const subcategoryName = categoryData.subcategories[j];
        await db.collection('Subcategory').insertOne({
          id: (i + 1) * 100 + j + 1, // Generate unique IDs
          name: subcategoryName,
          categoryId: i + 1
        });
      }
      
      console.log(`✅ Added ${categoryData.subcategories.length} subcategories for ${categoryData.name}`);
    }

    console.log('🎉 Categories updated successfully!');
    
    // Verify the data
    const allCategories = await db.collection('Category').find({}).toArray();
    const allSubcategories = await db.collection('Subcategory').find({}).toArray();
    
    console.log('\n📊 Verification:');
    console.log(`Categories: ${allCategories.length}`);
    console.log(`Subcategories: ${allSubcategories.length}`);
    
    allCategories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat.id})`);
    });

  } catch (error) {
    console.error('❌ Error updating categories:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateMongoCategories();





