// Additional SEO Tags for Reckonix - Calibrator Manufacturer
// Targeting product-specific searches to outrank competitors

const manufacturerKeywords = {
  // Product-Specific Keywords (Manufacturing Focus)
  products: [
    // Multifunction Calibrators
    "multifunction calibrator manufacturer", "multifunction calibrator india", "multifunction calibrator supplier",
    "multifunction calibrator exporter", "multifunction calibrator factory", "multifunction calibrator company",
    "multifunction calibrator price", "multifunction calibrator buy", "multifunction calibrator online",
    "multifunction calibrator distributor", "multifunction calibrator dealer", "multifunction calibrator wholesale",
    
    // Torque Wrench Calibrators
    "torque wrench calibrator manufacturer", "torque wrench calibrator india", "torque wrench calibrator supplier",
    "torque wrench calibrator exporter", "torque wrench calibrator factory", "torque wrench calibrator company",
    "torque wrench calibrator price", "torque wrench calibrator buy", "torque wrench calibrator online",
    "torque wrench calibrator distributor", "torque wrench calibrator dealer", "torque wrench calibrator wholesale",
    
    // Tape Scale Calibrators
    "tape scale calibrator manufacturer", "tape scale calibrator india", "tape scale calibrator supplier",
    "tape scale calibrator exporter", "tape scale calibrator factory", "tape scale calibrator company",
    "tape scale calibrator price", "tape scale calibrator buy", "tape scale calibrator online",
    "tape scale calibrator distributor", "tape scale calibrator dealer", "tape scale calibrator wholesale",
    
    // Vision Measuring Machines
    "vision measuring machine manufacturer", "vision measuring machine india", "vision measuring machine supplier",
    "vision measuring machine exporter", "vision measuring machine factory", "vision measuring machine company",
    "vision measuring machine price", "vision measuring machine buy", "vision measuring machine online",
    "vision measuring machine distributor", "vision measuring machine dealer", "vision measuring machine wholesale"
  ],
  
  // Competitor Product Keywords (to outrank them)
  competitorProducts: [
    // Mitutoyo alternatives
    "mitutoyo multifunction calibrator alternative", "mitutoyo torque calibrator alternative",
    "mitutoyo vision measuring machine alternative", "mitutoyo calibrator india alternative",
    "better than mitutoyo calibrator", "mitutoyo calibrator replacement", "mitutoyo calibrator substitute",
    
    // ATQ Metro alternatives
    "atq metro calibrator alternative", "atq metro multifunction calibrator alternative",
    "atq metro torque calibrator alternative", "atq metro calibrator india alternative",
    "better than atq metro calibrator", "atq metro calibrator replacement",
    
    // Octagon alternatives
    "octagon calibrator alternative", "octagon multifunction calibrator alternative",
    "octagon torque calibrator alternative", "octagon calibrator india alternative",
    "better than octagon calibrator", "octagon calibrator replacement",
    
    // Maruti Export alternatives
    "maruti export calibrator alternative", "maruti export multifunction calibrator alternative",
    "maruti export torque calibrator alternative", "maruti export calibrator india alternative",
    "better than maruti export calibrator", "maruti export calibrator replacement",
    
    // Tohnichi alternatives
    "tohnichi torque calibrator alternative", "tohnichi multifunction calibrator alternative",
    "tohnichi calibrator alternative", "tohnichi calibrator india alternative",
    "better than tohnichi calibrator", "tohnichi calibrator replacement",
    
    // Gagelist alternatives
    "gagelist calibrator alternative", "gagelist multifunction calibrator alternative",
    "gagelist torque calibrator alternative", "gagelist calibrator india alternative",
    "better than gagelist calibrator", "gagelist calibrator replacement",
    
    // Zeal Manufacturing alternatives
    "zeal manufacturing calibrator alternative", "zeal manufacturing multifunction calibrator alternative",
    "zeal manufacturing torque calibrator alternative", "zeal manufacturing calibrator india alternative",
    "better than zeal manufacturing calibrator", "zeal manufacturing calibrator replacement",
    
    // Fluke alternatives
    "fluke calibrator alternative", "fluke multifunction calibrator alternative",
    "fluke torque calibrator alternative", "fluke calibrator india alternative",
    "better than fluke calibrator", "fluke calibrator replacement",
    
    // Nagman alternatives
    "nagman calibrator alternative", "nagman multifunction calibrator alternative",
    "nagman torque calibrator alternative", "nagman calibrator india alternative",
    "better than nagman calibrator", "nagman calibrator replacement"
  ],
  
  // Manufacturing & Export Keywords
  manufacturing: [
    "calibrator manufacturer india", "calibrator factory india", "calibrator supplier india",
    "calibrator exporter india", "calibrator company india", "calibrator maker india",
    "precision calibrator manufacturer", "industrial calibrator manufacturer", "laboratory calibrator manufacturer",
    "calibrator manufacturing company", "calibrator production company", "calibrator assembly company",
    "calibrator oem manufacturer", "calibrator odm manufacturer", "calibrator custom manufacturer",
    "calibrator bulk manufacturer", "calibrator wholesale manufacturer", "calibrator retail manufacturer"
  ],
  
  // Product Categories
  categories: [
    "multifunction calibrator", "torque wrench calibrator", "tape scale calibrator", "vision measuring machine",
    "pressure calibrator", "temperature calibrator", "electrical calibrator", "flow calibrator",
    "force calibrator", "mass calibrator", "length calibrator", "angle calibrator",
    "frequency calibrator", "voltage calibrator", "current calibrator", "resistance calibrator",
    "capacitance calibrator", "inductance calibrator", "impedance calibrator", "power calibrator"
  ],
  
  // Industry Applications
  applications: [
    "automotive calibrator", "aerospace calibrator", "pharmaceutical calibrator", "medical device calibrator",
    "electronics calibrator", "telecommunications calibrator", "defense calibrator", "marine calibrator",
    "oil gas calibrator", "petrochemical calibrator", "food beverage calibrator", "textile calibrator",
    "automotive industry calibrator", "aerospace industry calibrator", "pharmaceutical industry calibrator"
  ],
  
  // Technical Specifications
  technical: [
    "high accuracy calibrator", "precision calibrator", "digital calibrator", "analog calibrator",
    "portable calibrator", "benchtop calibrator", "handheld calibrator", "desktop calibrator",
    "iso certified calibrator", "nist traceable calibrator", "ce certified calibrator", "fda approved calibrator",
    "calibrator with certificate", "calibrator with calibration certificate", "calibrator with traceability"
  ]
};

// Generate comprehensive meta tags for manufacturer
function generateManufacturerMetaTags() {
  const allKeywords = [
    ...manufacturerKeywords.products,
    ...manufacturerKeywords.competitorProducts,
    ...manufacturerKeywords.manufacturing,
    ...manufacturerKeywords.categories,
    ...manufacturerKeywords.applications,
    ...manufacturerKeywords.technical
  ];
  
  return {
    title: "Reckonix - Leading Manufacturer of Calibration Systems, Metrology Systems, Testing Systems, Measuring Systems | India",
    description: "Reckonix is India's premier calibrator manufacturer and supplier. We manufacture high-quality multifunction calibrators, torque wrench calibrators, tape scale calibrators, and vision measuring machines. ISO certified manufacturing facility serving automotive, aerospace, pharmaceutical industries worldwide.",
    keywords: allKeywords.join(", "),
    robots: "index, follow",
    canonical: "https://reckonix.co.in",
    ogTitle: "Reckonix - Leading Manufacturer of Calibration Systems, Metrology Systems, Testing Systems, Measuring Systems",
    ogDescription: "Manufacturer of multifunction calibrators, torque wrench calibrators, vision measuring machines. ISO certified factory in India. Exporting worldwide.",
    ogImage: "https://reckonix.co.in/uploads/manufacturing-facility.jpg",
    twitterCard: "summary_large_image",
    additionalMeta: {
      "product:brand": "Reckonix",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:price:amount": "Contact for pricing",
      "product:price:currency": "INR",
      "business:contact_data:street_address": "Manufacturing Facility",
      "business:contact_data:locality": "India",
      "business:contact_data:country_name": "India"
    }
  };
}

module.exports = { generateManufacturerMetaTags, manufacturerKeywords };

