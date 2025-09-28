// SEO Meta Tags Generator for Reckonix.co.in
// Targeting calibration, measurement, and precision equipment keywords

const seoKeywords = {
  // Core Business Keywords
  calibration: [
    "calibration services", "instrument calibration", "equipment calibration", 
    "precision calibration", "metrology calibration", "calibration lab",
    "calibration certificate", "calibration standards", "calibration equipment",
    "calibration services india", "calibration company", "calibration center"
  ],
  
  // Measurement Equipment
  measurement: [
    "measurement instruments", "precision measurement", "dimensional measurement",
    "metrology equipment", "measuring instruments", "precision tools",
    "measurement solutions", "metrology services", "measurement standards",
    "coordinate measuring machine", "vision measuring machine", "profile projector"
  ],
  
  // Competitor Keywords (from Mitutoyo, ATQ Metro, etc.)
  competitor: [
    "mitutoyo calibration", "atq metro calibration", "octagon calibration",
    "maruti export calibration", "tohnichi torque calibration", "gagelist calibration",
    "zeal manufacturing calibration", "fluke calibration", "nagman calibration",
    "torque wrench calibrator", "multifunction calibrator", "tape scale calibrator"
  ],
  
  // Industry Specific
  industries: [
    "automotive calibration", "aerospace calibration", "pharmaceutical calibration",
    "manufacturing calibration", "quality control calibration", "laboratory calibration",
    "industrial calibration", "medical device calibration", "electronics calibration"
  ],
  
  // Location Based
  location: [
    "calibration services mumbai", "calibration services delhi", "calibration services bangalore",
    "calibration services pune", "calibration services chennai", "calibration services hyderabad",
    "calibration services india", "calibration services gujarat", "calibration services karnataka"
  ]
};

// Generate comprehensive meta tags
function generateMetaTags() {
  const allKeywords = [
    ...seoKeywords.calibration,
    ...seoKeywords.measurement,
    ...seoKeywords.competitor,
    ...seoKeywords.industries,
    ...seoKeywords.location
  ];
  
  return {
    title: "Reckonix - Leading Calibration Services & Precision Measurement Equipment | India's #1 Calibration Lab",
    description: "Reckonix offers world-class calibration services, precision measurement equipment, and metrology solutions. Expert calibration for torque wrenches, multifunction calibrators, vision measuring machines, and more. ISO certified calibration lab serving automotive, aerospace, pharmaceutical industries across India.",
    keywords: allKeywords.join(", "),
    robots: "index, follow",
    canonical: "https://reckonix.co.in",
    ogTitle: "Reckonix - India's Premier Calibration Services & Measurement Solutions",
    ogDescription: "Professional calibration services for precision instruments. Torque calibrators, vision measuring machines, multifunction calibrators. ISO certified lab serving industries nationwide.",
    ogImage: "https://reckonix.co.in/uploads/og-image.jpg",
    twitterCard: "summary_large_image"
  };
}

module.exports = { generateMetaTags, seoKeywords };



