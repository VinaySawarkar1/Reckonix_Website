import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image, GripVertical, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
}

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  fullTechnicalInfo: string;
  specifications: Array<{ key: string; value: string }>;
  featuresBenefits: string[];
  applications: string[];
  certifications: string[];
  imageUrl: string;
  imageGallery: ProductImage[];
  catalogPdfUrl: string;
  datasheetPdfUrl: string;
  homeFeatured: boolean;
  technicalDetails: {
    dimensions: string;
    weight: string;
    powerRequirements: string;
    operatingConditions: string;
    warranty: string;
    compliance: string[];
  };
}

interface ProductFormV3Props {
  initialData?: any;
  mode: "add" | "edit";
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

export default function ProductFormV3({ initialData, mode, onSubmit, onCancel }: ProductFormV3Props) {
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<ProductImage[]>([]);
  
  // SINGLE SOURCE OF TRUTH - only use images array
  const [images, setImages] = useState<ProductImage[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "Calibration Systems",
    subcategory: "",
    shortDescription: "",
    fullTechnicalInfo: "",
    specifications: [{ key: "", value: "" }],
    featuresBenefits: [""],
    applications: [""],
    certifications: [""],
    imageUrl: "",
    imageGallery: [],
    catalogPdfUrl: "",
    datasheetPdfUrl: "",
    technicalDetails: {
      dimensions: "",
      weight: "",
      powerRequirements: "",
      operatingConditions: "",
      warranty: "",
      compliance: []
    },
    homeFeatured: false
  });

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      try {
        // Parse specifications
        const safeSpecs = Array.isArray(initialData.specifications) 
          ? initialData.specifications 
          : (typeof initialData.specifications === 'string' 
              ? JSON.parse(initialData.specifications || '[]') 
              : [{ key: "", value: "" }]);

        // Parse other arrays
        const safeFeatures = Array.isArray(initialData.featuresBenefits) 
          ? initialData.featuresBenefits 
          : (typeof initialData.featuresBenefits === 'string' 
              ? JSON.parse(initialData.featuresBenefits || '[]') 
              : [""]);

        const safeApps = Array.isArray(initialData.applications) 
          ? initialData.applications 
          : (typeof initialData.applications === 'string' 
              ? JSON.parse(initialData.applications || '[]') 
              : [""]);

        const safeCerts = Array.isArray(initialData.certifications) 
          ? initialData.certifications 
          : (typeof initialData.certifications === 'string' 
              ? JSON.parse(initialData.certifications || '[]') 
              : [""]);

        const safeTechDetails = initialData.technicalDetails && typeof initialData.technicalDetails === 'object'
          ? initialData.technicalDetails
          : (typeof initialData.technicalDetails === 'string' 
              ? JSON.parse(initialData.technicalDetails || '{}') 
              : {
                  dimensions: "",
                  weight: "",
                  powerRequirements: "",
                  operatingConditions: "",
                  warranty: "",
                  compliance: []
                });
                
        // Handle images - SINGLE SOURCE OF TRUTH
        let safeImages: ProductImage[] = [];
        
        if (initialData?.images && Array.isArray(initialData.images)) {
          safeImages = initialData.images.map((img: any) => ({
            id: img._id || Math.random().toString(36).substr(2, 9),
            url: typeof img === 'string' ? img : img.url,
            isNew: false
          }));
        } else if (Array.isArray(initialData.imageGallery)) {
          safeImages = initialData.imageGallery.map((img: any) => ({
            id: img.id || Math.random().toString(36).substr(2, 9),
            url: typeof img === 'string' ? img : img.url,
            isNew: false
          }));
        } else if (typeof initialData.imageGallery === 'string') {
          try {
            const parsed = JSON.parse(initialData.imageGallery || '[]');
            if (Array.isArray(parsed)) {
              safeImages = parsed.map((img: any) => ({
                id: img.id || Math.random().toString(36).substr(2, 9),
                url: typeof img === 'string' ? img : img.url,
                isNew: false
              }));
            }
          } catch {
            safeImages = [];
          }
        }
        
        // Final fallback to imageUrl
        if (safeImages.length === 0 && initialData?.imageUrl) {
          safeImages = [{
            id: 'existing-0',
            url: initialData.imageUrl,
            isNew: false
          }];
        }
        
        // Set images as single source of truth
        setImages(safeImages);
        console.log('INIT - images set:', safeImages);
        
        setFormData({
          name: initialData.name || "",
          category: initialData.category || "Calibration Systems",
          subcategory: initialData.subcategory || "",
          shortDescription: initialData.shortDescription || "",
          fullTechnicalInfo: initialData.fullTechnicalInfo || "",
          specifications: safeSpecs,
          featuresBenefits: safeFeatures,
          applications: safeApps,
          certifications: safeCerts,
          imageUrl: initialData.imageUrl || "",
          imageGallery: safeImages, // Keep in sync
          catalogPdfUrl: initialData.catalogPdfUrl || "",
          datasheetPdfUrl: initialData.datasheetPdfUrl || "",
          technicalDetails: safeTechDetails,
          homeFeatured: initialData.homeFeatured === "true" || initialData.homeFeatured === true || false
        });
        
      } catch (error) {
        console.error('Error parsing initial data:', error);
        setFormData({
          name: initialData.name || "",
          category: initialData.category || "Calibration Systems",
          subcategory: initialData.subcategory || "",
          shortDescription: initialData.shortDescription || "",
          fullTechnicalInfo: initialData.fullTechnicalInfo || "",
          specifications: [{ key: "", value: "" }],
          featuresBenefits: [""],
          applications: [""],
          certifications: [""],
          imageUrl: initialData.imageUrl || "",
          imageGallery: [],
          catalogPdfUrl: initialData.catalogPdfUrl || "",
          datasheetPdfUrl: initialData.datasheetPdfUrl || "",
          technicalDetails: {
            dimensions: "",
            weight: "",
            powerRequirements: "",
            operatingConditions: "",
            warranty: "",
            compliance: []
          },
          homeFeatured: false
        });
      } finally {
        setIsInitializing(false);
      }
    } else {
      setIsInitializing(false);
    }
  }, [initialData]);

  // Keep formData.imageGallery in sync with images
  useEffect(() => {
    console.log('USEEFFECT - images changed:', images);
    setFormData(prev => ({
      ...prev,
      imageGallery: images
    }));
  }, [images]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const firstRejection = rejectedFiles[0];
      if (firstRejection.errors[0].code === 'file-too-large') {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive",
        });
      } else if (firstRejection.errors[0].code === 'file-invalid-type') {
        toast({
          title: "Invalid file type",
          description: "Please upload JPEG, PNG, WebP, or GIF images",
          variant: "destructive",
        });
      }
      return;
    }

    const newImages: ProductImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
      isUploading: false,
      uploadProgress: 0
    }));

    setUploadingImages(prev => [...prev, ...newImages]);
    
    // Add to main images array
    setImages(prev => {
      const updated = [...prev, ...newImages];
      console.log('ON_DROP - images after adding new:', updated);
      return updated;
    });
    
    toast({
      title: "Files added",
      description: `${acceptedFiles.length} image(s) added for upload`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDrop(files, []);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    console.log('REMOVING image with ID:', imageId);
    
    // Remove from uploadingImages if it's a new image
    setUploadingImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      console.log('REMOVE - uploadingImages after removal:', updated);
      return updated;
    });
    
    // Remove from main images array
    setImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      console.log('REMOVE - images after removal:', updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === 'specifications' ||
          key === 'featuresBenefits' ||
          key === 'applications' ||
          key === 'certifications' ||
          key === 'technicalDetails'
        ) {
          formDataToSubmit.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null && value !== '') {
          formDataToSubmit.append(key, value);
        }
      });

      // Add existing images for edit mode
      if (mode === "edit") {
        const existingImageUrls = images.filter(img => !img.isNew).map(img => img.url);
        formDataToSubmit.append('existingImages', JSON.stringify(existingImageUrls));
        console.log('EDIT MODE - existingImageUrls:', existingImageUrls);
      }

      // Add imageGallery - use current images array
      formDataToSubmit.append('imageGallery', JSON.stringify(images.map(img => ({
        id: img.id,
        url: img.url,
        isNew: img.isNew
      }))));

      // Add new image files
      uploadingImages.forEach((img) => {
        if (img.file) {
          formDataToSubmit.append('images', img.file);
        }
      });

      // Debug logs
      console.log('SUBMIT - images array:', images);
      console.log('SUBMIT - uploadingImages:', uploadingImages);
      console.log('SUBMIT - existingImageUrls:', images.filter(img => !img.isNew).map(img => img.url));

      await onSubmit(formDataToSubmit);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-6 w-6" />
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Calibration Systems">Calibration Systems</SelectItem>
                    <SelectItem value="Metrology Systems">Metrology Systems</SelectItem>
                    <SelectItem value="Testing Systems">Testing Systems</SelectItem>
                    <SelectItem value="Measuring Systems">Measuring Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subcategory</label>
              <Input
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                placeholder="Enter subcategory"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description *</label>
              <Textarea
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Enter short description"
                rows={3}
                required
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Images</label>
              
              {/* Drag and Drop Area */}
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the images here...</p>
                ) : (
                  <p className="text-gray-600">
                    Drag & drop images here, or click to select files
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, JPEG, WebP, GIF up to 10MB each
                </p>
              </div>

              {/* Alternative file input */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mb-2"
              />
              
              {/* Images Display */}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Images ({images.length}):</p>
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <div key={img.id} className="relative">
                        <img 
                          src={img.url} 
                          alt={`Image ${idx + 1}`} 
                          className="w-20 h-20 object-cover rounded border" 
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          title="Remove image"
                        >
                          ×
                        </button>
                        {img.isNew && (
                          <div className="absolute -bottom-1 -left-1 bg-green-500 text-white text-xs px-1 rounded">
                            NEW
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </>
                ) : (
                  mode === "add" ? "Add Product" : "Update Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
