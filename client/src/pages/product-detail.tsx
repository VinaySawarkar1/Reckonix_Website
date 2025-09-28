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

  // Debug: Log the ID being used
  console.log('ProductDetail - ID from params:', id);

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
    queryFn: async () => {
      console.log('Fetching product with ID:', id);
      const response = await fetch(`/api/products/${id}`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched product data:', data);
      return data;
    },
  });

  // Debug: Log the product data
  console.log('ProductDetail - Product data:', product);
  console.log('ProductDetail - Loading:', isLoading);
  console.log('ProductDetail - Error:', error);

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

  if (error) {
    console.error('Product fetch error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h1>
          <p className="text-gray-600 mb-2">There was an error loading the product details.</p>
          <p className="text-gray-500 mb-6 text-sm">Error: {error.message}</p>
          <Button asChild className="bg-[#800000] text-white hover:bg-[#6b0000]">
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isLoading && !product) {
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
      case "Measuring Systems":
        return "bg-green-100 text-green-600";
      case "Testing Systems":
        return "bg-purple-100 text-purple-600";
      case "Software":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Parse all JSON fields if needed with proper validation
  const specifications = (() => {
    try {
      if (Array.isArray(product.specifications)) {
        return product.specifications;
      }
      if (typeof product.specifications === "string") {
        const parsed = JSON.parse(product.specifications || "[]");
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing specifications:', error);
      return [];
    }
  })();

  const featuresBenefits = (() => {
    try {
      if (Array.isArray(product.featuresBenefits)) {
        return product.featuresBenefits;
      }
      if (typeof product.featuresBenefits === "string") {
        const parsed = JSON.parse(product.featuresBenefits || "[]");
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing featuresBenefits:', error);
      return [];
    }
  })();

  const applications = (() => {
    try {
      if (Array.isArray(product.applications)) {
        return product.applications;
      }
      if (typeof product.applications === "string") {
        const parsed = JSON.parse(product.applications || "[]");
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing applications:', error);
      return [];
    }
  })();

  const certifications = (() => {
    try {
      if (Array.isArray(product.certifications)) {
        return product.certifications;
      }
      if (typeof product.certifications === "string") {
        const parsed = JSON.parse(product.certifications || "[]");
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing certifications:', error);
      return [];
    }
  })();
  // Parse imageGallery here and pass as prop
  const imageGallery = (() => {
    try {
      if (Array.isArray(product.imageGallery)) {
        return product.imageGallery;
      }
      if (typeof product.imageGallery === "string") {
        const parsed = JSON.parse(product.imageGallery || "[]");
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing imageGallery:', error);
      return [];
    }
  })();

  // In the component, get all images from product.images (array from backend)
  const images = (() => {
    try {
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images.map((img: any) => {
          if (typeof img === 'string') return img;
          if (img && typeof img.url === 'string' && img.url.startsWith('/uploads/')) {
            return img.url;
          }
          return null;
        }).filter(Boolean);
      }
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        return [product.imageUrl];
      }
      return [];
    } catch (error) {
      console.error('Error processing images:', error);
      return product.imageUrl && product.imageUrl.startsWith('/uploads/') ? [product.imageUrl] : [];
    }
  })();

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
              {product.shortDescription || product.description || product.fullTechnicalInfo}
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
    if (images.length > 1) {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
    }
  }, [images.length]);
  
  if (!images || images.length === 0) {
    return (
      <div className="relative">
        <div className="flex items-center justify-center bg-gray-100 rounded-xl h-[400px]">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-lg">No images available</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <img
          src={`${images[index]}${images[index]?.includes('?') ? '&' : '?'}t=${Date.now()}`}
          alt={productName}
          className="w-full rounded-xl shadow-lg object-contain bg-white max-h-[400px]"
          style={{ maxWidth: 600 }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTUwSDIyNVYyNTBIMTc1VjE1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTE5NSAxNzBIMjA1VjIzMEgxOTVWMTcwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTg1IDE4MEgyMTVWMjIwSDE4NVYxODBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
            target.style.display = 'none';
          }}
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
