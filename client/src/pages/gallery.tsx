import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Share2, Camera, Users, Calendar, Building } from "lucide-react";

const API_URL = "/api/gallery";

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  description?: string;
  section: string;
  date?: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all images from backend
  const fetchImages = async () => {
    try {
      const sections = ["premises", "events", "others"];
      const allImages: GalleryImage[] = [];
      
      for (const section of sections) {
        const res = await fetch(`${API_URL}?section=${section}`);
        const data = await res.json();
        const sectionImages = data.map((img: any) => ({
          ...img,
          section,
          title: img.title || `${section.charAt(0).toUpperCase() + section.slice(1)} Image`,
          description: img.description || `Reckonix ${section} showcase`,
          date: img.date || new Date().toISOString().split('T')[0]
        }));
        allImages.push(...sectionImages);
      }
      
      setImages(allImages);
      setFilteredImages(allImages);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Filter images based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.section === activeFilter));
    }
  }, [activeFilter, images]);

  const filters = [
    { key: "all", label: "All Images", icon: Camera },
    { key: "premises", label: "Company Premises", icon: Building },
    { key: "events", label: "Events & Exhibitions", icon: Calendar },
    { key: "others", label: "Other Posts", icon: Users },
  ];

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const downloadImage = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.title || 'reckonix-gallery-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.title || 'Reckonix Gallery',
          text: image.description || 'Check out this image from Reckonix',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-maroon-600 to-maroon-800 text-white py-20 overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Gallery
            <span className="block text-2xl md:text-3xl font-light mt-2">Capturing Excellence in Precision</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-maroon-100 leading-relaxed">
            Explore our world-class facilities, exciting events, and the people behind Reckonix's success
          </p>
        </div>
        
        {/* Decorative Wave */}
        <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 100 16" preserveAspectRatio="none">
          <path d="M0,16 Q25,8 50,16 T100,16 L100,16 L0,16 Z" fill="#f9fafb" />
        </svg>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    activeFilter === filter.key
                      ? "bg-maroon-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || "Gallery Image"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                      <p className="text-sm text-gray-200 line-clamp-2">{image.description}</p>
                      {image.date && (
                        <p className="text-xs text-gray-300 mt-2">{new Date(image.date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                        className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareImage(image);
                        }}
                        className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Images Found</h3>
                <p className="text-gray-500">No images available for this category at the moment.</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title || "Gallery Image"}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-200 mb-2">{selectedImage.description}</p>
                {selectedImage.date && (
                  <p className="text-gray-300 text-sm">{new Date(selectedImage.date).toLocaleDateString()}</p>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => downloadImage(selectedImage)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => shareImage(selectedImage)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 