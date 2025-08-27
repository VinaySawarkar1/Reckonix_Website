import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import CustomerLogo from "../components/customer-logo";

export default function Customers() {
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
    "Aerospace & Defense": "✈️",
    "Automotive Manufacturing": "🚗", 
    "Pharmaceutical & Biotech": "🧬",
    "Oil & Gas": "⚡",
    "Electronics & Semiconductors": "💻",
    "Research Institutions": "🔬"
  };

  // Create customer categories from actual industries in database
  const customerCategories = industriesTyped.length > 0 
    ? industriesTyped.map(industry => ({
        title: industry.name,
        description: `Leading ${industry.name.toLowerCase()} companies trust our precision instruments`,
        icon: industry.icon || industryIcons[industry.name] || "🏭",
        customers: customersByIndustry[industry.name] || []
      }))
    : Object.keys(customersByIndustry).map(industry => ({
        title: industry,
        description: `Leading ${industry.toLowerCase()} companies trust our precision instruments`,
        icon: industryIcons[industry] || "🏭",
        customers: customersByIndustry[industry]
      }));

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-[#800000] text-white py-16 overflow-hidden">
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
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-6 heading-white">Our Industries</h1>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              Leading industries trust our precision instruments and calibration systems
            </p>
          </motion.div>
        </div>
      </section>

      {/* Customer Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-lg text-gray-600">Our solutions span across diverse industries and applications</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerCategories.map((category, index) => (
              <motion.div 
                key={category.title}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-cinzel text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">What Industry Professionals Say</h2>
            <p className="text-lg text-gray-600">Testimonials from industry leaders across various sectors</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsTyped.length > 0 ? (
              testimonialsTyped.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-lg p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="text-maroon-500 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No testimonials available yet.</p>
                <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-maroon-500 text-white overflow-hidden">
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
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold mb-6">Partner with Leading Industries</h2>
            <p className="text-xl text-gray-200 mb-8">
              Join the network of industries that rely on Reckonix for precision calibration and testing solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all transform hover:scale-105 inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us Today
              </motion.a>
              <motion.a
                href="/products"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-maroon-500 transition-all inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Products
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
