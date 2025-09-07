import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import CustomerLogo from "../components/customer-logo";
import { Building, Factory, Phone, Mail, MapPin } from "lucide-react";

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
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
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

      {/* Get in Touch Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to discuss your calibration and testing needs? We're here to help you find the perfect solution for your industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="font-cinzel text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                {/* Corporate Office */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Corporate Office</h4>
                    <p className="text-gray-600 mb-2">
                      Gera's Imperium Gateway, office A-205, opp. Bhosari Metro Station, Nashik Phata,<br />
                      Pune, Maharashtra 411034
                    </p>
                    <p className="text-gray-600"><Phone className="inline h-4 w-4 mr-1" /> 9175240313, 8767431725</p>
                    <p className="text-gray-600"><Mail className="inline h-4 w-4 mr-1" /> sales@reckonix.co.in, sales@reckonix.in</p>
                    <p className="text-gray-600 mb-2"><strong>GST No.:</strong> 27ABGFR0875B1ZA</p>
                    <a
                      href="https://maps.app.goo.gl/3Qw2Qw2Qw2Qw2Qw2A"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-sm flex items-center mt-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>

                {/* Manufacturing Facility */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <Factory className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">Manufacturing Facility</h4>
                    <p className="text-gray-600 mb-2">
                      Plot No. 1, Survey No. 1/1, Near Bhosari MIDC,<br />
                      Pune, Maharashtra 411026
                    </p>
                    <p className="text-gray-600"><Phone className="inline h-4 w-4 mr-1" /> 9175240313</p>
                    <p className="text-gray-600"><Mail className="inline h-4 w-4 mr-1" /> manufacturing@reckonix.co.in</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="font-cinzel text-2xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent">
                      <option value="">Select your industry</option>
                      <option value="aerospace">Aerospace & Defense</option>
                      <option value="automotive">Automotive Manufacturing</option>
                      <option value="pharmaceutical">Pharmaceutical & Biotech</option>
                      <option value="oil-gas">Oil & Gas</option>
                      <option value="electronics">Electronics & Semiconductors</option>
                      <option value="research">Research Institutions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                      placeholder="Tell us about your calibration and testing requirements..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-maroon-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-maroon-600 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
            </div>
          </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
