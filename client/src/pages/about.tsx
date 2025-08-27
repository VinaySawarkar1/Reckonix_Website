import { motion } from "framer-motion";
import { Building, MapPin, Eye, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/seo";

export default function About() {
  // Fetch team members from API
  const { data: teamMembers = [], isLoading: teamLoading } = useQuery({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await fetch('/api/team');
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      return response.json();
    },
  });

  return (
    <>
      <SEO 
        title="About Reckonix - Precision Engineering Excellence"
        description="Learn about Reckonix's two decades of precision engineering excellence. Leading manufacturer of calibration, testing, and measuring systems."
        keywords="about reckonix, precision engineering, calibration manufacturer, testing systems, measuring instruments, ISO 9001 certified, industrial metrology"
        url="/about"
      />
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
            <h1 className="font-cinzel text-3xl md:text-4xl font-bold mb-6 heading-white">About Reckonix</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Two decades of precision engineering excellence, delivering world-class calibration, testing, and measuring solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Reckonix manufacturing facility" 
                className="rounded-xl shadow-lg w-full h-auto" 
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Reckonix is a leading manufacturer and supplier of Calibration Systems, Testing Systems, and Measuring Instruments. With a strong commitment to quality and innovation, we have established ourselves as a trusted name in the industry. Our products are designed to meet the highest standards of accuracy and reliability, serving a wide range of industries including automotive, aerospace, pharmaceuticals, and manufacturing.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our state-of-the-art manufacturing facility is equipped with advanced technology and a skilled workforce, enabling us to deliver customized solutions to our clients. have a global presence, with a dedicated team providing 24/7 support to our customers.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                At Reckonix, we believe in continuous improvement and strive to exceed customer expectations through our commitment to excellence, integrity, and customer satisfaction. Our mission is to deliver world-class testing, measuring, and calibration systems, ensuring a seamless customer experience and building a strong global presence. We are proud to partner with industry leaders and to be recognized for our innovation, reliability, and service excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">Vision & Mission</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-maroon-50 rounded-xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Subtle geometric background for Vision */}
              <svg className="absolute -top-8 -right-8 w-48 h-48 opacity-20 text-maroon-300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" />
                <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 100h180M100 10v180" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-maroon-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To be the most trusted global partner for Testing, Measuring, and Calibration systems by setting the benchmark for quality and service excellence. We aim to deliver a seamless customer experience and establish a strong presence across 50+ countries, empowering industries to achieve precision, reliability, and continuous improvement.
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-blue-50 rounded-xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Subtle grid background for Mission */}
              <svg className="absolute -bottom-8 -left-8 w-56 h-56 opacity-20 text-blue-300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                {Array.from({length: 10}).map((_, i) => (
                  <path key={`h-${i}`} d={`M0 ${i*20}h200`} stroke="currentColor" strokeWidth="1" />
                ))}
                {Array.from({length: 10}).map((_, i) => (
                  <path key={`v-${i}`} d={`M${i*20} 0v200`} stroke="currentColor" strokeWidth="1" />
                ))}
              </svg>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flag className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    To design, manufacture, and support world-class Testing, Measuring, and Calibration systems that deliver measurable value through uncompromising quality and service excellence.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-left">
                    <li>Innovate with precision-driven engineering and customer-centric design.</li>
                    <li>Provide responsive, expert support across the product lifecycle.</li>
                    <li>Build long-term partnerships through reliability, transparency, and performance.</li>
                    <li>Expand our global footprint while maintaining local agility and trusted service.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section - APPEARS BEFORE LOCATIONS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600">Meet the experts driving innovation at Reckonix</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading team members...</p>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">No team members available.</p>
              </div>
            ) : (
              teamMembers.map((member: any, index: number) => (
                <motion.div 
                  key={member.id}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-maroon-500 font-medium">{member.role}</p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm mt-2">{member.bio}</p>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Locations - APPEARS AFTER TEAM SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600">Strategic locations to serve our global customer base</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">Corporate Office</h3>
                  <p className="text-gray-600 mb-4">
                    Gera's Imperium Gateway, office A-205, opp. Bhosari Metro Station, Nashik Phata,<br />
                    Pune, Maharashtra 411034
                  </p>
                  <p className="text-gray-600 mb-2"><strong>Phone:</strong> 9175240313, 8767431725</p>
                  <p className="text-gray-600 mb-4"><strong>Email:</strong> sales@reckonix.co.in, sales@reckonix.in</p>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                    <iframe
                      title="Corporate Office Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.176837774971!2d73.8149058710421!3d18.611114227750015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9dfa87ebe4d%3A0xe95a3ca7b090d08a!2sReckonix%20(%20Corporate%20office%20)!5e0!3m2!1sen!2sin!4v1752172357866!5m2!1sen!2sin"
                      width="100%"
                      height="180"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <a
                      href="https://maps.app.goo.gl/ReckonixCorporateOffice"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-xs flex items-center mt-2 absolute bottom-2 left-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>



            <motion.div 
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">Manufacturing Unit</h3>
                  <p className="text-gray-600 mb-4">
                    PLOT NO, BG/PAP3, MIDC, MIDC Rd, Bhosari,<br />
                    Pune, Maharashtra 411026
                  </p>
                  <p className="text-gray-600 mb-2"><strong>Phone:</strong> 9175240313, 8767431725</p>
                  <p className="text-gray-600 mb-4"><strong>Email:</strong> sales@reckonix.co.in, sales@reckonix.in</p>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center mb-4">
                    <iframe
                      title="Manufacturing Facility Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.9394956883684!2d73.82740987417216!3d18.62179096607656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9e5c1527d61%3A0x22027655dc385965!2sReckonix%20(%20Manufacturing%20)!5e0!3m2!1sen!2sin!4v1752174210521!5m2!1sen!2sin"
                      width="100%"
                      height="180"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <a
                      href="https://maps.app.goo.gl/ReckonixManufacturing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-500 hover:underline text-xs flex items-center mt-2 absolute bottom-2 left-2"
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
