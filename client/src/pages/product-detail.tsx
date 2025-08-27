import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "../context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import React from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to Quote",
        description: `${product.name} has been added to your quote request.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild className="bg-[#800000] text-white hover:bg-[#6b0000]">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Calibration Systems":
        return "bg-maroon-100 text-maroon-600";
      case "Metrology Systems":
        return "bg-blue-100 text-blue-600";
      case "Measuring Instruments":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Parse all JSON fields if needed
  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : (typeof product.specifications === "string"
        ? JSON.parse(product.specifications || "[]")
        : []);
  const featuresBenefits = Array.isArray(product.featuresBenefits)
    ? product.featuresBenefits
    : (typeof product.featuresBenefits === "string"
        ? JSON.parse(product.featuresBenefits || "[]")
        : []);
  const applications = Array.isArray(product.applications)
    ? product.applications
    : (typeof product.applications === "string"
        ? JSON.parse(product.applications || "[]")
        : []);
  const certifications = Array.isArray(product.certifications)
    ? product.certifications
    : (typeof product.certifications === "string"
        ? JSON.parse(product.certifications || "[]")
        : []);
  const technicalDetails = product.technicalDetails && typeof product.technicalDetails === "string"
    ? JSON.parse(product.technicalDetails || "{}")
    : (product.technicalDetails || {});
  // Parse imageGallery here and pass as prop
  const imageGallery = Array.isArray(product.imageGallery)
    ? product.imageGallery
    : (typeof product.imageGallery === "string"
        ? JSON.parse(product.imageGallery || "[]")
        : []);

  // In the component, get all images from product.images (array from backend)
  const images = product.images && product.images.length > 0
    ? product.images.map((img: any) => img.url)
    : (product.imageUrl ? [product.imageUrl] : []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.nav 
          className="text-sm text-gray-500 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="hover:text-maroon-500 transition-colors">Home</Link>
          {" > "}
          <Link href="/products" className="hover:text-maroon-500 transition-colors">Products</Link>
          {" > "}
          <span className="text-gray-900">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="ghost" asChild className="text-[#800000] hover:text-[#6b0000]">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </motion.div>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageCarousel images={images} productName={product.name} />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <Badge className={getCategoryColor(product.category)}>
                {product.category}
              </Badge>
            </div>
            
            <h1 className="font-cinzel text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {product.fullTechnicalInfo}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={handleAddToCart}
                className="bg-[#800000] text-white px-6 py-3 hover:bg-[#6b0000] transition-all flex items-center justify-center"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Quote
              </Button>
              {product.datasheetPdfUrl ? (
                <Button 
                  variant="outline" 
                  className="border-2 border-[#800000] text-[#800000] px-6 py-3 hover:bg-[#800000] hover:text-white transition-all flex items-center justify-center"
                  onClick={() => window.open(product.datasheetPdfUrl, '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Datasheet
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-300 text-gray-400 px-6 py-3 cursor-not-allowed flex items-center justify-center"
                  disabled
                >
                  <Download className="mr-2 h-4 w-4" />
                  Datasheet Unavailable
                </Button>
              )}
            </div>

            {/* Quick Specs */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Key Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {specifications.slice(0, 4).map((spec, index) => (
                  <div key={index}>
                    <span className="font-medium text-gray-700">{spec.key}:</span>
                    <span className="text-gray-600 ml-2">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabbed Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="w-full justify-start bg-gray-50 p-0 h-auto">
                <TabsTrigger 
                  value="specifications" 
                  className="px-6 py-4 text-sm font-medium data-[state=active]:bg-maroon-50 data-[state=active]:text-maroon-500 data-[state=active]:border-b-2 data-[state=active]:border-maroon-500"
                >
                  Technical Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="px-6 py-4 text-sm font-medium data-[state=active]:bg-maroon-50 data-[state=active]:text-maroon-500 data-[state=active]:border-b-2 data-[state=active]:border-maroon-500"
                >
                  Features & Benefits
                </TabsTrigger>
                <TabsTrigger 
                  value="applications" 
                  className="px-6 py-4 text-sm font-medium data-[state=active]:bg-maroon-50 data-[state=active]:text-maroon-500 data-[state=active]:border-b-2 data-[state=active]:border-maroon-500"
                >
                  Applications
                </TabsTrigger>
                <TabsTrigger 
                  value="certifications" 
                  className="px-6 py-4 text-sm font-medium data-[state=active]:bg-maroon-50 data-[state=active]:text-maroon-500 data-[state=active]:border-b-2 data-[state=active]:border-maroon-500"
                >
                  Certifications
                </TabsTrigger>
                <TabsTrigger 
                  value="technical-details" 
                  className="px-6 py-4 text-sm font-medium data-[state=active]:bg-maroon-50 data-[state=active]:text-maroon-500 data-[state=active]:border-b-2 data-[state=active]:border-maroon-500"
                >
                  Technical Details
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                <TabsContent value="specifications">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">Technical Specifications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Parameter</th>
                          <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-3 text-gray-700">{spec.key}</td>
                            <td className="border border-gray-300 px-4 py-3 text-gray-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="features">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">Features & Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuresBenefits.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-maroon-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-700">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="applications">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">Applications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.map((application, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{application}</h4>
                        <p className="text-gray-600 text-sm">Industry-specific applications and use cases</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="certifications">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">Certifications & Compliance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert, index) => (
                      <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center hover:border-maroon-500 transition-all">
                        <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="w-6 h-6 bg-maroon-500 rounded-full"></div>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{cert}</h4>
                        <p className="text-gray-600 text-sm">Certified compliance standard</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="technical-details">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">Technical Details</h3>
                  {technicalDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {technicalDetails.dimensions && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Dimensions</h4>
                          <p className="text-gray-600">{technicalDetails.dimensions}</p>
                        </div>
                      )}
                      {technicalDetails.weight && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Weight</h4>
                          <p className="text-gray-600">{technicalDetails.weight}</p>
                        </div>
                      )}
                      {technicalDetails.powerRequirements && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Power Requirements</h4>
                          <p className="text-gray-600">{technicalDetails.powerRequirements}</p>
                        </div>
                      )}
                      {technicalDetails.operatingConditions && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Operating Conditions</h4>
                          <p className="text-gray-600">{technicalDetails.operatingConditions}</p>
                        </div>
                      )}
                      {technicalDetails.warranty && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Warranty</h4>
                          <p className="text-gray-600">{technicalDetails.warranty}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No additional technical details available.</p>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const ProductImageCarousel = ({ images, productName }: { images: string[], productName: string }) => {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);
  if (!images.length) return null;
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <img
          src={images[index]}
          alt={productName}
          className="w-full rounded-xl shadow-lg object-contain bg-white max-h-[400px]"
          style={{ maxWidth: 600 }}
        />
      </div>
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}
            aria-label="Previous image"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
            onClick={() => setIndex((prev) => (prev + 1) % images.length)}
            aria-label="Next image"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </>
      )}
    </div>
  );
};
