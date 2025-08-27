import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "../../components/product-card";
import SEO from "../../components/seo";
import { Gauge, Thermometer, Zap, Settings, Shield, Clock, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "../../../../shared/schema";

export default function MultifunctionCalibrator() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const multifunctionCalibrators = products.filter((product: Product) => 
    product.category === "Calibration System" && 
    (product.subcategory?.includes("Multifunction") || 
     product.name.toLowerCase().includes("multifunction") ||
     product.name.toLowerCase().includes("calibrator"))
  );

  const features = [
    {
      icon: Gauge,
      title: "High Precision",
      description: "Accurate calibration with ±0.01% precision for industrial applications"
    },
    {
      icon: Thermometer,
      title: "Multi-Parameter",
      description: "Calibrate temperature, pressure, electrical, and process instruments"
    },
    {
      icon: Zap,
      title: "Advanced Technology",
      description: "State-of-the-art calibration technology with intelligent software"
    },
    {
      icon: Shield,
      title: "ISO Certified",
      description: "calibration equipment for quality assurance"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock technical support and calibration services"
    },
    {
      icon: MapPin,
      description: "Comprehensive service network across India with local support"
    }
  ];

  const applications = [
    "Process Instrument Calibration",
    "Temperature Sensor Calibration", 
    "Pressure Transmitter Calibration",
    "Electrical Meter Calibration",
    "Industrial Automation Calibration",
    "Quality Control Laboratories",
    "Research & Development",
    "Manufacturing Industries"
  ];

  return (
    <>
      <SEO 
        title="Multifunction Calibrators | Reckonix - Precision Industrial Calibration"
        description="High-precision multifunction calibrators for industrial applications. Advanced calibration equipment for process instruments, temperature, pressure, and electrical measurements. ISO certified calibration solutions with 24/7 support across India."
        keywords="multifunction calibrator, industrial calibrator, process calibrator, calibration equipment, precision calibrator, temperature calibrator, pressure calibrator, electrical calibrator, multifunction calibrator India, industrial calibration equipment"
        url="/products/multifunction-calibrator"
        type="product"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-[#800000] text-white py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-6">
                Multifunction Calibrators
              </h1>
              <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
                High-precision multifunction calibrators for industrial applications. Advanced calibration equipment for process instruments, temperature, pressure, and electrical measurements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-yellow-500 text-black hover:bg-yellow-400">
                  <Link href="/contact">Get Quote</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-maroon-500">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">
                Why Choose Reckonix Multifunction Calibrators?
              </h2>
              <p className="text-lg text-gray-600">
                Advanced calibration technology with precision engineering and comprehensive support
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="bg-gray-50 rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <feature.icon className="w-12 h-12 text-maroon-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">
                Industrial Applications
              </h2>
              <p className="text-lg text-gray-600">
                Versatile calibration solutions for diverse industrial requirements
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {applications.map((application, index) => (
                <motion.div 
                  key={application}
                  className="bg-white rounded-lg p-4 text-center shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <p className="text-gray-800 font-medium">{application}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">
                Our Multifunction Calibrators
              </h2>
              <p className="text-lg text-gray-600">
                High-precision calibration equipment for industrial applications
              </p>
            </motion.div>

            {multifunctionCalibrators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {multifunctionCalibrators.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-500 text-lg">Multifunction calibrators coming soon!</p>
                <Button asChild className="mt-4">
                  <Link href="/contact">Contact Us for Details</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-maroon-500 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl font-bold mb-6">
                Ready to Upgrade Your Calibration Process?
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Get expert consultation and competitive quotes for your multifunction calibration needs. 
                Our team is ready to help you find the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-yellow-500 text-black hover:bg-yellow-400">
                  <Link href="/contact">Request Quote</Link>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-maroon-500">
                  <Link href="/contact">Talk to Expert</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
} 