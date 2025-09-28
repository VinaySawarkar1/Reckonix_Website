// Direct MongoDB update script
const { MongoClient } = require('mongodb');

const mongoUri = 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';

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

async function updateCategories() {
  const client = new MongoClient(mongoUri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully');
    
    const db = client.db('reckonix');
    
    // Clear existing data
    console.log('Clearing existing categories...');
    await db.collection('Category').deleteMany({});
    await db.collection('Subcategory').deleteMany({});
    
    // Insert new categories
    console.log('Inserting new categories...');
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      
      // Insert category
      await db.collection('Category').insertOne({
        id: i + 1,
        name: cat.name
      });
      
      // Insert subcategories
      for (let j = 0; j < cat.subcategories.length; j++) {
        await db.collection('Subcategory').insertOne({
          id: (i + 1) * 100 + j + 1,
          name: cat.subcategories[j],
          categoryId: i + 1
        });
      }
      
      console.log(`Added ${cat.name} with ${cat.subcategories.length} subcategories`);
    }
    
    console.log('Categories updated successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateCategories();





