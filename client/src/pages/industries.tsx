import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import CustomerLogo from "../components/customer-logo";

export default function Industries() {
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });
  
  const { data: industries = [] } = useQuery({
    queryKey: ["/api/industries"],
  });
  
  const { data: testimonials = [] } = useQuery({
    queryKey: ["/api/testimonials"],
  });
  
  const customersTyped: any[] = customers as any[];
  const industriesTyped: any[] = industries as any[];
  const testimonialsTyped: any[] = testimonials as any[];


  // DEMO: Add realistic customer entries if none exist (for demo/testing)
  const demoCustomers = [
    {
      id: 'tata',
      name: 'Tata Motors',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Tata_Motors_Logo.svg',
      location: 'Mumbai, India',
      industry: 'Automotive Manufacturing',
      featured: true,
    },
    {
      id: 'drdo',
      name: 'DRDO',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7e/DRDO_India_Logo.svg',
      location: 'New Delhi, India',
      industry: 'Aerospace & Defense',
      featured: true,
    },
    {
      id: 'cipla',
      name: 'Cipla',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Cipla_logo.svg',
      location: 'Mumbai, India',
      industry: 'Pharmaceutical & Biotech',
      featured: true,
    },
    {
      id: 'isro',
      name: 'ISRO',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/ISRO_Logo.svg',
      location: 'Bengaluru, India',
      industry: 'Aerospace & Defense',
      featured: true,
    },
    {
      id: 'reliance',
      name: 'Reliance Industries',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Reliance_Industries_Logo.svg',
      location: 'Mumbai, India',
      industry: 'Oil & Gas',
      featured: true,
    },
    {
      id: 'iitb',
      name: 'IIT Bombay',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6e/IIT_Bombay_Logo.svg',
      location: 'Mumbai, India',
      industry: 'Research Institutions',
      featured: false,
    },
    {
      id: 'bosch',
      name: 'Bosch',
      logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Bosch-logo.svg',
      location: 'Bengaluru, India',
      industry: 'Electronics & Semiconductors',
      featured: false,
    },
  ];
  const allCustomers = customersTyped.length > 0 ? customersTyped : demoCustomers;

  // Group customers by industry
  const customersByIndustry = allCustomers.reduce((acc: any, customer: any) => {
    if (!acc[customer.industry]) {
      acc[customer.industry] = [];
    }
    acc[customer.industry].push(customer);
    return acc;
  }, {} as Record<string, any[]>);

  // Use actual industries from database if available, otherwise fall back to hardcoded icons
  const industryIcons: Record<string, string> = {
    // Aerospace & Defense
    "Aerospace & Defense": "https://cdn-icons-png.flaticon.com/512/3003/3003984.png",
    "Defense": "https://cdn-icons-png.flaticon.com/512/3003/3003984.png",
    
    // Automotive
    "Automotive Manufacturing": "https://cdn-icons-png.flaticon.com/512/3003/3003912.png",
    "Automotive": "https://cdn-icons-png.flaticon.com/512/3003/3003912.png",
    "Automobile": "https://cdn-icons-png.flaticon.com/512/3003/3003912.png",
    
    // Pharmaceutical & Medical
    "Pharmaceutical & Biotech": "https://cdn-icons-png.flaticon.com/512/3003/3003773.png",
    "Pharma & Biomedical": "https://cdn-icons-png.flaticon.com/512/3003/3003773.png",
    "Medical Devices": "https://cdn-icons-png.flaticon.com/512/3003/3003773.png",
    
    // Oil & Gas
    "Oil & Gas": "https://cdn-icons-png.flaticon.com/512/3003/3003820.png",
    
    // Electronics & Technology
    "Electronics & Semiconductors": "https://cdn-icons-png.flaticon.com/512/3003/3003750.png",
    "Electronics": "https://cdn-icons-png.flaticon.com/512/3003/3003750.png",
    
    // Research & Education
    "Research Institutions": "https://cdn-icons-png.flaticon.com/512/3003/3003740.png",
    "Research": "https://cdn-icons-png.flaticon.com/512/3003/3003740.png",
    
    // Manufacturing & Industrial - using more specific icons
    "Manufacturing": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Plastics": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Rubber": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Springs": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Textiles": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Food & Beverage": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png",
    "Power Generation": "https://cdn-icons-png.flaticon.com/512/1998/1998669.png"
  };

  // Helper function to get the best matching icon for an industry
  const getIndustryIcon = (industryName: string): string => {
    // First try exact match
    if (industryIcons[industryName]) {
      return industryIcons[industryName];
    }
    
    // Try case-insensitive match
    const lowerName = industryName.toLowerCase();
    for (const [key, icon] of Object.entries(industryIcons)) {
      if (key.toLowerCase() === lowerName) {
        return icon;
      }
    }
    
    // Try partial match for common terms
    if (lowerName.includes('aerospace') || lowerName.includes('defense')) {
      return industryIcons["Aerospace & Defense"];
    }
    if (lowerName.includes('automotive') || lowerName.includes('automobile')) {
      return industryIcons["Automotive"];
    }
    if (lowerName.includes('pharma') || lowerName.includes('medical') || lowerName.includes('biotech')) {
      return industryIcons["Pharmaceutical & Biotech"];
    }
    if (lowerName.includes('oil') || lowerName.includes('gas')) {
      return industryIcons["Oil & Gas"];
    }
    if (lowerName.includes('electronic') || lowerName.includes('semiconductor')) {
      return industryIcons["Electronics"];
    }
    if (lowerName.includes('research') || lowerName.includes('institution')) {
      return industryIcons["Research Institutions"];
    }
    
    // Default fallback
    return "https://cdn-icons-png.flaticon.com/512/1998/1998669.png";
  };

  // Create customer categories from actual industries in database
  const customerCategories = industriesTyped.length > 0 
    ? industriesTyped.map(industry => ({
        title: industry.name,
        description: industry.description || `Leading ${industry.name.toLowerCase()} companies trust our precision instruments`,
        icon: industry.icon || getIndustryIcon(industry.name), // Use database icon first, fallback to mapping
        customers: customersByIndustry[industry.name] || []
      }))
    : Object.keys(customersByIndustry).map(industry => ({
        title: industry,
        description: `Leading ${industry.toLowerCase()} companies trust our precision instruments`,
        icon: getIndustryIcon(industry),
        customers: customersByIndustry[industry]
      }));


  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#800000] text-white py-6 overflow-hidden">
        {/* Geometric Line Pattern Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" width="100%" height="100%" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g stroke="white" stroke-width="2" opacity="0.5">
            <polyline points="0,100 300,100 400,200 700,200" />
            <polyline points="200,0 500,0 600,100 900,100" />
            <polyline points="400,200 700,200 800,300 1100,300" />
            <polyline points="600,100 900,100 1000,200 1300,200" />
            <polyline points="800,300 1100,300 1200,400 1440,400" />
            <polyline points="1000,200 1300,200 1400,300 1440,300" />
            <polyline points="100,50 400,50 500,150 800,150" />
            <polyline points="300,150 600,150 700,250 1000,250" />
            <polyline points="500,250 800,250 900,350 1200,350" />
            <polyline points="700,50 1000,50 1100,150 1400,150" />
            <polyline points="900,150 1200,150 1300,250 1440,250" />
            <polyline points="1100,250 1400,250 1440,350 1440,350" />
            <polyline points="0,200 200,200 300,300 500,300" />
            <polyline points="200,300 400,300 500,400 700,400" />
            <polyline points="600,350 900,350 1000,400 1200,400" />
          </g>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-6 heading-white">Industries We Serve</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Trusted by leading companies across diverse industries for precision calibration, testing, and measurement solutions
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg mt-8">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">Aerospace & Defense</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">Automotive</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">Pharmaceutical</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">Oil & Gas</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full">Electronics</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Industry Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide specialized calibration and measurement solutions tailored to meet the unique requirements of each industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {category.icon && (category.icon.startsWith('http') || category.icon.startsWith('/uploads/')) ? (
                  <div className="relative w-full h-40">
                    <img 
                      src={category.icon} 
                      alt={`${category.title} icon`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.classList.remove('hidden');
                      }}
                      style={{ opacity: 0 }}
                    />
                    <div className="text-8xl hidden absolute inset-0 flex items-center justify-center">🏭</div>
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                    <div className="text-8xl">{category.icon || '🏭'}</div>
                  </div>
                )}
                <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {category.description}
                </p>
                
                {category.customers.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Trusted by:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {category.customers.slice(0, 4).map((customer: any) => (
                        <div key={customer.id} className="flex items-center space-x-2">
                          <CustomerLogo 
                            name={customer.name}
                            logoUrl={customer.logoUrl}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                    {category.customers.length > 4 && (
                      <p className="text-sm text-gray-500">
                        +{category.customers.length - 4} more companies
                      </p>
                    )}
                  </div>
                )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonialsTyped.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from industry leaders who trust Reckonix for their precision measurement needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonialsTyped.slice(0, 6).map((testimonial: any, index: number) => (
                <motion.div
                  key={testimonial.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
