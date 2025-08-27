import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const meatestCompleteProducts = [
  // Multi-Product Calibrators (from https://www.meatest.com/products-multi-product-calibrators-145)
  {
    name: "MEATEST 9010+ Multifunction Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "10 ppm AC/DC multifunction calibrator for multimeters, power meters and generally all kinds of electric meters",
    imageUrl: null,
    rank: 1,
    homeFeatured: true,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "10 ppm" },
      { key: "Voltage DC", value: "0-1050V" },
      { key: "Voltage AC", value: "0-1050V (45-65Hz)" },
      { key: "Current DC", value: "0-20.5A" },
      { key: "Current AC", value: "0-20.5A (45-65Hz)" },
      { key: "Resistance", value: "0-100MΩ" },
      { key: "Frequency", value: "0.1Hz-1MHz" },
      { key: "Power", value: "Yes" },
      { key: "TC", value: "Yes" },
      { key: "RTD", value: "Yes" },
      { key: "Capacitance", value: "Yes" },
      { key: "HF Output", value: "Yes" }
    ]),
    featuresBenefits: JSON.stringify([
      "Modular design for customization",
      "High precision 10 ppm accuracy",
      "Comprehensive calibration capabilities",
      "Oscilloscope calibration support",
      "Insulation tester calibration",
      "Source and transducer calibration"
    ]),
    applications: JSON.stringify([
      "Multimeter calibration",
      "Power meter calibration",
      "Electric meter calibration",
      "Oscilloscope calibration",
      "Insulation tester calibration",
      "Source and transducer calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "RoHS compliant"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Multifunction Calibrator",
      "Technology": "Advanced digital calibration technology",
      "Design": "Modular design for customization",
      "Interface": "USB, RS232, GPIB",
      "Software": "MEATEST Calibration Suite"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST 9010+ Multifunction Calibrator is a 10 ppm AC/DC multifunction calibrator for multimeters, power meters and generally all kinds of electric meters. Implementing modular design, 9010+ can be further customized to calibrate oscilloscopes, insulation testers, sources and transducers."
  },
  {
    name: "MEATEST 9010 Multifunction Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "35 ppm AC/DC multifunction calibrator for multimeters, power meters and generally all kinds of electric meters",
    imageUrl: null,
    rank: 2,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "35 ppm" },
      { key: "Voltage DC", value: "0-1050V" },
      { key: "Voltage AC", value: "0-1050V (45-65Hz)" },
      { key: "Current DC", value: "0-20.5A" },
      { key: "Current AC", value: "0-20.5A (45-65Hz)" },
      { key: "Resistance", value: "0-100MΩ" },
      { key: "Frequency", value: "0.1Hz-1MHz" },
      { key: "Power", value: "Yes" },
      { key: "TC", value: "Yes" },
      { key: "RTD", value: "Yes" },
      { key: "Capacitance", value: "Yes" },
      { key: "HF Output", value: "Yes" }
    ]),
    featuresBenefits: JSON.stringify([
      "Modular design for customization",
      "35 ppm accuracy",
      "Comprehensive calibration capabilities",
      "Oscilloscope calibration support",
      "Insulation tester calibration",
      "Source and transducer calibration"
    ]),
    applications: JSON.stringify([
      "Multimeter calibration",
      "Power meter calibration",
      "Electric meter calibration",
      "Oscilloscope calibration",
      "Insulation tester calibration",
      "Source and transducer calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "RoHS compliant"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Multifunction Calibrator",
      "Technology": "Advanced digital calibration technology",
      "Design": "Modular design for customization",
      "Interface": "USB, RS232, GPIB",
      "Software": "MEATEST Calibration Suite"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST 9010 Multifunction Calibrator is a 35 ppm AC/DC multifunction calibrator for multimeters, power meters and generally all kinds of electric meters. Implementing modular design, 9010 can be further customized to calibrate oscilloscopes, insulation testers, sources and transducers."
  },
  {
    name: "MEATEST 9000 Portable Multifunction Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "65 ppm AC/DC multifunction calibrator designed specifically for calibration of 3½ and 4½ digit multimeters",
    imageUrl: null,
    rank: 3,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "65 ppm" },
      { key: "Voltage DC", value: "0-1050V" },
      { key: "Voltage AC", value: "0-1050V (45-65Hz)" },
      { key: "Current DC", value: "0-20.5A" },
      { key: "Current AC", value: "0-20.5A (45-65Hz)" },
      { key: "Resistance", value: "0-100MΩ" },
      { key: "Capacitance", value: "Yes" },
      { key: "Temperature", value: "Yes" },
      { key: "Weight", value: "11 kg" },
      { key: "Portability", value: "Ultra portable" }
    ]),
    featuresBenefits: JSON.stringify([
      "Ultra portable design",
      "Lightweight 11 kg body",
      "Comprehensive calibration capabilities",
      "Temperature calibration included",
      "Capacitance measurement",
      "Resistance measurement"
    ]),
    applications: JSON.stringify([
      "3½ digit multimeter calibration",
      "4½ digit multimeter calibration",
      "Field calibration",
      "Portable measurement",
      "Industrial maintenance"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "RoHS compliant"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Portable Multifunction Calibrator",
      "Technology": "Advanced portable calibration technology",
      "Design": "Ultra portable, 11 kg body",
      "Interface": "USB, RS232",
      "Power": "Battery and AC operation"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST 9000 Portable Multifunction Calibrator is a 65 ppm AC/DC multifunction calibrator designed specifically for calibration of 3½ and 4½ digit multimeters. 1050 V, 20.5 A, resistance, capacitance and temperature packed inside ultra portable, 11 kg body."
  },
  {
    name: "MEATEST M160 Precision DC Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "20 ppm calibrator of DC process signals designed for calibration of evaluation units and process multimeters under demanding industrial conditions",
    imageUrl: null,
    rank: 4,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "20 ppm" },
      { key: "Signal Type", value: "DC process signals" },
      { key: "RTD", value: "Yes" },
      { key: "Resistance Source", value: "Yes" },
      { key: "Industrial Conditions", value: "Designed for demanding use" },
      { key: "Applications", value: "Evaluation units and process multimeters" }
    ]),
    featuresBenefits: JSON.stringify([
      "High precision 20 ppm accuracy",
      "RTD and resistance source included",
      "Designed for industrial conditions",
      "Process signal calibration",
      "Evaluation unit calibration",
      "Process multimeter calibration"
    ]),
    applications: JSON.stringify([
      "Evaluation unit calibration",
      "Process multimeter calibration",
      "Industrial instrumentation",
      "Process control calibration",
      "Field calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "Industrial grade"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Precision DC Calibrator",
      "Technology": "Advanced DC calibration technology",
      "Features": "RTD and resistance source included",
      "Design": "Industrial grade construction",
      "Applications": "Process signal calibration"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M160 Precision DC Calibrator is a 20 ppm calibrator of DC process signals designed for calibration of evaluation units and process multimeters under demanding industrial conditions. Includes RTD and resistance source."
  },
  {
    name: "MEATEST M160i Precision DC Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "20 ppm calibrator of DC process signals designed for calibration of evaluation units and process multimeters under demanding industrial conditions",
    imageUrl: null,
    rank: 5,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Accuracy", value: "20 ppm" },
      { key: "Signal Type", value: "DC process signals" },
      { key: "Industrial Conditions", value: "Designed for demanding use" },
      { key: "Applications", value: "Evaluation units and process multimeters" }
    ]),
    featuresBenefits: JSON.stringify([
      "High precision 20 ppm accuracy",
      "Designed for industrial conditions",
      "Process signal calibration",
      "Evaluation unit calibration",
      "Process multimeter calibration"
    ]),
    applications: JSON.stringify([
      "Evaluation unit calibration",
      "Process multimeter calibration",
      "Industrial instrumentation",
      "Process control calibration",
      "Field calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "Industrial grade"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Precision DC Calibrator",
      "Technology": "Advanced DC calibration technology",
      "Design": "Industrial grade construction",
      "Applications": "Process signal calibration"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M160i Precision DC Calibrator is a 20 ppm calibrator of DC process signals designed for calibration of evaluation units and process multimeters under demanding industrial conditions."
  },

  // Power & Energy Calibrators (from https://www.meatest.com/products-power-energy-calibrators-142)
  {
    name: "MEATEST M133C 3F Power & Energy Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Three phase electric power/energy calibrator with power quality functions for calibration and testing of grid measuring appliance",
    imageUrl: null,
    rank: 6,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Phases", value: "3" },
      { key: "Power Quality", value: "Yes" },
      { key: "Frequency Range", value: "15-1000 Hz" },
      { key: "Built-in Process Multimeter", value: "Yes" },
      { key: "Floating Current Outputs", value: "Yes" },
      { key: "Applications", value: "Grid measuring appliance calibration" }
    ]),
    featuresBenefits: JSON.stringify([
      "Three phase operation",
      "Power quality functions",
      "Extended frequency range 15-1000 Hz",
      "Built-in process multimeter",
      "Floating current outputs",
      "Grid measuring appliance calibration"
    ]),
    applications: JSON.stringify([
      "Power meter calibration",
      "Power transducer calibration",
      "Power quality analyzer calibration",
      "Grid measuring appliance testing",
      "Energy meter calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 62053 compliance"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Three Phase Power & Energy Calibrator",
      "Technology": "Advanced power measurement technology",
      "Features": "Power quality functions",
      "Frequency": "15-1000 Hz range",
      "Applications": "Grid measuring appliance"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M133C 3F Power & Energy Calibrator is a three phase electric power/energy calibrator with power quality functions for calibration and testing of grid measuring appliance like power meters, power transducers or power quality analysers."
  },
  {
    name: "MEATEST M133C 1F Power & Energy Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Single phase electric power/energy calibrator with power quality functions for calibration and testing of grid measuring appliance",
    imageUrl: null,
    rank: 7,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Phases", value: "1" },
      { key: "Power Quality", value: "Yes" },
      { key: "Frequency Range", value: "15-1000 Hz" },
      { key: "Built-in Process Multimeter", value: "Yes" },
      { key: "Floating Current Outputs", value: "Yes" },
      { key: "Terminals 2 and 3", value: "Inactive" },
      { key: "Applications", value: "Grid measuring appliance calibration" }
    ]),
    featuresBenefits: JSON.stringify([
      "Single phase operation",
      "Power quality functions",
      "Extended frequency range 15-1000 Hz",
      "Built-in process multimeter",
      "Floating current outputs",
      "Grid measuring appliance calibration"
    ]),
    applications: JSON.stringify([
      "Power meter calibration",
      "Power transducer calibration",
      "Power quality analyzer calibration",
      "Grid measuring appliance testing",
      "Energy meter calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 62053 compliance"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Single Phase Power & Energy Calibrator",
      "Technology": "Advanced power measurement technology",
      "Features": "Power quality functions",
      "Frequency": "15-1000 Hz range",
      "Note": "Terminals 2 and 3 are inactive"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M133C 1F Power & Energy Calibrator is a single phase electric power/energy calibrator with power quality functions for calibration and testing of grid measuring appliance like power meters, power transducers or power quality analysers. Terminals 2 and 3 are inactive."
  },
  {
    name: "MEATEST M133Ci 3F Power & Energy Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Three phase electric power/energy calibrator for calibration and testing of power meters and power transducers",
    imageUrl: null,
    rank: 8,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Phases", value: "3" },
      { key: "Power Quality", value: "No" },
      { key: "Frequency Range", value: "15-1000 Hz" },
      { key: "Built-in Process Multimeter", value: "Yes" },
      { key: "Floating Current Outputs", value: "Yes" },
      { key: "Applications", value: "Power meters and transducers" }
    ]),
    featuresBenefits: JSON.stringify([
      "Three phase operation",
      "Extended frequency range 15-1000 Hz",
      "Built-in process multimeter",
      "Floating current outputs",
      "Power meter calibration",
      "Power transducer calibration"
    ]),
    applications: JSON.stringify([
      "Power meter calibration",
      "Power transducer calibration",
      "Energy meter calibration",
      "Grid measuring appliance testing"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 62053 compliance"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Three Phase Power & Energy Calibrator",
      "Technology": "Advanced power measurement technology",
      "Frequency": "15-1000 Hz range",
      "Applications": "Power meters and transducers"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M133Ci 3F Power & Energy Calibrator is a three phase electric power/energy calibrator for calibration and testing of power meters and power transducers."
  },
  {
    name: "MEATEST M133Ci 1F Power & Energy Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Single phase electric power/energy calibrator for calibration and testing of power meters and power transducers",
    imageUrl: null,
    rank: 9,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Phases", value: "1" },
      { key: "Power Quality", value: "No" },
      { key: "Frequency Range", value: "15-1000 Hz" },
      { key: "Built-in Process Multimeter", value: "Yes" },
      { key: "Floating Current Outputs", value: "Yes" },
      { key: "Terminals 2 and 3", value: "Inactive" },
      { key: "Applications", value: "Power meters and transducers" }
    ]),
    featuresBenefits: JSON.stringify([
      "Single phase operation",
      "Extended frequency range 15-1000 Hz",
      "Built-in process multimeter",
      "Floating current outputs",
      "Power meter calibration",
      "Power transducer calibration"
    ]),
    applications: JSON.stringify([
      "Power meter calibration",
      "Power transducer calibration",
      "Energy meter calibration",
      "Grid measuring appliance testing"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "IEC 62053 compliance"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Single Phase Power & Energy Calibrator",
      "Technology": "Advanced power measurement technology",
      "Frequency": "15-1000 Hz range",
      "Note": "Terminals 2 and 3 are inactive",
      "Applications": "Power meters and transducers"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M133Ci 1F Power & Energy Calibrator is a single phase electric power/energy calibrator for calibration and testing of power meters and power transducers. Terminals 2 and 3 are inactive."
  },

  // Impedance Standards (from https://www.meatest.com/products-impedance-standards-150)
  {
    name: "MEATEST M550 Impedance Calibrator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Bank of fixed resistance, capacitance and inductance standards with defined frequency characteristic up to 1 MHz for automated calibration of LCR meters",
    imageUrl: null,
    rank: 10,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "LCR" },
      { key: "Frequency Limit", value: "1 MHz" },
      { key: "Resistance Standards", value: "Fixed values" },
      { key: "Capacitance Standards", value: "Fixed values" },
      { key: "Inductance Standards", value: "Fixed values" },
      { key: "Automation", value: "Fully automated LCR meter calibration" },
      { key: "Remote Control", value: "Yes" }
    ]),
    featuresBenefits: JSON.stringify([
      "Fully automated LCR meter calibration",
      "Remote control capability",
      "Fixed resistance, capacitance and inductance standards",
      "Defined frequency characteristic up to 1 MHz",
      "Eliminates endless standard switching",
      "Automatic uncertainty calculations"
    ]),
    applications: JSON.stringify([
      "LCR meter calibration",
      "Automated calibration procedures",
      "Laboratory standards",
      "High precision impedance measurement",
      "Quality control"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "NIST traceable",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Impedance Calibrator",
      "Technology": "Fixed impedance standards",
      "Automation": "Fully automated calibration",
      "Frequency": "Up to 1 MHz",
      "Control": "Remote control capability"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M550 Impedance Calibrator is a bank of fixed resistance, capacitance and inductance standards with defined frequency characteristic up to 1 MHz for automated calibration of LCR meters. By introducing remote control M550 Impedance Calibrator saves you from endless standard switching and uncertainty calculations."
  },
  {
    name: "MEATEST MTE Laboratory Impedance Standards",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Series of single resistance, capacitance and inductance decadic standards for calibration of ohm meters, LCR meters and multimeters",
    imageUrl: null,
    rank: 11,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "LCR" },
      { key: "Frequency Limit", value: "20 kHz" },
      { key: "Resistance Standards", value: "Decadic standards" },
      { key: "Capacitance Standards", value: "Decadic standards" },
      { key: "Inductance Standards", value: "Decadic standards" },
      { key: "Applications", value: "Ohm meters, LCR meters, multimeters" }
    ]),
    featuresBenefits: JSON.stringify([
      "Series of single decadic standards",
      "High precision impedance standards",
      "Resistance, capacitance and inductance standards",
      "Laboratory grade accuracy",
      "Traceable calibration",
      "Multiple impedance types"
    ]),
    applications: JSON.stringify([
      "Ohm meter calibration",
      "LCR meter calibration",
      "Multimeter calibration",
      "Laboratory standards",
      "Quality control"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "NIST traceable",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Laboratory Impedance Standards",
      "Technology": "Decadic impedance standards",
      "Frequency": "Up to 20 kHz",
      "Types": "Resistance, capacitance, inductance",
      "Grade": "Laboratory standards"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST MTE Laboratory Impedance Standards is a series of single resistance, capacitance and inductance decadic standards for calibration of ohm meters, LCR meters and multimeters."
  },

  // Decade Boxes (from https://www.meatest.com/products-decade-boxes-144)
  {
    name: "MEATEST M192 Real-Resistance Load",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "3000W power load based on set of 64 fixed, high-power resistors",
    imageUrl: null,
    rank: 12,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Power Rating", value: "3000W" },
      { key: "Design", value: "Real-Resistance decade design" },
      { key: "Resistors", value: "64 fixed, high-power resistors" },
      { key: "Built-in Multimeter", value: "Yes" },
      { key: "Functions", value: "Constant power and constant current simulation" }
    ]),
    featuresBenefits: JSON.stringify([
      "3000W power load capacity",
      "Real-Resistance decade design",
      "Built-in multimeter",
      "Constant power simulation",
      "Constant current simulation",
      "High-power resistor set"
    ]),
    applications: JSON.stringify([
      "Power load testing",
      "Constant power simulation",
      "Constant current simulation",
      "High-power applications",
      "Industrial testing"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "High-power rated"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Real-Resistance Load",
      "Technology": "High-power resistor network",
      "Power": "3000W capacity",
      "Design": "Real-Resistance decade design",
      "Features": "Built-in multimeter"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M192 Real-Resistance Load is a 3000W power load based on set of 64 fixed, high-power resistors."
  },
  {
    name: "MEATEST M642 Real-Resistance Decade Box",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Resistance decade box with 100 mΩ - 22 MΩ range and 5W load capacity. Best resolution 1 μΩ, RTD temperature sensor simulation feature",
    imageUrl: null,
    rank: 13,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Resistance Range", value: "100 mΩ - 22 MΩ" },
      { key: "Load Capacity", value: "5W" },
      { key: "Best Resolution", value: "1 μΩ" },
      { key: "RTD Simulation", value: "Yes" },
      { key: "Temperature Sensor Simulation", value: "Yes" },
      { key: "Design", value: "Real-Resistance decade design" }
    ]),
    featuresBenefits: JSON.stringify([
      "Wide resistance range 100 mΩ - 22 MΩ",
      "5W load capacity",
      "Best resolution 1 μΩ",
      "RTD temperature sensor simulation",
      "Real-Resistance decade design",
      "High accuracy and temperature stability"
    ]),
    applications: JSON.stringify([
      "Resistance measurement",
      "RTD simulation",
      "Temperature sensor testing",
      "High precision resistance calibration",
      "Laboratory use"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Real-Resistance Decade Box",
      "Technology": "Real-Resistance decade design",
      "Range": "100 mΩ - 22 MΩ",
      "Capacity": "5W load capacity",
      "Resolution": "1 μΩ best resolution"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M642 Real-Resistance Decade Box is a resistance decade box with 100 mΩ - 22 MΩ range and 5W load capacity. Best resolution 1 μΩ, RTD temperature sensor simulation feature."
  },
  {
    name: "MEATEST M631 Real-Resistance RTD Simulator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Resistance decade box designed for RTD and other resistance-based sensors' simulation. 0.01°C accuracy and 0.001°C resolution",
    imageUrl: null,
    rank: 14,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "LCR" },
      { key: "Frequency Limit", value: "20 kHz" },
      { key: "Accuracy", value: "0.01°C" },
      { key: "Resolution", value: "0.001°C" },
      { key: "Design", value: "Real-Resistance decade design" },
      { key: "Applications", value: "RTD and resistance-based sensors simulation" }
    ]),
    featuresBenefits: JSON.stringify([
      "RTD simulation capability",
      "Resistance-based sensors simulation",
      "0.01°C accuracy",
      "0.001°C resolution",
      "Real-Resistance decade design",
      "High precision temperature simulation"
    ]),
    applications: JSON.stringify([
      "RTD sensor simulation",
      "Resistance-based sensor testing",
      "Temperature sensor calibration",
      "Industrial temperature measurement",
      "Laboratory standards"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Real-Resistance RTD Simulator",
      "Technology": "Real-Resistance decade design",
      "Accuracy": "0.01°C",
      "Resolution": "0.001°C",
      "Applications": "RTD and resistance-based sensors"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M631 Real-Resistance RTD Simulator is a resistance decade box designed for RTD and other resistance-based sensors' simulation. 0.01°C accuracy and 0.001°C resolution."
  },
  {
    name: "MEATEST M641 Real-Resistance RTD Simulator",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Resistance decade box designed for RTD and other resistance-based sensors' simulation. 0.1°C accuracy and 5W load capacity",
    imageUrl: null,
    rank: 15,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "LCR" },
      { key: "Frequency Limit", value: "20 kHz" },
      { key: "Accuracy", value: "0.1°C" },
      { key: "Load Capacity", value: "5W" },
      { key: "Design", value: "Real-Resistance decade design" },
      { key: "Applications", value: "RTD and resistance-based sensors simulation" }
    ]),
    featuresBenefits: JSON.stringify([
      "RTD simulation capability",
      "Resistance-based sensors simulation",
      "0.1°C accuracy",
      "5W load capacity",
      "Real-Resistance decade design",
      "Temperature sensor simulation"
    ]),
    applications: JSON.stringify([
      "RTD sensor simulation",
      "Resistance-based sensor testing",
      "Temperature sensor calibration",
      "Industrial temperature measurement",
      "Laboratory standards"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Real-Resistance RTD Simulator",
      "Technology": "Real-Resistance decade design",
      "Accuracy": "0.1°C",
      "Capacity": "5W load capacity",
      "Applications": "RTD and resistance-based sensors"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M641 Real-Resistance RTD Simulator is a resistance decade box designed for RTD and other resistance-based sensors' simulation. 0.1°C accuracy and 5W load capacity."
  },
  {
    name: "MEATEST M194 High Resistance Decade",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "High resistance decade with built-in test signal meter for calibration of high resistance meters up to 6 kV",
    imageUrl: null,
    rank: 16,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "U > 1 kV" },
      { key: "Frequency Limit", value: "<100 Hz" },
      { key: "Voltage", value: "Up to 6 kV" },
      { key: "Built-in Test Signal Meter", value: "Yes" },
      { key: "Design", value: "Based on M6xx Real-Resistance decade series" },
      { key: "Short Function", value: "Short current testing" }
    ]),
    featuresBenefits: JSON.stringify([
      "High resistance decade capability",
      "Built-in test signal meter",
      "Up to 6 kV operation",
      "Based on M6xx Real-Resistance decade series",
      "Short function for short current testing",
      "High resistance meter calibration"
    ]),
    applications: JSON.stringify([
      "High resistance meter calibration",
      "High voltage testing",
      "Insulation testing",
      "High resistance measurement",
      "Industrial testing"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "High voltage rated"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "High Resistance Decade",
      "Technology": "Based on M6xx Real-Resistance decade series",
      "Voltage": "Up to 6 kV",
      "Features": "Built-in test signal meter",
      "Functions": "Short current testing"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M194 High Resistance Decade is a high resistance decade with built-in test signal meter for calibration of high resistance meters up to 6 kV. Based on M6xx Real-Resistance decade series with short function for short current testing."
  },
  {
    name: "MEATEST M525 Programmable Capacitance Decade",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Programmable capacitance decade with continuous range from 100 pF to 100 uF. Based on M6xx Real-Resistance decade series great user comfort",
    imageUrl: null,
    rank: 17,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "LCR" },
      { key: "Frequency Limit", value: "20 kHz" },
      { key: "Capacitance Range", value: "100 pF to 100 uF" },
      { key: "Range Type", value: "Continuous" },
      { key: "Design", value: "Based on M6xx Real-Resistance decade series" },
      { key: "User Comfort", value: "Great user comfort" }
    ]),
    featuresBenefits: JSON.stringify([
      "Programmable capacitance decade",
      "Continuous range 100 pF to 100 uF",
      "Based on M6xx Real-Resistance decade series",
      "Great user comfort",
      "High precision capacitance measurement",
      "Easy-to-use interface"
    ]),
    applications: JSON.stringify([
      "Capacitance measurement",
      "LCR meter calibration",
      "Capacitance decade calibration",
      "Component testing",
      "Laboratory use"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "Programmable Capacitance Decade",
      "Technology": "Based on M6xx Real-Resistance decade series",
      "Range": "100 pF to 100 uF continuous",
      "Design": "Programmable decade",
      "Features": "Great user comfort"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M525 Programmable Capacitance Decade is a programmable capacitance decade with continuous range from 100 pF to 100 uF. Based on M6xx Real-Resistance decade series great user comfort."
  },
  {
    name: "MEATEST M109R High Resistance Decade",
    category: "Calibration System",
    subcategory: "Electrical Calibrators",
    shortDescription: "Mechanic high resistance decade with RS232 remote control for voltages up to 5 kV. Internal battery for up to 3 hours of on site calibration",
    imageUrl: null,
    rank: 18,
    homeFeatured: false,
    specifications: JSON.stringify([
      { key: "Type", value: "U > 1 kV" },
      { key: "Frequency Limit", value: "<100 Hz" },
      { key: "Voltage", value: "Up to 5 kV" },
      { key: "Control", value: "RS232 remote control" },
      { key: "Power", value: "Internal battery" },
      { key: "Battery Life", value: "Up to 3 hours on site calibration" }
    ]),
    featuresBenefits: JSON.stringify([
      "Mechanic high resistance decade",
      "RS232 remote control",
      "Up to 5 kV operation",
      "Internal battery power",
      "Up to 3 hours on site calibration",
      "Portable operation"
    ]),
    applications: JSON.stringify([
      "High resistance measurement",
      "High voltage testing",
      "On site calibration",
      "Insulation testing",
      "Field calibration"
    ]),
    certifications: JSON.stringify([
      "ISO 17025 accredited",
      "CE certified",
      "High voltage rated"
    ]),
    imageGallery: JSON.stringify([]),
    technicalDetails: JSON.stringify({
      "System": "High Resistance Decade",
      "Technology": "Mechanic high resistance decade",
      "Voltage": "Up to 5 kV",
      "Control": "RS232 remote control",
      "Power": "Internal battery"
    }),
    catalogPdfUrl: null,
    datasheetPdfUrl: null,
    fullTechnicalInfo: "The MEATEST M109R High Resistance Decade is a mechanic high resistance decade with RS232 remote control for voltages up to 5 kV. Internal battery for up to 3 hours of on site calibration."
  }
];

async function main() {
  console.log('Importing complete MEATEST products from all categories...\n');

  try {
    let createdCount = 0;
    let updatedCount = 0;

    for (const product of meatestCompleteProducts) {
      try {
        // Check if product already exists
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        });

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: product
          });
          updatedCount++;
          console.log(`Updated: ${product.name}`);
        } else {
          // Create new product
          await prisma.product.create({
            data: product
          });
          createdCount++;
          console.log(`Created: ${product.name}`);
        }
      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
      }
    }

    console.log(`\nImport completed successfully!`);
    console.log(`Created: ${createdCount} products`);
    console.log(`Updated: ${updatedCount} products`);
    console.log(`Total processed: ${createdCount + updatedCount} products`);

  } catch (error) {
    console.error('Error during import:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\nComplete MEATEST products import completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Complete MEATEST products import failed:', error);
    process.exit(1);
  }); 