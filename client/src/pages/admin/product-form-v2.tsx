import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { fetchCategories, Category as CategoryType } from "@/lib/utils";

// Remove hardcoded subcategories. Use dynamic fetch.

// Helper to flatten tree to paths
function getSubcategoryPaths(subs: (string | { name: string; children?: (string | { name: string; children?: string[] })[] })[], parentPath: string[] = []) {
  let paths: string[] = [];
  for (const sub of subs) {
    const name = typeof sub === 'string' ? sub : sub.name;
    const children = typeof sub === 'string' ? [] : sub.children || [];
    const path = [...parentPath, name];
    if (children.length > 0) {
      paths = paths.concat(getSubcategoryPaths(children, path));
    } else {
      paths.push(path.join(' > '));
    }
  }
  return paths;
}

export default function ProductFormV2({
  initialData = {},
  onSubmit,
  loading = false,
  mode = "add"
}: {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
  mode?: "add" | "edit";
}) {
  const [name, setName] = useState(initialData.name || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [subcategory, setSubcategory] = useState(initialData.subcategory || "");
  const [shortDescription, setShortDescription] = useState(initialData.shortDescription || "");
  const [fullTechnicalInfo, setFullTechnicalInfo] = useState(initialData.fullTechnicalInfo || "");
  const [specifications, setSpecifications] = useState(() => {
    if (typeof initialData.specifications === "string") {
      try {
        return JSON.parse(initialData.specifications);
      } catch {
        return [{ key: "", value: "" }];
      }
    }
    return initialData.specifications || [{ key: "", value: "" }];
  });
  const [featuresBenefits, setFeaturesBenefits] = useState(() => {
    if (typeof initialData.featuresBenefits === "string") {
      try {
        return JSON.parse(initialData.featuresBenefits);
      } catch {
        return [""];
      }
    }
    return initialData.featuresBenefits || [""];
  });
  const [applications, setApplications] = useState(() => {
    if (typeof initialData.applications === "string") {
      try {
        return JSON.parse(initialData.applications);
      } catch {
        return [""];
      }
    }
    return initialData.applications || [""];
  });
  const [certifications, setCertifications] = useState(() => {
    if (typeof initialData.certifications === "string") {
      try {
        return JSON.parse(initialData.certifications);
      } catch {
        return [""];
      }
    }
    return initialData.certifications || [""];
  });
  const [technicalDetails, setTechnicalDetails] = useState(initialData.technicalDetails || {
    dimensions: "",
    weight: "",
    powerRequirements: "",
    operatingConditions: "",
    warranty: ""
  });
  const [datasheetPdfUrl, setDatasheetPdfUrl] = useState(initialData.datasheetPdfUrl || "");
  const [catalogPdfUrl, setCatalogPdfUrl] = useState(initialData.catalogPdfUrl || "");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(() => {
    if (mode === "edit" && initialData.images && initialData.images.length > 0) {
      return initialData.images.map((img: any) => img.url || img);
    }
    return [];
  });
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [imageInputMode, setImageInputMode] = useState<"upload" | "url">("upload");
  const [homeFeatured, setHomeFeatured] = useState(initialData.homeFeatured || false);
  const [categories, setCategories] = React.useState<CategoryType[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = React.useState<string[]>([]);
  React.useEffect(() => {
    fetchCategories().then(cats => {
      setCategories(cats);
      // If a category is selected, flatten its subcategories to paths
      const cat = cats.find(c => c.name === category);
      if (cat) setSubcategoryOptions(getSubcategoryPaths(cat.subcategories));
      else setSubcategoryOptions([]);
    });
  }, []);
  React.useEffect(() => {
    // Update subcategory options when category changes
    const cat = categories.find(c => c.name === category);
    if (cat) setSubcategoryOptions(getSubcategoryPaths(cat.subcategories));
    else setSubcategoryOptions([]);
    setSubcategory("");
  }, [category, categories]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  }

  function handleRemoveImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  }

  function handleImageUrlChange(url: string) {
    setImageUrl(url);
    // Clear uploaded files when using URL
    setImageFiles([]);
    setImagePreviews([]);
  }

  // Get current image preview (either from upload or URL)
  const getCurrentImagePreview = () => {
    if (imagePreviews.length > 0) {
      return imagePreviews[0]; // Show first uploaded image
    }
    if (imageUrl) {
      return imageUrl; // Show URL image
    }
    return null;
  }

  function handleAddSpec() {
    setSpecifications([...specifications, { key: "", value: "" }]);
  }
  function handleRemoveSpec(idx: number) {
    setSpecifications(specifications.filter((_: any, i: number) => i !== idx));
  }
  function handleSpecChange(idx: number, field: "key" | "value", value: string) {
    const updated = [...specifications];
    updated[idx][field] = value;
    setSpecifications(updated);
  }

  function handleAddFeature() {
    setFeaturesBenefits([...featuresBenefits, ""]);
  }
  function handleRemoveFeature(idx: number) {
    setFeaturesBenefits(featuresBenefits.filter((_: any, i: number) => i !== idx));
  }
  function handleFeatureChange(idx: number, value: string) {
    const updated = [...featuresBenefits];
    updated[idx] = value;
    setFeaturesBenefits(updated);
  }

  function handleAddApplication() {
    setApplications([...applications, ""]);
  }
  function handleRemoveApplication(idx: number) {
    setApplications(applications.filter((_: any, i: number) => i !== idx));
  }
  function handleApplicationChange(idx: number, value: string) {
    const updated = [...applications];
    updated[idx] = value;
    setApplications(updated);
  }

  function handleAddCertification() {
    setCertifications([...certifications, ""]);
  }
  function handleRemoveCertification(idx: number) {
    setCertifications(certifications.filter((_: any, i: number) => i !== idx));
  }
  function handleCertificationChange(idx: number, value: string) {
    const updated = [...certifications];
    updated[idx] = value;
    setCertifications(updated);
  }

  function handleTechnicalDetailChange(field: string, value: string) {
    setTechnicalDetails({ ...technicalDetails, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !shortDescription.trim() || !fullTechnicalInfo.trim()) {
      alert("Name, Short Description, and Full Technical Info are required.");
      return;
    }
    let parsedTechnicalDetails = technicalDetails;
    if (typeof technicalDetails === "string") {
      try {
        parsedTechnicalDetails = JSON.parse(technicalDetails);
      } catch {
        parsedTechnicalDetails = {
          dimensions: "",
          weight: "",
          powerRequirements: "",
          operatingConditions: "",
          warranty: ""
        };
      }
    }
    const data: any = {
      name,
      category,
      subcategory,
      shortDescription,
      fullTechnicalInfo,
      specifications,
      featuresBenefits,
      applications,
      certifications,
      technicalDetails: parsedTechnicalDetails,
      datasheetPdfUrl,
      catalogPdfUrl,
      homeFeatured,
    };
    
    // Handle image data based on input mode
    if (imageFiles.length > 0) {
      data.images = imageFiles;
    }
    
    // Include existing images that weren't removed (for edit mode)
    if (existingImages.length > 0) {
      data.existingImages = existingImages;
    }
    
    if (imageInputMode === "url" && imageUrl.trim()) {
      data.imageUrl = imageUrl.trim();
    } else if (mode === "edit" && initialData.imageUrl && !imageFiles.length && !imageUrl.trim() && existingImages.length === 0) {
      // Keep existing image URL if no new image is provided in edit mode and no existing images
      data.imageUrl = initialData.imageUrl;
    }
    // If no image is provided and not in edit mode, don't send any image data
    
    onSubmit(data);
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
              <SelectValue />
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
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {subcategoryOptions.map((path) => (
                <SelectItem key={path} value={path}>{path}</SelectItem>
              ))}
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
                    onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))}
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