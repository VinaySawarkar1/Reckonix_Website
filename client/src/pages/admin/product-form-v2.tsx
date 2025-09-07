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
  id?: string;
  url: string;
  file?: File;
  isNew?: boolean;
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

interface ProductFormV2Props {
  initialData?: any;
  mode: "add" | "edit";
  loading: boolean;
  onSubmit: (data: any) => void;
  categories?: Array<{
    id: number;
    name: string;
    subcategories?: Array<{
      id: number;
      name: string;
      children?: Array<{ id: number; name: string }>;
    }>;
  }>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export default function ProductFormV2({ initialData, mode, loading, onSubmit, categories = [] }: ProductFormV2Props) {
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    category: initialData?.category || "Calibration Systems",
    subcategory: initialData?.subcategory || "",
    shortDescription: initialData?.shortDescription || "",
    fullTechnicalInfo: initialData?.fullTechnicalInfo || "",
    specifications: initialData?.specifications || [{ key: "", value: "" }],
    featuresBenefits: initialData?.featuresBenefits || [""],
    applications: initialData?.applications || [""],
    certifications: initialData?.certifications || [""],
    imageUrl: initialData?.imageUrl || "",
    imageGallery: initialData?.imageGallery?.map((img: any) => ({
      id: img.id || Math.random().toString(36).substr(2, 9),
      url: typeof img === 'string' ? img : img.url,
      isNew: false
    })) || [],
    catalogPdfUrl: initialData?.catalogPdfUrl || "",
    datasheetPdfUrl: initialData?.datasheetPdfUrl || "",
    homeFeatured: initialData?.homeFeatured === "true" || initialData?.homeFeatured === true || false,
    technicalDetails: initialData?.technicalDetails || {
      dimensions: "",
      weight: "",
      powerRequirements: "",
      operatingConditions: "",
      warranty: "",
      compliance: []
    }
  });

  // Update form data when initialData changes (prevents blank form on edit)
  useEffect(() => {
    if (initialData) {
      // Console log removed for production
      
      try {
        // Safely parse JSON fields that might be strings
        const safeSpecs = Array.isArray(initialData.specifications) 
          ? initialData.specifications 
          : (typeof initialData.specifications === 'string' 
              ? JSON.parse(initialData.specifications || '[]') 
              : [{ key: "", value: "" }]);
              
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
                
        // Handle images from ProductImage collection (primary) and fallback to imageGallery
        let safeImageGallery: any[] = [];
        if (initialData?.images && Array.isArray(initialData.images)) {
          // Use images from ProductImage collection
          safeImageGallery = initialData.images.map((img: any) => ({
            id: img._id || Math.random().toString(36).substr(2, 9),
            url: typeof img === 'string' ? img : img.url,
            isNew: false
          }));
        } else if (Array.isArray(initialData.imageGallery)) {
          // Fallback to imageGallery
          safeImageGallery = initialData.imageGallery.map((img: any) => ({
            id: img.id || Math.random().toString(36).substr(2, 9),
            url: typeof img === 'string' ? img : img.url,
            isNew: false
          }));
        } else if (typeof initialData.imageGallery === 'string') {
          // Parse JSON string
          try {
            const parsed = JSON.parse(initialData.imageGallery || '[]');
            safeImageGallery = Array.isArray(parsed) ? parsed.map((img: any) => ({
              id: img.id || Math.random().toString(36).substr(2, 9),
              url: typeof img === 'string' ? img : img.url,
              isNew: false
            })) : [];
          } catch {
            safeImageGallery = [];
          }
        }
        
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
          imageGallery: safeImageGallery,
          catalogPdfUrl: initialData.catalogPdfUrl || "",
          datasheetPdfUrl: initialData.datasheetPdfUrl || "",
          technicalDetails: safeTechDetails,
          homeFeatured: initialData.homeFeatured === "true" || initialData.homeFeatured === true || false
        });
        
        // Console log removed for production
      } catch (error) {
        // Console log removed for production
        // Set safe defaults if parsing fails
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
          homeFeatured: initialData.homeFeatured === "true" || initialData.homeFeatured === true || false
        });
      } finally {
        setIsInitializing(false);
      }
    } else {
      setIsInitializing(false);
    }
  }, [initialData]);

  const [uploadingImages, setUploadingImages] = useState<ProductImage[]>([]);

  // Extract individual state variables for JSX
  const name = formData.name;
  const category = formData.category;
  const subcategory = formData.subcategory;
  const shortDescription = formData.shortDescription;
  const fullTechnicalInfo = formData.fullTechnicalInfo;
  const specifications = formData.specifications;
  const featuresBenefits = formData.featuresBenefits;
  const applications = formData.applications;
  const certifications = formData.certifications;
  const technicalDetails = formData.technicalDetails;
  const datasheetPdfUrl = formData.datasheetPdfUrl;
  const catalogPdfUrl = formData.catalogPdfUrl;
  const homeFeatured = formData.homeFeatured;

  // Use dynamic categories from props
  const subcategoryOptions = React.useMemo(() => {
    if (!category || !categories.length) return [];
    
    const selectedCategory = categories.find(cat => cat.name === category);
    if (!selectedCategory || !selectedCategory.subcategories) return [];
    
    // Flatten nested subcategories into a simple array
    const flattenSubcategories = (subs: any[]): string[] => {
      return subs.reduce((acc: string[], sub: any) => {
        acc.push(sub.name);
        if (sub.children && sub.children.length > 0) {
          acc.push(...flattenSubcategories(sub.children));
        }
        return acc;
      }, []);
    };
    
    return flattenSubcategories(selectedCategory.subcategories);
  }, [category, categories]);

  // Handlers
  const setName = (value: string) => setFormData(prev => ({ ...prev, name: value }));
  const setCategory = (value: string) => setFormData(prev => ({ ...prev, category: value }));
  const setSubcategory = (value: string) => setFormData(prev => ({ ...prev, subcategory: value }));
  const setShortDescription = (value: string) => setFormData(prev => ({ ...prev, shortDescription: value }));
  const setFullTechnicalInfo = (value: string) => setFormData(prev => ({ ...prev, fullTechnicalInfo: value }));
  const setDatasheetPdfUrl = (value: string) => setFormData(prev => ({ ...prev, datasheetPdfUrl: value }));
  const setCatalogPdfUrl = (value: string) => setFormData(prev => ({ ...prev, catalogPdfUrl: value }));
  const setHomeFeatured = (value: boolean) => setFormData(prev => ({ ...prev, homeFeatured: value }));

  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleRemoveSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      featuresBenefits: prev.featuresBenefits.map((feature, i) =>
        i === index ? value : feature
      )
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      featuresBenefits: prev.featuresBenefits.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      featuresBenefits: [...prev.featuresBenefits, ""]
    }));
  };

  const handleApplicationChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications.map((app: string, i: number) =>
        i === index ? value : app
      )
    }));
  };

  const handleRemoveApplication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleAddApplication = () => {
    setFormData(prev => ({
      ...prev,
      applications: [...prev.applications, ""]
    }));
  };

  const handleCertificationChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert: string, i: number) =>
        i === index ? value : cert
      )
    }));
  };

  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleAddCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };

  const handleTechnicalDetailChange = (field: keyof typeof technicalDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      technicalDetails: { ...prev.technicalDetails, [field]: value }
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
        isNew: true
      }));
      setUploadingImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadingImages(prev => prev.filter((_, i) => i !== index));
  };

  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Populate existing images from initialData
  useEffect(() => {
    // Console log removed for production
    
    let images: string[] = [];
    
    // First, try to get images from the 'images' field (from ProductImage collection)
    if (initialData?.images && Array.isArray(initialData.images)) {
      images = initialData.images.map((img: any) => {
        if (typeof img === 'string') return img;
        if (img && typeof img.url === 'string') return img.url;
        return null;
      }).filter(Boolean);
      // Console log removed for production
    }
    
    // Fallback to imageGallery if no images found
    if (images.length === 0 && initialData?.imageGallery && Array.isArray(initialData.imageGallery)) {
      images = initialData.imageGallery.map((img: any) => {
        if (typeof img === 'string') return img;
        if (img && typeof img.url === 'string') return img.url;
        return null;
      }).filter(Boolean);
      // Console log removed for production
    }
    
    // Final fallback to imageUrl
    if (images.length === 0 && initialData?.imageUrl) {
      images = [initialData.imageUrl];
      // Console log removed for production
    }
    
    // Console log removed for production
    setExistingImages(images);
    
    // Also update formData.imageGallery to keep them in sync
    setFormData(prev => ({
      ...prev,
      imageGallery: images.map((url, index) => ({
        id: `existing-${index}`,
        url,
        isNew: false
      }))
    }));
  }, [initialData]);

  const imagePreviews: string[] = uploadingImages.map(img => img.url);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
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

    // Process accepted files
    const newImages: ProductImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      isNew: true,
      isUploading: false,
      uploadProgress: 0
    }));

    setUploadingImages(prev => [...prev, ...newImages]);
    
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
    maxSize: MAX_FILE_SIZE,
    multiple: true
  });

  const removeImage = (imageId: string, isNew: boolean) => {
    if (isNew) {
      setUploadingImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setFormData(prev => ({
        ...prev,
        imageGallery: prev.imageGallery.filter(img => img.id !== imageId)
      }));
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayFieldChange = (field: 'specifications' | 'featuresBenefits' | 'applications' | 'certifications', index: number, value: any) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'specifications' | 'featuresBenefits' | 'applications' | 'certifications') => {
    setFormData(prev => {
      const defaultValue = field === 'specifications' ? { key: "", value: "" } : "";
      return { ...prev, [field]: [...prev[field], defaultValue] };
    });
  };

  const removeArrayItem = (field: 'specifications' | 'featuresBenefits' | 'applications' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Console log removed for production
      // Console log removed for production
      // Console log removed for production
      
      const formDataToSubmit = new FormData();

      // Add all product data
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

      // Add existing images for edit mode (even if empty, to preserve state)
      if (mode === "edit") {
        formDataToSubmit.append(
          'existingImages',
          JSON.stringify(existingImages)
        );
      }

      // Add image gallery as JSON (for backward compatibility)
      formDataToSubmit.append(
        'imageGallery',
        JSON.stringify(
          formData.imageGallery.map((img) => ({
            id: img.id,
            url: img.url,
          }))
        )
      );

                 // Add new images files to formData
           uploadingImages.forEach((img) => {
             if (img.file) {
               formDataToSubmit.append('images', img.file); // Changed from 'newImages' to 'images' to match backend
             }
           });

      // Debug: Log what's being sent
      // Console log removed for production
      for (let [key, value] of formDataToSubmit.entries()) {
        // Console log removed for production
      }

      // Call onSubmit with formDataToSubmit
      await onSubmit(formDataToSubmit);
    } catch (error) {
      // Console log removed for production
      toast({
        title: 'Error',
        description: 'Failed to submit product form. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="homeFeatured"
            checked={homeFeatured}
            onChange={e => setHomeFeatured(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="homeFeatured" className="text-sm">Show on Home Page</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select value={category} onValueChange={value => { setCategory(value); setSubcategory(""); }}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <Select
            value={subcategory || ""}
            onValueChange={value => setSubcategory(value)}
            disabled={!category}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={category ? "Select a subcategory" : "Select a category first"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {subcategoryOptions.length > 0 ? (
                subcategoryOptions.map((path) => (
                <SelectItem key={path} value={path}>{path}</SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>No subcategories available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea value={shortDescription} onChange={e => setShortDescription(e.target.value)} placeholder="Brief product description" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Full Technical Information</label>
        <Textarea value={fullTechnicalInfo} onChange={e => setFullTechnicalInfo(e.target.value)} placeholder="Detailed technical information" rows={4} />
      </div>
      {/* Specifications */}
      <div>
        <label className="block text-sm font-medium mb-2">Technical Specifications</label>
        {specifications.map((spec: { key: string; value: string }, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input value={spec.key} onChange={e => handleSpecChange(idx, "key", e.target.value)} placeholder="Parameter" />
            <Input value={spec.value} onChange={e => handleSpecChange(idx, "value", e.target.value)} placeholder="Specification" />
            <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveSpec(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddSpec}>Add Specification</Button>
      </div>
      {/* Features & Benefits */}
      <div>
        <label className="block text-sm font-medium mb-2">Features & Benefits</label>
        {featuresBenefits.map((feature: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} placeholder="Feature or Benefit" />
            <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveFeature(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>Add Feature</Button>
      </div>
      {/* Applications */}
      <div>
        <label className="block text-sm font-medium mb-2">Applications</label>
        {applications.map((app: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input value={app} onChange={e => handleApplicationChange(idx, e.target.value)} placeholder="Application" />
            <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveApplication(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddApplication}>Add Application</Button>
      </div>
      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium mb-2">Certifications</label>
        {certifications.map((cert: string, idx: number) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input value={cert} onChange={e => handleCertificationChange(idx, e.target.value)} placeholder="Certification" />
            <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveCertification(idx)}>
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={handleAddCertification}>Add Certification</Button>
      </div>
      {/* Technical Details */}
      <div>
        <label className="block text-sm font-medium mb-2">Technical Details</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input value={technicalDetails.dimensions} onChange={e => handleTechnicalDetailChange("dimensions", e.target.value)} placeholder="Dimensions" />
          <Input value={technicalDetails.weight} onChange={e => handleTechnicalDetailChange("weight", e.target.value)} placeholder="Weight" />
          <Input value={technicalDetails.powerRequirements} onChange={e => handleTechnicalDetailChange("powerRequirements", e.target.value)} placeholder="Power Requirements" />
          <Input value={technicalDetails.operatingConditions} onChange={e => handleTechnicalDetailChange("operatingConditions", e.target.value)} placeholder="Operating Conditions" />
          <Input value={technicalDetails.warranty} onChange={e => handleTechnicalDetailChange("warranty", e.target.value)} placeholder="Warranty" />
        </div>
      </div>
      {/* Datasheet PDF URL */}
      <div>
        <label className="block text-sm font-medium mb-2">Datasheet PDF URL</label>
        <Input
          value={datasheetPdfUrl}
          onChange={e => setDatasheetPdfUrl(e.target.value)}
          placeholder="https://example.com/datasheet.pdf"
        />
      </div>
      {/* Catalog PDF URL */}
      <div>
        <label className="block text-sm font-medium mb-2">Catalog PDF URL</label>
        <Input value={catalogPdfUrl} onChange={e => setCatalogPdfUrl(e.target.value)} placeholder="https://example.com/catalog.pdf" />
      </div>
      {/* Product Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images (Multiple)</label>

        {/* Drag and Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 mb-4 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
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

        {/* Alternative file input for browsers without drag-drop support */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mb-2"
        />
        
        {/* Existing Images (Edit Mode) */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((img, idx) => (
                <div key={`existing-${idx}`} className="relative">
                  <img 
                    src={img} 
                    alt={`Existing ${idx + 1}`} 
                    className="w-20 h-20 object-cover rounded border" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setExistingImages(prev => prev.filter((_, i) => i !== idx));
                      // Also remove from formData.imageGallery
                      setFormData(prev => ({
                        ...prev,
                        imageGallery: prev.imageGallery.filter((_, i) => i !== idx)
                      }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* New Image Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">New Images:</p>
            <div className="flex gap-2 flex-wrap">
              {imagePreviews.map((img, idx) => (
                <div key={`new-${idx}`} className="relative">
                  <img 
                    src={img} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-20 h-20 object-cover rounded border" 
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
          {mode === "edit" ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
} 
