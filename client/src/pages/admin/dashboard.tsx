import React, { useReducer, useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Package, 
  FileText, 
  MessageSquare, 
  Users,
  Eye,
  Plus,
  Download,
  LogOut,
  Edit,
  Trash2,
  Search,
  X,
  FolderOpen,
  GripVertical,
  UserPlus,
  Star
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest, apiRequestWithFiles } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Product, QuoteRequest, ContactMessage } from "../../../../shared/schema";
import ProductFormV2 from "./product-form-v2";
import CategoryManagement from "./category-management";
import ProductReorder from "./product-reorder";

// Subcategories mapping for product categories
const subcategories: Record<string, string[]> = {
  "Calibration Systems": [
    "Dimension Calibrators",
    "Electrical Calibrators",
    "Thermal Calibrator",
    "Pressure Calibrator",
    "Mass and Volume",
    "Flow Calibrator"
  ],
  "Metrology Systems": [
    "Universal Testing Machines",
    "Compression Testing Machines",
    "Tensile Testing Machines",
    "Hardness Testing Machines",
    "Impact Testing Machines",
    "Fatigue Testing Machines",
    "Torsion Testing Machines",
    "Spring Testing Machines",
    "Bend Testing Machines",
    "Shear Testing Machines",
    "Peel Testing Machines",
    "Custom Testing Solutions"
  ],
  "Measuring Systems": [
    "Coordinate Measuring Machines (CMM)",
    "Optical Measuring Systems",
    "Laser Measuring Systems",
    "Digital Calipers",
    "Digital Micrometers",
    "Height Gauges",
    "Surface Roughness Testers",
    "Profile Projectors",
    "Toolmakers Microscopes",
    "Gauge Blocks",
    "Dial Indicators",
    "Digital Indicators",
    "Angle Measuring Instruments",
    "Thickness Gauges",
    "Roundness Testers",
    "Flatness Testers",
    "Straightness Testers"
  ],
  // Add more categories and subcategories as needed
};

// Define initialProduct outside the component for stable reference
const initialProduct = {
  name: "",
  category: "Calibration Systems" as const,
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
  }
};

function productReducer(state, action) {
  return { ...state, [action.field]: action.value };
}

const jobTypeOptions = [
  'Full Time',
  'Part Time',
  'Contract',
  'Internship',
  'Temporary',
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, dispatchNewProduct] = useReducer(productReducer, initialProduct);

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingSelectedFiles, setEditingSelectedFiles] = useState<File[]>([]);

  const [showAddEventDialog, setShowAddEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    imageUrl: "",
    eventDate: "",
    published: true,
    // New fields for detailed event page
    content: "",
    location: "",
    duration: "",
    attendees: "",
    registrationUrl: "",
    tags: "",
    featured: false,
    slug: ""
  });

  const [mainCatalog, setMainCatalog] = useState({
    title: "Main Product Catalog 2024",
    description: "Complete product specifications and technical details",
    pdfUrl: "",
    fileSize: ""
  });

  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    logoUrl: string;
    category: string;
    description: string;
    website: string;
    industryId: number | null;
    featured: boolean;
    location: string;
  }>(
    {
      name: "",
      logoUrl: "",
      category: "",
      description: "",
      website: "",
      industryId: null,
      featured: false,
      location: ""
    }
  );

  const [reorderLoading, setReorderLoading] = useState(false);

  const [catalogUploading, setCatalogUploading] = useState(false);
  const [catalogUploadError, setCatalogUploadError] = useState("");
  const catalogFileInputRef = useRef<HTMLInputElement>(null);

  const [editingJob, setEditingJob] = useState(null);

  const [form, setForm] = useState({
    title: '',
    location: '',
    requirements: '',
    description: '',
    type: jobTypeOptions[0],
    experience: '',
    salary: '',
  });

  const [message, setMessage] = useState('');

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // Team management state
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    role: "",
    bio: "",
    photo: null
  });

  // 1. Add state for industries
  const [industries, setIndustries] = useState([]);
  const [showAddIndustryDialog, setShowAddIndustryDialog] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [newIndustry, setNewIndustry] = useState({ name: '', description: '', icon: '', rank: 0 });

  // 2. Add state for testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [showAddTestimonialDialog, setShowAddTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ 
    name: '', 
    role: '', 
    company: '', 
    content: '', 
    rating: 5, 
    featured: false 
  });

  // 2. Fetch industries
  useEffect(() => {
    fetch('/api/industries')
      .then(res => res.json())
      .then(setIndustries);
  }, []);

  // 3. Fetch testimonials
  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(setTestimonials);
  }, []);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(setJobs);
  }, []);

  useEffect(() => {
    fetch('/api/applications')
      .then(res => res.json())
      .then(setApplications);
  }, []);

  // Fetch team members
  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(setTeamMembers);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation("/admin/login");
    }
  }, [user, setLocation]);

  // Industry CRUD handlers
  const handleAddIndustry = async () => {
    const res = await fetch('/api/industries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIndustry),
    });
    if (res.ok) {
      setShowAddIndustryDialog(false);
      setNewIndustry({ name: '', description: '', icon: '', rank: 0 });
      setIndustries(await (await fetch('/api/industries')).json());
    }
  };

  const handleEditIndustry = (industry: any) => setEditingIndustry(industry);

  const handleUpdateIndustry = async () => {
    if (!editingIndustry) return;
    const res = await fetch(`/api/industries/${editingIndustry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingIndustry),
    });
    if (res.ok) {
      setEditingIndustry(null);
      setIndustries(await (await fetch('/api/industries')).json());
    }
  };

  const handleDeleteIndustry = async (id: number) => {
    if (!window.confirm('Delete this industry?')) return;
    const res = await fetch(`/api/industries/${id}`, { method: 'DELETE' });
    if (res.ok) setIndustries(await (await fetch('/api/industries')).json());
  };

  // Testimonial CRUD handlers
  const handleAddTestimonial = async () => {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTestimonial),
    });
    if (res.ok) {
      setShowAddTestimonialDialog(false);
      setNewTestimonial({ name: '', role: '', company: '', content: '', rating: 5, featured: false });
      setTestimonials(await (await fetch('/api/testimonials')).json());
    }
  };

  const handleEditTestimonial = (testimonial: any) => setEditingTestimonial(testimonial);

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return;
    const res = await fetch(`/api/testimonials/${editingTestimonial.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingTestimonial),
    });
    if (res.ok) {
      setEditingTestimonial(null);
      setTestimonials(await (await fetch('/api/testimonials')).json());
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) setTestimonials(await (await fetch('/api/testimonials')).json());
  };

  // Fetch data
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const safeProducts = Array.isArray(products) ? products : [];

  const { data: quotes = [] } = useQuery<QuoteRequest[]>({
    queryKey: ["/api/quotes"],
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["/api/messages"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/website-views"],
  });

  const { data: productViews = [] } = useQuery({
    queryKey: ["/api/analytics/product-views"],
  });

  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
  });

  const { data: catalog } = useQuery({
    queryKey: ["/api/catalog/main-catalog"],
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  // Export functionality
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportQuotes = () => {
    const exportData = quotes.map(quote => {
      let products = [];
      try {
        products = typeof quote.products === "string" ? JSON.parse(quote.products) : (quote.products || []);
      } catch {
        products = [];
      }
      return {
      id: quote.id,
        name: quote.name,
        email: quote.email,
        phone: quote.phone || '',
        company: quote.company || '',
        productsCount: products.length,
        productNames: products.map(p => p.name).join('; '),
      message: quote.message || '',
      status: quote.status,
      createdAt: new Date(quote.createdAt).toLocaleDateString()
      };
    });
    exportToCSV(exportData, 'quotes');
  };

  const exportMessages = () => {
    const exportData = messages.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone || '',
      message: message.message,
      replied: message.replied ? 'Yes' : 'No',
      createdAt: new Date(message.createdAt).toLocaleDateString()
    }));
    exportToCSV(exportData, 'messages');
  };

  // Update quote status mutation
  const updateQuoteStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PUT", `/api/quotes/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote Updated",
        description: "Quote status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quote status.",
        variant: "destructive",
      });
    }
  });

  // Mark message as replied mutation
  const markMessageReplied = useMutation({
    mutationFn: ({ id, replied }: { id: number; replied: boolean }) =>
      apiRequest("PUT", `/api/messages/${id}/replied`, { replied }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message Updated",
        description: "Message status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  });

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequestWithFiles("POST", "/api/products", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowAddProductDialog(false);
      resetProductForm();
      toast({
        title: "Product Created",
        description: "Product has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await apiRequestWithFiles("PUT", `/api/products/${id}`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProduct = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  });

  const resetProductForm = () => {
    dispatchNewProduct({ field: 'name', value: "" });
    dispatchNewProduct({ field: 'category', value: "Calibration Systems" });
    dispatchNewProduct({ field: 'shortDescription', value: "" });
    dispatchNewProduct({ field: 'fullTechnicalInfo', value: "" });
    dispatchNewProduct({ field: 'specifications', value: [{ key: "", value: "" }] });
    dispatchNewProduct({ field: 'featuresBenefits', value: [""] });
    dispatchNewProduct({ field: 'applications', value: [""] });
    dispatchNewProduct({ field: 'certifications', value: [""] });
    dispatchNewProduct({ field: 'imageUrl', value: "" });
    dispatchNewProduct({ field: 'imageGallery', value: [] });
    dispatchNewProduct({ field: 'catalogPdfUrl', value: "" });
    dispatchNewProduct({ field: 'datasheetPdfUrl', value: "" });
    dispatchNewProduct({ field: 'technicalDetails', value: {
      dimensions: "",
      weight: "",
      powerRequirements: "",
      operatingConditions: "",
      warranty: "",
      compliance: []
    } });
    setSelectedFiles([]);
  };

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  // Team member functions
  const handleAddTeamMember = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newTeamMember.name);
      formData.append('role', newTeamMember.role);
      formData.append('bio', newTeamMember.bio);
      if (newTeamMember.photo) {
        formData.append('photo', newTeamMember.photo);
      }

      const response = await fetch('/api/team', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newMember = await response.json();
        setTeamMembers([...teamMembers, newMember]);
        setNewTeamMember({ name: "", role: "", bio: "", photo: null });
        setShowAddTeamDialog(false);
        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      } else {
        throw new Error('Failed to add team member');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTeamMember = async (id) => {
    try {
      const formData = new FormData();
      formData.append('name', editingTeamMember.name);
      formData.append('role', editingTeamMember.role);
      formData.append('bio', editingTeamMember.bio);
      if (editingTeamMember.photo) {
        formData.append('photo', editingTeamMember.photo);
      }

      const response = await fetch(`/api/team/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setTeamMembers(teamMembers.map(member => 
          member.id === id ? updatedMember : member
        ));
        setEditingTeamMember(null);
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        throw new Error('Failed to update team member');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
        toast({
          title: "Success",
          description: "Team member deleted successfully",
        });
      } else {
        throw new Error('Failed to delete team member');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  const handlePhotoChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEditing) {
        setEditingTeamMember(prev => ({ ...prev, photo: file }));
      } else {
        setNewTeamMember(prev => ({ ...prev, photo: file }));
      }
    }
  };

  // Filter products based on search and category
  const filteredProducts = safeProducts.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addSpecification = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        specifications: [...editingProduct.specifications, { key: "", value: "" }]
      });
    } else {
      dispatchNewProduct({ field: 'specifications', value: [...newProduct.specifications, { key: "", value: "" }] });
    }
  };

  const removeSpecification = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const specs = editingProduct.specifications.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, specifications: specs });
    } else {
      const specs = newProduct.specifications.filter((_, i) => i !== index);
      dispatchNewProduct({ field: 'specifications', value: specs });
    }
  };

  const addFeature = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        featuresBenefits: [...editingProduct.featuresBenefits, ""]
      });
    } else {
      dispatchNewProduct({ field: 'featuresBenefits', value: [...newProduct.featuresBenefits, ""] });
    }
  };

  const removeFeature = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const features = editingProduct.featuresBenefits.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, featuresBenefits: features });
    } else {
      const features = newProduct.featuresBenefits.filter((_, i) => i !== index);
      dispatchNewProduct({ field: 'featuresBenefits', value: features });
    }
  };

  const addApplication = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        applications: [...editingProduct.applications, ""]
      });
    } else {
      dispatchNewProduct({ field: 'applications', value: [...newProduct.applications, ""] });
    }
  };

  const removeApplication = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const apps = editingProduct.applications.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, applications: apps });
    } else {
      const apps = newProduct.applications.filter((_, i) => i !== index);
      dispatchNewProduct({ field: 'applications', value: apps });
    }
  };

  const addCertification = (isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        certifications: [...editingProduct.certifications, ""]
      });
    } else {
      dispatchNewProduct({ field: 'certifications', value: [...newProduct.certifications, ""] });
    }
  };

  const removeCertification = (index: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      const certs = editingProduct.certifications.filter((_, i) => i !== index);
      setEditingProduct({ ...editingProduct, certifications: certs });
    } else {
      const certs = newProduct.certifications.filter((_, i) => i !== index);
      dispatchNewProduct({ field: 'certifications', value: certs });
    }
  };

  const handleAddProduct = () => {
    const formData = new FormData();
    
    // Add all product data as form fields
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('shortDescription', newProduct.shortDescription);
    formData.append('fullTechnicalInfo', newProduct.fullTechnicalInfo);
    formData.append('catalogPdfUrl', newProduct.catalogPdfUrl || "");
    formData.append('datasheetPdfUrl', newProduct.datasheetPdfUrl || "");
    
    // Add arrays as JSON strings
    formData.append('specifications', JSON.stringify(newProduct.specifications.filter(s => s.key && s.value)));
    formData.append('featuresBenefits', JSON.stringify(newProduct.featuresBenefits.filter(f => f.trim())));
    formData.append('applications', JSON.stringify(newProduct.applications.filter(a => a.trim())));
    formData.append('certifications', JSON.stringify(newProduct.certifications.filter(c => c.trim())));
    formData.append('technicalDetails', JSON.stringify(newProduct.technicalDetails || {
      dimensions: "",
      weight: "",
      powerRequirements: "",
      operatingConditions: "",
      warranty: "",
      compliance: []
    }));
    
    // Add existing image URLs if any
    if (newProduct.imageUrl) {
      formData.append('imageUrl', newProduct.imageUrl);
    }
    if (newProduct.imageGallery.length > 0) {
      formData.append('imageGallery', JSON.stringify(newProduct.imageGallery));
    }
    
    // Add selected files
    selectedFiles.forEach((file, index) => {
      formData.append('images', file);
    });
    
    createProduct.mutate(formData);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct({ ...product });
    setEditingSelectedFiles([]);
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      const formData = new FormData();
      
      // Add all product data as form fields
      formData.append('name', editingProduct.name);
      formData.append('category', editingProduct.category);
      formData.append('shortDescription', editingProduct.shortDescription);
      formData.append('fullTechnicalInfo', editingProduct.fullTechnicalInfo);
      formData.append('catalogPdfUrl', editingProduct.catalogPdfUrl || "");
      formData.append('datasheetPdfUrl', editingProduct.datasheetPdfUrl || "");
      
      // Add arrays as JSON strings
      formData.append('specifications', JSON.stringify(editingProduct.specifications.filter((s: any) => s.key && s.value)));
      formData.append('featuresBenefits', JSON.stringify(editingProduct.featuresBenefits.filter((f: string) => f.trim())));
      formData.append('applications', JSON.stringify(editingProduct.applications.filter((a: string) => a.trim())));
      formData.append('certifications', JSON.stringify(editingProduct.certifications.filter((c: string) => c.trim())));
      formData.append('technicalDetails', JSON.stringify(editingProduct.technicalDetails || {
        dimensions: "",
        weight: "",
        powerRequirements: "",
        operatingConditions: "",
        warranty: "",
        compliance: []
      }));
      
      // Add existing image URLs if any
      if (editingProduct.imageUrl) {
        formData.append('imageUrl', editingProduct.imageUrl);
      }
      if (editingProduct.imageGallery.length > 0) {
        formData.append('imageGallery', JSON.stringify(editingProduct.imageGallery));
      }
      
      // Add selected files
      editingSelectedFiles.forEach((file, index) => {
        formData.append('images', file);
      });
      
      updateProduct.mutate({ id: editingProduct.id, formData });
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  // Event mutations
  const createEvent = useMutation({
    mutationFn: (eventData: any) => apiRequest("POST", "/api/events", eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setShowAddEventDialog(false);
      resetEventForm();
      toast({
        title: "Event Created",
        description: "Event has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event.",
        variant: "destructive",
      });
    }
  });

  const updateEvent = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PUT", `/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      setEditingEvent(null);
      toast({
        title: "Event Updated",
        description: "Event has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update event.",
        variant: "destructive",
      });
    }
  });

  const deleteEvent = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Event Deleted",
        description: "Event has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete event.",
        variant: "destructive",
      });
    }
  });

  const updateCatalog = useMutation({
    mutationFn: (catalogData: any) => apiRequest("POST", "/api/catalog/main-catalog", catalogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catalog/main-catalog"] });
      toast({
        title: "Catalog Updated",
        description: "Main catalog has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update catalog.",
        variant: "destructive",
      });
    }
  });

  const resetEventForm = () => {
    setNewEvent({
      title: "",
      description: "",
      imageUrl: "",
      eventDate: "",
      published: true,
      // New fields for detailed event page
      content: "",
      location: "",
      duration: "",
      attendees: "",
      registrationUrl: "",
      tags: "",
      featured: false,
      slug: ""
    });
  };

  const handleAddEvent = () => {
    const eventData = {
      ...newEvent,
      eventDate: newEvent.eventDate
    };
    createEvent.mutate(eventData);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent({
      ...event,
      eventDate: new Date(event.eventDate).toISOString().split('T')[0]
    });
  };

  const handleUpdateEvent = () => {
    if (editingEvent) {
      const eventData = {
        ...editingEvent,
        eventDate: editingEvent.eventDate
      };
      updateEvent.mutate({ id: editingEvent.id, data: eventData });
    }
  };

  const handleDeleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(id);
    }
  };

  const handleUpdateCatalog = () => {
    updateCatalog.mutate(mainCatalog);
  };

  // Customer mutations
  const createCustomer = useMutation({
    mutationFn: (customerData: any) => apiRequest("POST", "/api/customers", customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setShowAddCustomerDialog(false);
      resetCustomerForm();
      toast({
        title: "Customer Created",
        description: "Customer has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create customer.",
        variant: "destructive",
      });
    }
  });

  const updateCustomer = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PUT", `/api/customers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setEditingCustomer(null);
      toast({
        title: "Customer Updated",
        description: "Customer has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update customer.",
        variant: "destructive",
      });
    }
  });

  const deleteCustomer = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Customer Deleted",
        description: "Customer has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete customer.",
        variant: "destructive",
      });
    }
  });

  const resetCustomerForm = () => {
    setNewCustomer({
      name: "",
      logoUrl: "",
      category: "",
      description: "",
      website: "",
      industryId: null,
      featured: false,
      location: ""
    });
  };

  const handleAddCustomer = () => {
    createCustomer.mutate({ ...newCustomer, industryId: newCustomer.industryId ? Number(newCustomer.industryId) : null });
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer({ ...customer });
  };

  const handleUpdateCustomer = () => {
    if (editingCustomer) {
      const { name, logoUrl, category, industryId, featured, description, website, location } = editingCustomer;
      if (!name?.trim() || !logoUrl?.trim() || !category?.trim() || !industryId) {
        alert("Name, Logo URL, Category, and Industry are required.");
        return;
      }
      const payload = {
        name: name.trim(),
        logoUrl: logoUrl.trim(),
        category: category.trim(),
        industryId: Number(industryId),
        featured: !!featured,
        description: description || "",
        website: website || "",
        location: location || ""
      };
      updateCustomer.mutate({ id: editingCustomer.id, data: payload });
    }
  };

  const handleDeleteCustomer = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer.mutate(id);
    }
  };

  // Single handler for all product field changes
  function handleProductFieldChange(field, value, isEditing = false) {
    if (isEditing) {
      setEditingProduct(prev => ({ ...prev, [field]: value }));
    } else {
      dispatchNewProduct({ field: field, value: value });
    }
  }

  // Add this handler in AdminDashboard
  async function handleAddProductV2(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file: File) => formData.append("images", file));
      } else if (
        key === "specifications" ||
        key === "featuresBenefits" ||
        key === "applications" ||
        key === "certifications" ||
        key === "technicalDetails"
      ) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    await apiRequestWithFiles("POST", "/api/products", formData);
    setShowAddProductDialog(false);
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  }

  async function handleUpdateProductV2(data: any) {
    try {
      let response;
      if (data.images && data.images.length > 0) {
        // Use FormData for file upload
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "images" && Array.isArray(value)) {
            value.forEach((file: File) => formData.append("images", file));
          } else if (key === "existingImages" && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (
            key === "specifications" ||
            key === "featuresBenefits" ||
            key === "applications" ||
            key === "certifications" ||
            key === "technicalDetails"
          ) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Send as JSON
        const dataToSend = {
          ...data,
          specifications: JSON.stringify(data.specifications),
          featuresBenefits: JSON.stringify(data.featuresBenefits),
          applications: JSON.stringify(data.applications),
          certifications: JSON.stringify(data.certifications),
          technicalDetails: JSON.stringify(data.technicalDetails),
          existingImages: data.existingImages ? JSON.stringify(data.existingImages) : undefined,
        };
        response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
      });
      }
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setEditingProduct(null);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  }

  async function handleProductReorder(updates: { id: number; rank: number }[]) {
    try {
      setReorderLoading(true);
      // Filter out invalid product IDs before sending
      const validUpdates = updates.filter(u => typeof u.id === 'number' && !isNaN(u.id) && u.id !== null && u.id !== undefined);
      const invalidUpdates = updates.filter(u => typeof u.id !== 'number' || isNaN(u.id) || u.id === null || u.id === undefined);
      if (invalidUpdates.length > 0) {
        console.warn('Filtered out invalid product IDs from reorder payload:', invalidUpdates);
      }
      const response = await fetch('/api/products/rank', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validUpdates)
      });
      
      if (response.ok) {
        // Refresh products to get updated order
        const updatedProducts = await fetch('/api/products').then(res => res.json());
        setProducts(updatedProducts);
        toast({
          title: "Success",
          description: "Product order updated successfully",
        });
      } else {
        throw new Error('Failed to update product order');
      }
    } catch (error) {
      console.error('Error updating product order:', error);
      toast({
        title: "Error",
        description: "Failed to update product order",
        variant: "destructive",
      });
    } finally {
      setReorderLoading(false);
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title,
      location: job.location,
      requirements: job.requirements,
      description: job.description,
      type: job.type,
      experience: job.experience,
      salary: job.salary || '',
    });
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    if (!editingJob) return;
    const res = await fetch(`/api/jobs/${editingJob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Job updated!');
      setEditingJob(null);
      setForm({ title: '', location: '', requirements: '', description: '', type: jobTypeOptions[0], experience: '', salary: '' });
      fetch('/api/jobs').then(res => res.json()).then(setJobs);
    } else {
      setMessage('Failed to update job.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage('Job deleted!');
      fetch('/api/jobs').then(res => res.json()).then(setJobs);
    } else {
      setMessage('Failed to delete job.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('Job added!');
      setForm({ title: '', location: '', requirements: '', description: '', type: jobTypeOptions[0], experience: '', salary: '' });
      fetch('/api/jobs').then(res => res.json()).then(setJobs);
    } else {
      setMessage('Failed to add job.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const newQuotes = quotes.filter(q => q.status === "New").length;
  const newMessages = messages.filter(m => !m.replied).length;

  const ProductForm = React.memo(({ product, isEditing = false }: { product: any; isEditing?: boolean }) => (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input
            value={product.name}
            onChange={e => !isEditing ? dispatchNewProduct({ field: 'name', value: e.target.value }) : setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select 
            value={product.category} 
            onValueChange={value => !isEditing ? dispatchNewProduct({ field: 'category', value }) : setEditingProduct(prev => ({ ...prev, category: value, subcategory: "" }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Calibration Systems">Calibration Systems</SelectItem>
              <SelectItem value="Metrology Systems">Metrology Systems</SelectItem>
              <SelectItem value="Measuring Instruments">Measuring Instruments</SelectItem>
              <SelectItem value="Metrology">Metrology</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <Select
            value={product.subcategory || ""}
            onValueChange={value => !isEditing ? dispatchNewProduct({ field: 'subcategory', value }) : setEditingProduct(prev => ({ ...prev, subcategory: value }))}
            disabled={!product.category}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(subcategories[product.category] || []).map((subcat) => (
                <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={product.shortDescription}
          onChange={e => !isEditing ? dispatchNewProduct({ field: 'shortDescription', value: e.target.value }) : setEditingProduct(prev => ({ ...prev, shortDescription: e.target.value }))}
          placeholder="Brief product description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Full Technical Information</label>
        <Textarea
          value={product.fullTechnicalInfo}
          onChange={e => !isEditing ? dispatchNewProduct({ field: 'fullTechnicalInfo', value: e.target.value }) : setEditingProduct(prev => ({ ...prev, fullTechnicalInfo: e.target.value }))}
          placeholder="Detailed technical information"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Technical Specifications</label>
        {product.specifications.map((spec: any, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Parameter"
              value={spec.key}
              onChange={(e) => {
                const specs = [...product.specifications];
                specs[index] = { ...specs[index], key: e.target.value };
                if (isEditing) {
                  setEditingProduct({ ...product, specifications: specs });
                } else {
                  dispatchNewProduct({ field: 'specifications', value: specs });
                }
              }}
            />
            <Input
              placeholder="Value"
              value={spec.value}
              onChange={(e) => {
                const specs = [...product.specifications];
                specs[index] = { ...specs[index], value: e.target.value };
                if (isEditing) {
                  setEditingProduct({ ...product, specifications: specs });
                } else {
                  dispatchNewProduct({ field: 'specifications', value: specs });
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeSpecification(index, isEditing)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addSpecification(isEditing)}
        >
          Add Specification
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Features & Benefits</label>
        {product.featuresBenefits.map((feature: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Feature or benefit"
              value={feature}
              onChange={(e) => {
                const features = [...product.featuresBenefits];
                features[index] = e.target.value;
                if (isEditing) {
                  setEditingProduct({ ...product, featuresBenefits: features });
                } else {
                  dispatchNewProduct({ field: 'featuresBenefits', value: features });
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFeature(index, isEditing)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addFeature(isEditing)}
        >
          Add Feature
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Applications</label>
        {product.applications.map((app: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Application area"
              value={app}
              onChange={(e) => {
                const apps = [...product.applications];
                apps[index] = e.target.value;
                if (isEditing) {
                  setEditingProduct({ ...product, applications: apps });
                } else {
                  dispatchNewProduct({ field: 'applications', value: apps });
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeApplication(index, isEditing)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addApplication(isEditing)}
        >
          Add Application
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Certifications</label>
        {product.certifications.map((cert: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Certification"
              value={cert}
              onChange={(e) => {
                const certs = [...product.certifications];
                certs[index] = e.target.value;
                if (isEditing) {
                  setEditingProduct({ ...product, certifications: certs });
                } else {
                  dispatchNewProduct({ field: 'certifications', value: certs });
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeCertification(index, isEditing)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addCertification(isEditing)}
        >
          Add Certification
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload Product Image</label>
          <div className="flex gap-2">
            <Input 
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // For demo purposes, using a placeholder URL
                  // In production, you would upload to Replit Object Storage
                  const fakeUrl = `https://storage.example.com/products/${file.name}`;
                  if (isEditing) {
                    setEditingProduct({ ...product, imageUrl: fakeUrl });
                  } else {
                    dispatchNewProduct({ field: 'imageUrl', value: fakeUrl });
                  }
                  toast({
                    title: "Image Selected",
                    description: `${file.name} ready for upload`,
                  });
                }
              }}
              className="flex-1"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Or Image URL</label>
            <Input
              value={product.imageUrl}
              onChange={(e) => {
                if (isEditing) {
                  setEditingProduct({ ...product, imageUrl: e.target.value });
                } else {
                  dispatchNewProduct({ field: 'imageUrl', value: e.target.value });
                }
              }}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Upload Datasheet PDF</label>
          <div className="flex gap-2">
            <Input 
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // For demo purposes, using a placeholder URL
                  // In production, you would upload to Replit Object Storage
                  const fakeUrl = `https://storage.example.com/datasheets/${file.name}`;
                  if (isEditing) {
                    setEditingProduct({ ...product, datasheetPdfUrl: fakeUrl });
                  } else {
                    dispatchNewProduct({ field: 'datasheetPdfUrl', value: fakeUrl });
                  }
                  toast({
                    title: "Datasheet Selected",
                    description: `${file.name} ready for upload`,
                  });
                }
              }}
              className="flex-1"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">Or Datasheet PDF URL</label>
            <Input
              value={product.datasheetPdfUrl}
              onChange={(e) => {
                if (isEditing) {
                  setEditingProduct({ ...product, datasheetPdfUrl: e.target.value });
                } else {
                  dispatchNewProduct({ field: 'datasheetPdfUrl', value: e.target.value });
                }
              }}
              placeholder="https://example.com/datasheet.pdf"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Technical Details</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Dimensions"
            value={product.technicalDetails?.dimensions || ""}
            onChange={(e) => {
              const details = { ...product.technicalDetails, dimensions: e.target.value };
              if (isEditing) {
                setEditingProduct({ ...product, technicalDetails: details });
              } else {
                dispatchNewProduct({ field: 'technicalDetails', value: details });
              }
            }}
          />
          <Input
            placeholder="Weight"
            value={product.technicalDetails?.weight || ""}
            onChange={(e) => {
              const details = { ...product.technicalDetails, weight: e.target.value };
              if (isEditing) {
                setEditingProduct({ ...product, technicalDetails: details });
              } else {
                dispatchNewProduct({ field: 'technicalDetails', value: details });
              }
            }}
          />
          <Input
            placeholder="Power Requirements"
            value={product.technicalDetails?.powerRequirements || ""}
            onChange={(e) => {
              const details = { ...product.technicalDetails, powerRequirements: e.target.value };
              if (isEditing) {
                setEditingProduct({ ...product, technicalDetails: details });
              } else {
                dispatchNewProduct({ field: 'technicalDetails', value: details });
              }
            }}
          />
          <Input
            placeholder="Operating Conditions"
            value={product.technicalDetails?.operatingConditions || ""}
            onChange={(e) => {
              const details = { ...product.technicalDetails, operatingConditions: e.target.value };
              if (isEditing) {
                setEditingProduct({ ...product, technicalDetails: details });
              } else {
                dispatchNewProduct({ field: 'technicalDetails', value: details });
              }
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Product Images (Multiple)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            const files = Array.from(e.target.files || []);
            if (isEditing) {
              setEditingSelectedFiles(files);
              // Create preview URLs for display
              const urls = files.map(file => URL.createObjectURL(file));
              setEditingProduct({ ...product, imageGallery: [...(product.imageGallery || []), ...urls] });
            } else {
              setSelectedFiles(files);
              // Create preview URLs for display
              const urls = files.map(file => URL.createObjectURL(file));
              dispatchNewProduct({ field: 'imageGallery', value: [...(product.imageGallery || []), ...urls] });
            }
          }}
        />
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.imageGallery && product.imageGallery.map((img: string, idx: number) => (
            <div key={idx} className="relative">
              <img src={img} alt="Preview" className="w-20 h-20 object-cover rounded border" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                onClick={() => {
                  const newGallery = product.imageGallery.filter((_: any, i: number) => i !== idx);
                  if (isEditing) {
                    setEditingProduct({ ...product, imageGallery: newGallery });
                    // Also remove from selected files if it's a new file
                    if (idx >= (editingProduct?.imageGallery?.length || 0) - editingSelectedFiles.length) {
                      const fileIndex = idx - (editingProduct?.imageGallery?.length || 0) + editingSelectedFiles.length;
                      if (fileIndex >= 0) {
                        const newFiles = editingSelectedFiles.filter((_, i) => i !== fileIndex);
                        setEditingSelectedFiles(newFiles);
                      }
                    }
                  } else {
                    dispatchNewProduct({ field: 'imageGallery', value: newGallery });
                    // Also remove from selected files if it's a new file
                    if (idx >= (newProduct?.imageGallery?.length || 0) - selectedFiles.length) {
                      const fileIndex = idx - (newProduct?.imageGallery?.length || 0) + selectedFiles.length;
                      if (fileIndex >= 0) {
                        const newFiles = selectedFiles.filter((_, i) => i !== fileIndex);
                        setSelectedFiles(newFiles);
                      }
                    }
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Selected files: {isEditing ? editingSelectedFiles.length : selectedFiles.length} new images
        </p>
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-cinzel text-xl font-bold text-maroon-500">RECKONIX Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.username}</span>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-maroon-500">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-56 bg-green-100 p-4 flex flex-col gap-2 border-r border-green-200">
            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'dashboard' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><BarChart3 className="inline" /> Dashboard</button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'products' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Package className="inline" /> Products</button>
            <button onClick={() => setActiveTab('category-management')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'category-management' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><FolderOpen className="inline" /> Category Management</button>
            <button onClick={() => setActiveTab('product-order')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'product-order' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><GripVertical className="inline" /> Product Order</button>
            <button onClick={() => setActiveTab('events')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'events' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Users className="inline" /> Events</button>
            <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'customers' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Users className="inline" /> Customers</button>
            <button onClick={() => setActiveTab('team')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'team' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><UserPlus className="inline" /> Team</button>
            <button onClick={() => setActiveTab('quotes')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'quotes' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><FileText className="inline" /> Quotes</button>
            <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'messages' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><MessageSquare className="inline" /> Messages</button>
            <button onClick={() => setActiveTab('catalog')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'catalog' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Download className="inline" /> Catalog</button>
            <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'analytics' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Eye className="inline" /> Analytics</button>
            <button onClick={() => setActiveTab('jobs')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'jobs' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Plus className="inline" /> Jobs</button>
            <button onClick={() => window.location.href='/admin/chatbot-summaries'} className={`flex items-center gap-2 px-4 py-2 rounded transition-all hover:bg-green-200 text-green-900`}><MessageSquare className="inline" /> Chatbot Summaries</button>
            <button onClick={() => setActiveTab('gallery')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'gallery' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><GripVertical className="inline" /> Gallery</button>
            <button onClick={() => setActiveTab('industries')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'industries' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><FolderOpen className="inline" /> Industries</button>
            <button onClick={() => setActiveTab('testimonials')} className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${activeTab === 'testimonials' ? 'bg-maroon-500 text-white' : 'hover:bg-green-200 text-green-900'}`}><Star className="inline" /> Testimonials</button>
          </aside>
          {/* Main Content */}
          <main className="flex-1 p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 mr-4">
                          <Package className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                          <p className="text-gray-600 text-sm">Total Products</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 mr-4">
                          <FileText className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                          <p className="text-gray-600 text-sm">Quote Requests</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 mr-4">
                          <MessageSquare className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                          <p className="text-gray-600 text-sm">Messages</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-maroon-100 mr-4">
                          <Eye className="h-6 w-6 text-maroon-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{analytics?.totalViews || 0}</p>
                          <p className="text-gray-600 text-sm">Website Views</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {quotes.slice(0, 5).map((quote) => (
                        <div key={quote.id} className="flex items-start border-b pb-4 last:border-b-0">
                          <div className="w-2 h-2 bg-maroon-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <p className="text-gray-900">
                              New quote request from {quote.name}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAddProductDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Search products..." 
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Calibration Systems">Calibration Systems</SelectItem>
                          <SelectItem value="Metrology Systems">Metrology Systems</SelectItem>
                          <SelectItem value="Measuring Instruments">Measuring Instruments</SelectItem>
                          <SelectItem value="Metrology">Metrology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredProducts.map((product) => (
                            <tr key={product.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={product.imageUrl}
                                    alt={product.name}
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {product.shortDescription}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{product.category}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.views}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No products found matching your criteria.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Product Dialog */}
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddProductDialog ? '' : 'hidden'}`}
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Add Product</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddProductDialog(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ProductFormV2 onSubmit={handleAddProductV2} loading={false} mode="add" />
                  </div>
                </div>

                {/* Edit Product Dialog */}
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editingProduct ? '' : 'hidden'}`}
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Product</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingProduct(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {editingProduct && (
                      <ProductFormV2
                        initialData={editingProduct}
                        mode="edit"
                        loading={false}
                        onSubmit={handleUpdateProductV2}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Category Management Tab */}
              <TabsContent value="category-management" className="space-y-6">
                <CategoryManagement />
              </TabsContent>

              {/* Product Order Tab */}
              <TabsContent value="product-order" className="space-y-6">
                <ProductReorder 
                  products={products}
                  onReorder={handleProductReorder}
                  loading={reorderLoading}
                />
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Company Events Management</h2>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAddEventDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Event
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {events.map((event) => (
                            <tr key={event.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={event.imageUrl}
                                    alt={event.title}
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {event.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(event.eventDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={event.published ? "default" : "secondary"}>
                                  {event.published ? "Published" : "Draft"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(`/event-detail?id=${event.id}`, '_blank')}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditEvent(event)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {events.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No events found. Create your first event!
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Event Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddEventDialog ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Add Event</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddEventDialog(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Event Title</label>
                        <Input
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="Enter event title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          placeholder="Event description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <Input
                          value={newEvent.imageUrl}
                          onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Event Date</label>
                        <Input
                          type="date"
                          value={newEvent.eventDate}
                          onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content (Full Event Details)</label>
                        <Textarea
                          value={newEvent.content}
                          onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
                          placeholder="Full event content with HTML formatting"
                          rows={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          placeholder="Event location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <Input
                          value={newEvent.duration}
                          onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                          placeholder="e.g., 2 hours, Full day"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Expected Attendees</label>
                        <Input
                          value={newEvent.attendees}
                          onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                          placeholder="e.g., 50-100 people"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Registration URL</label>
                        <Input
                          value={newEvent.registrationUrl}
                          onChange={(e) => setNewEvent({ ...newEvent, registrationUrl: e.target.value })}
                          placeholder="https://example.com/register"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                        <Input
                          value={newEvent.tags}
                          onChange={(e) => setNewEvent({ ...newEvent, tags: e.target.value })}
                          placeholder="calibration, workshop, training"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">URL Slug</label>
                        <Input
                          value={newEvent.slug}
                          onChange={(e) => setNewEvent({ ...newEvent, slug: e.target.value })}
                          placeholder="event-name-slug"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="published"
                          checked={newEvent.published}
                          onChange={(e) => setNewEvent({ ...newEvent, published: e.target.checked })}
                        />
                        <label htmlFor="published" className="text-sm">Published</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newEvent.featured}
                          onChange={(e) => setNewEvent({ ...newEvent, featured: e.target.checked })}
                        />
                        <label htmlFor="featured" className="text-sm">Featured Event</label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setShowAddEventDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddEvent}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newEvent.title || !newEvent.description || !newEvent.eventDate}
                      >
                        Add Event
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Edit Event Dialog */}
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editingEvent ? '' : 'hidden'}`}
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Event</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingEvent(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {editingEvent && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Event Title</label>
                          <Input
                            value={editingEvent.title}
                            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                            placeholder="Enter event title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <Textarea
                            value={editingEvent.description}
                            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                            placeholder="Event description"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Image URL</label>
                          <Input
                            value={editingEvent.imageUrl}
                            onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Event Date</label>
                          <Input
                            type="date"
                            value={editingEvent.eventDate}
                            onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Content (Full Event Details)</label>
                          <Textarea
                            value={editingEvent.content || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, content: e.target.value })}
                            placeholder="Full event content with HTML formatting"
                            rows={6}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <Input
                            value={editingEvent.location || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                            placeholder="Event location"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Duration</label>
                          <Input
                            value={editingEvent.duration || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
                            placeholder="e.g., 2 hours, Full day"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Expected Attendees</label>
                          <Input
                            value={editingEvent.attendees || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, attendees: e.target.value })}
                            placeholder="e.g., 50-100 people"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Registration URL</label>
                          <Input
                            value={editingEvent.registrationUrl || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, registrationUrl: e.target.value })}
                            placeholder="https://example.com/register"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                          <Input
                            value={editingEvent.tags || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, tags: e.target.value })}
                            placeholder="calibration, workshop, training"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">URL Slug</label>
                          <Input
                            value={editingEvent.slug || ""}
                            onChange={(e) => setEditingEvent({ ...editingEvent, slug: e.target.value })}
                            placeholder="event-name-slug"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="editPublished"
                            checked={editingEvent.published}
                            onChange={(e) => setEditingEvent({ ...editingEvent, published: e.target.checked })}
                          />
                          <label htmlFor="editPublished" className="text-sm">Published</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="editFeatured"
                            checked={editingEvent.featured || false}
                            onChange={(e) => setEditingEvent({ ...editingEvent, featured: e.target.checked })}
                          />
                          <label htmlFor="editFeatured" className="text-sm">Featured Event</label>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setEditingEvent(null)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateEvent}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Update Event
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Quote Requests</h2>
                  <Button 
                    onClick={exportQuotes}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {quotes.map((quote) => {
                            let products = [];
                            try {
                              products = typeof quote.products === "string" ? JSON.parse(quote.products) : (quote.products || []);
                            } catch {
                              products = [];
                            }
                            return (
                            <tr key={quote.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{quote.name}</div>
                                    <div className="text-sm text-gray-500">{quote.email}</div>
                                    <div className="text-sm text-gray-500">{quote.phone}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">{products.length} products</div>
                                <div className="text-sm text-gray-500">
                                    {products.map(p => p.name).join(", ").substring(0, 50)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Select
                                  value={quote.status}
                                  onValueChange={(status) => updateQuoteStatus.mutate({ id: quote.id, status })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button variant="ghost" size="sm" className="text-maroon-600 hover:text-maroon-900">
                                  View Details
                                </Button>
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
                  <Button 
                    onClick={exportMessages}
                    className="bg-green-500 text-white hover:bg-green-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Messages
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Message
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {messages.map((message) => (
                            <tr key={message.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{message.name}</div>
                                  <div className="text-sm text-gray-500">{message.email}</div>
                                  {message.phone && (
                                    <div className="text-sm text-gray-500">{message.phone}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-xs truncate">
                                  {message.message}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(message.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={message.replied ? "default" : "secondary"}>
                                  {message.replied ? "Replied" : "New"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markMessageReplied.mutate({ id: message.id, replied: !message.replied })}
                                  className="text-maroon-600 hover:text-maroon-900"
                                >
                                  {message.replied ? "Mark Unread" : "Mark Replied"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Customers Tab */}
              <TabsContent value="customers" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAddCustomerDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Industry
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Featured
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {customers.map((customer) => (
                            <tr key={customer.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img
                                    className="h-10 w-10 rounded-lg object-cover"
                                    src={customer.logoUrl}
                                    alt={customer.name}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23f3f4f6"/><text x="20" y="20" font-family="Arial" font-size="12" text-anchor="middle" dy=".3em" fill="%236b7280">${customer.name.charAt(0)}</text></svg>`;
                                    }}
                                  />
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                    <div className="text-sm text-gray-500">{customer.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{industries.find(i => i.id === customer.industryId)?.name || "-"}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={customer.featured ? "default" : "secondary"}>
                                  {customer.featured ? "Yes" : "No"}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditCustomer(customer)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {customers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No customers found. Create your first customer!
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Add Customer Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddCustomerDialog ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Add Customer</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setShowAddCustomerDialog(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Customer Name</label>
                          <Input
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <Input
                            value={newCustomer.category}
                            onChange={(e) => setNewCustomer({ ...newCustomer, category: e.target.value })}
                            placeholder="e.g., Technology, Manufacturing"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Logo URL</label>
                        <Input
                          value={newCustomer.logoUrl}
                          onChange={(e) => setNewCustomer({ ...newCustomer, logoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Industry</label>
                        <Select
                          value={newCustomer.industryId !== null ? String(newCustomer.industryId) : ""}
                          onValueChange={(value: string) => setNewCustomer({ ...newCustomer, industryId: value ? Number(value) : null })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry.id} value={industry.id.toString()}>{industry.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                        <Textarea
                          value={newCustomer.description}
                          onChange={(e) => setNewCustomer({ ...newCustomer, description: e.target.value })}
                          placeholder="Brief description about the customer"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Website (Optional)</label>
                        <Input
                          value={newCustomer.website}
                          onChange={(e) => setNewCustomer({ ...newCustomer, website: e.target.value })}
                          placeholder="https://customer-website.com"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newCustomer.featured}
                          onChange={(e) => setNewCustomer({ ...newCustomer, featured: e.target.checked })}
                        />
                        <label htmlFor="featured" className="text-sm">Featured on homepage</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                          value={newCustomer.location || ""}
                          onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                          placeholder="e.g., Mumbai, India"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddCustomer}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={!newCustomer.name || !newCustomer.logoUrl || !newCustomer.industryId}
                      >
                        Add Customer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Edit Customer Dialog */}
                <div
                  className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editingCustomer ? '' : 'hidden'}`}
                >
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Customer</h3>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingCustomer(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {editingCustomer && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Customer Name</label>
                          <Input
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                            placeholder="Enter customer name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <Input
                            value={editingCustomer.category}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, category: e.target.value })}
                            placeholder="e.g., Technology, Manufacturing"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Logo URL</label>
                          <Input
                            value={editingCustomer.logoUrl}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Industry</label>
                          <Select
                            value={editingCustomer?.industryId !== null && editingCustomer?.industryId !== undefined ? String(editingCustomer.industryId) : ""}
                            onValueChange={(value: string) => setEditingCustomer({ ...editingCustomer, industryId: value ? Number(value) : null })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry.id} value={industry.id.toString()}>{industry.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                          <Textarea
                            value={editingCustomer.description || ""}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, description: e.target.value })}
                            placeholder="Brief description about the customer"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Website (Optional)</label>
                          <Input
                            value={editingCustomer.website || ""}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, website: e.target.value })}
                            placeholder="https://customer-website.com"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="editFeatured"
                            checked={editingCustomer.featured}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, featured: e.target.checked })}
                          />
                          <label htmlFor="editFeatured" className="text-sm">Featured on homepage</label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <Input
                            value={editingCustomer.location || ""}
                            onChange={(e) => setEditingCustomer({ ...editingCustomer, location: e.target.value })}
                            placeholder="e.g., Mumbai, India"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button variant="outline" onClick={() => setEditingCustomer(null)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateCustomer}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Update Customer
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowAddTeamDialog(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Photo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teamMembers.map((member) => (
                            <tr key={member.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {member.photoUrl ? (
                                    <img
                                      className="h-12 w-12 rounded-full object-cover"
                                      src={member.photoUrl}
                                      alt={member.name}
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                      <UserPlus className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="outline">{member.role}</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {member.bio}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingTeamMember(member)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteTeamMember(member.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Catalog Tab */}
              <TabsContent value="catalog" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Catalog Management</h2>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Main Product Catalog</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Catalog Title</label>
                      <Input 
                        value={mainCatalog.title}
                        onChange={(e) => setMainCatalog({ ...mainCatalog, title: e.target.value })}
                        placeholder="Main Product Catalog 2024" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input 
                        value={mainCatalog.description}
                        onChange={(e) => setMainCatalog({ ...mainCatalog, description: e.target.value })}
                        placeholder="Complete product specifications and details" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Upload Catalog PDF</label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="file"
                          accept=".pdf"
                          ref={catalogFileInputRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCatalogUploading(true);
                              setCatalogUploadError("");
                              const formData = new FormData();
                              formData.append("pdf", file);
                              try {
                                const res = await fetch("/api/catalog/upload-pdf", {
                                  method: "POST",
                                  body: formData,
                                });
                                if (!res.ok) throw new Error("Upload failed");
                                const data = await res.json();
                                setMainCatalog((prev) => ({
                                  ...prev,
                                  pdfUrl: data.pdfUrl,
                                  fileSize: data.fileSize,
                                }));
                              toast({
                                  title: "Upload Success",
                                  description: `${file.name} uploaded successfully`,
                              });
                              } catch (err) {
                                setCatalogUploadError("Failed to upload PDF. Please try again.");
                                setMainCatalog((prev) => ({ ...prev, pdfUrl: "", fileSize: "" }));
                              } finally {
                                setCatalogUploading(false);
                              }
                            }
                          }}
                          className="flex-1"
                          disabled={catalogUploading}
                        />
                        {catalogUploading && <span className="text-blue-600 text-xs">Uploading...</span>}
                        {catalogUploadError && <span className="text-red-600 text-xs">{catalogUploadError}</span>}
                        {mainCatalog.pdfUrl && mainCatalog.pdfUrl.startsWith("/uploads/catalogs/") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(mainCatalog.pdfUrl, '_blank')}
                            className="ml-2"
                          >
                            <Download className="h-4 w-4 mr-1" /> View PDF
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Or enter URL manually below
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PDF URL</label>
                      <Input 
                        value={mainCatalog.pdfUrl}
                        onChange={(e) => setMainCatalog({ ...mainCatalog, pdfUrl: e.target.value })}
                        placeholder="https://example.com/catalog.pdf" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">File Size (optional)</label>
                      <Input 
                        value={mainCatalog.fileSize}
                        onChange={(e) => setMainCatalog({ ...mainCatalog, fileSize: e.target.value })}
                        placeholder="15.2 MB" 
                      />
                    </div>
                    <Button 
                      onClick={handleUpdateCatalog}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!mainCatalog.title || !mainCatalog.description || !mainCatalog.pdfUrl || catalogUploading}
                    >
                      Update Catalog
                    </Button>
                    
                    {catalog && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Current Catalog Info:</h4>
                        <p><strong>Title:</strong> {catalog.title}</p>
                        <p><strong>Description:</strong> {catalog.description}</p>
                        <p><strong>Last Updated:</strong> {new Date(catalog.lastUpdated).toLocaleDateString()}</p>
                        {catalog.fileSize && <p><strong>File Size:</strong> {catalog.fileSize}</p>}
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => window.open(catalog.pdfUrl, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Current Catalog
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Website Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-maroon-500 mb-2">
                        {analytics?.totalViews || 0}
                      </div>
                      <p className="text-gray-600">Total website views</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Viewed Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {productViews.slice(0, 5).map((product) => (
                          <div key={product.productId} className="flex justify-between items-center">
                            <span className="text-sm text-gray-700 truncate">{product.productName}</span>
                            <Badge variant="outline">{product.views} views</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Jobs Tab */}
              <TabsContent value="jobs">
                {editingJob && (
                  <form className="bg-gray-100 p-4 rounded mb-8" onSubmit={handleUpdateJob}>
                    <div className="mb-2">
                      <input name="title" value={form.title} onChange={handleChange} required placeholder="Job Title" className="border p-2 w-full" />
                    </div>
                    <div className="mb-2">
                      <input name="location" value={form.location} onChange={handleChange} required placeholder="Location" className="border p-2 w-full" />
                    </div>
                    <div className="mb-2">
                      <input name="requirements" value={form.requirements} onChange={handleChange} required placeholder="Requirements" className="border p-2 w-full" />
                    </div>
                    <div className="mb-2">
                      <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="border p-2 w-full" />
                    </div>
                    <div className="mb-2">
                      <select name="type" value={form.type} onChange={handleChange} required className="border p-2 w-full">
                        {jobTypeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <input name="experience" value={form.experience} onChange={handleChange} required placeholder="Experience" className="border p-2 w-full" />
                    </div>
                    <div className="mb-2">
                      <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (optional)" className="border p-2 w-full" />
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" type="submit">Update Job</button>
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" type="button" onClick={() => setEditingJob(null)}>Cancel</button>
                    {message && <div className="mt-2 text-green-600">{message}</div>}
                  </form>
                )}
                <form className="bg-gray-50 p-4 rounded mb-8" onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input name="title" value={form.title} onChange={handleChange} required placeholder="Job Title" className="border p-2 w-full" />
                  </div>
                  <div className="mb-2">
                    <input name="location" value={form.location} onChange={handleChange} required placeholder="Location" className="border p-2 w-full" />
                  </div>
                  <div className="mb-2">
                    <input name="requirements" value={form.requirements} onChange={handleChange} required placeholder="Requirements" className="border p-2 w-full" />
                  </div>
                  <div className="mb-2">
                    <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Description" className="border p-2 w-full" />
                  </div>
                  <div className="mb-2">
                    <select name="type" value={form.type} onChange={handleChange} required className="border p-2 w-full">
                      {jobTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <input name="experience" value={form.experience} onChange={handleChange} required placeholder="Experience" className="border p-2 w-full" />
                  </div>
                  <div className="mb-2">
                    <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary (optional)" className="border p-2 w-full" />
                  </div>
                  <button className="bg-maroon-500 text-white px-4 py-2 rounded" type="submit">Add Job</button>
                  {message && <div className="mt-2 text-green-600">{message}</div>}
                </form>
                <h3 className="text-xl font-semibold mb-2">Current Jobs</h3>
                <ul className="mb-8">
                  {jobs.map((job) => (
                    <li key={job.id} className="mb-2 p-2 border rounded bg-white">
                      <div className="font-bold">{job.title}</div>
                      <div className="text-sm text-gray-600">{job.location} | {job.experience}</div>
                      <div className="text-gray-700">{job.description}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="text-blue-600 underline" onClick={() => handleEditJob(job)}>Edit</button>
                        <button className="text-red-600 underline" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-semibold mb-2">Job Applications</h3>
                <table className="w-full bg-white rounded shadow">
                  <thead>
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Location</th>
                      <th className="p-2 border">Experience</th>
                      <th className="p-2 border">Job</th>
                      <th className="p-2 border">Resume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="p-2 border">{app.name}</td>
                        <td className="p-2 border">{app.email}</td>
                        <td className="p-2 border">{app.location}</td>
                        <td className="p-2 border">{app.experience}</td>
                        <td className="p-2 border">{app.jobTitle}</td>
                        <td className="p-2 border">
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-maroon-500 underline">Download</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>

              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <AdminGalleryManager />
              </TabsContent>

              {/* Industries Tab */}
              <TabsContent value="industries" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Industry Management</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddIndustryDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Industry
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {industries.map((industry) => (
                          <tr key={industry.id}>
                            <td className="px-4 py-2 text-2xl">{industry.icon}</td>
                            <td className="px-4 py-2 font-semibold">{industry.name}</td>
                            <td className="px-4 py-2">{industry.description}</td>
                            <td className="px-4 py-2">{industry.rank}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditIndustry(industry)}><Edit className="h-4 w-4" /></Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteIndustry(industry.id)}><Trash2 className="h-4 w-4" /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
                {/* Add Industry Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddIndustryDialog ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Add Industry</h3>
                      <Button variant="ghost" onClick={() => setShowAddIndustryDialog(false)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input className="mb-2" placeholder="Name" value={newIndustry.name} onChange={e => setNewIndustry({ ...newIndustry, name: e.target.value })} />
                    <Input className="mb-2" placeholder="Icon (emoji or SVG)" value={newIndustry.icon} onChange={e => setNewIndustry({ ...newIndustry, icon: e.target.value })} />
                    <Input className="mb-2" placeholder="Rank (number)" type="number" value={newIndustry.rank} onChange={e => setNewIndustry({ ...newIndustry, rank: Number(e.target.value) })} />
                    <Textarea className="mb-2" placeholder="Description" value={newIndustry.description} onChange={e => setNewIndustry({ ...newIndustry, description: e.target.value })} />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddIndustry}>Add</Button>
                  </div>
                </div>
                {/* Edit Industry Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editingIndustry ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Industry</h3>
                      <Button variant="ghost" onClick={() => setEditingIndustry(null)}><X className="h-4 w-4" /></Button>
                    </div>
                    <Input className="mb-2" placeholder="Name" value={editingIndustry?.name || ''} onChange={e => setEditingIndustry({ ...editingIndustry, name: e.target.value })} />
                    <Input className="mb-2" placeholder="Icon (emoji or SVG)" value={editingIndustry?.icon || ''} onChange={e => setEditingIndustry({ ...editingIndustry, icon: e.target.value })} />
                    <Input className="mb-2" placeholder="Rank (number)" type="number" value={editingIndustry?.rank || 0} onChange={e => setEditingIndustry({ ...editingIndustry, rank: Number(e.target.value) })} />
                    <Textarea className="mb-2" placeholder="Description" value={editingIndustry?.description || ''} onChange={e => setEditingIndustry({ ...editingIndustry, description: e.target.value })} />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateIndustry}>Update</Button>
                  </div>
                </div>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Testimonial Management</h2>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddTestimonialDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {testimonials.map((testimonial) => (
                          <tr key={testimonial.id}>
                            <td className="px-4 py-2 font-semibold">{testimonial.name}</td>
                            <td className="px-4 py-2">{testimonial.role}</td>
                            <td className="px-4 py-2">{testimonial.company}</td>
                            <td className="px-4 py-2">
                              <div className="flex items-center">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-2">
                              {testimonial.featured ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Featured
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Regular
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 max-w-xs">
                              <div className="truncate" title={testimonial.content}>
                                {testimonial.content}
                              </div>
                            </td>
                            <td className="px-4 py-2 flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditTestimonial(testimonial)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Add Testimonial Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddTestimonialDialog ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Add Testimonial</h3>
                      <Button variant="ghost" onClick={() => setShowAddTestimonialDialog(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Input 
                        placeholder="Name" 
                        value={newTestimonial.name} 
                        onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })} 
                      />
                      <Input 
                        placeholder="Role" 
                        value={newTestimonial.role} 
                        onChange={e => setNewTestimonial({ ...newTestimonial, role: e.target.value })} 
                      />
                      <Input 
                        placeholder="Company" 
                        value={newTestimonial.company} 
                        onChange={e => setNewTestimonial({ ...newTestimonial, company: e.target.value })} 
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                              className={`text-2xl ${star <= newTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newTestimonial.featured}
                          onChange={e => setNewTestimonial({ ...newTestimonial, featured: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="featured" className="text-sm">Featured testimonial</label>
                      </div>
                      <Textarea 
                        placeholder="Testimonial content" 
                        value={newTestimonial.content} 
                        onChange={e => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                        rows={4}
                      />
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddTestimonial}>
                        Add Testimonial
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Edit Testimonial Dialog */}
                <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${editingTestimonial ? '' : 'hidden'}`}>
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Edit Testimonial</h3>
                      <Button variant="ghost" onClick={() => setEditingTestimonial(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <Input 
                        placeholder="Name" 
                        value={editingTestimonial?.name || ''} 
                        onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} 
                      />
                      <Input 
                        placeholder="Role" 
                        value={editingTestimonial?.role || ''} 
                        onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} 
                      />
                      <Input 
                        placeholder="Company" 
                        value={editingTestimonial?.company || ''} 
                        onChange={e => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })} 
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                              className={`text-2xl ${star <= (editingTestimonial?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="edit-featured"
                          checked={editingTestimonial?.featured || false}
                          onChange={e => setEditingTestimonial({ ...editingTestimonial, featured: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="edit-featured" className="text-sm">Featured testimonial</label>
                      </div>
                      <Textarea 
                        placeholder="Testimonial content" 
                        value={editingTestimonial?.content || ''} 
                        onChange={e => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                        rows={4}
                      />
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateTestimonial}>
                        Update Testimonial
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Add Team Member Dialog */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddTeamDialog ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Team Member</h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddTeamDialog(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Input
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Enter role"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={newTeamMember.bio}
                onChange={(e) => setNewTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter bio"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Photo</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoChange(e, false)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTeamDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTeamMember}>
                Add Member
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Team Member Dialog */}
      {editingTeamMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Team Member</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setEditingTeamMember(null)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={editingTeamMember.name}
                  onChange={(e) => setEditingTeamMember(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <Input
                  value={editingTeamMember.role}
                  onChange={(e) => setEditingTeamMember(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter role"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={editingTeamMember.bio}
                  onChange={(e) => setEditingTeamMember(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Enter bio"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, true)}
                />
                {editingTeamMember.photoUrl && (
                  <div className="mt-2">
                    <img 
                      src={editingTeamMember.photoUrl} 
                      alt="Current photo" 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current photo</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingTeamMember(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleUpdateTeamMember(editingTeamMember.id)}>
                  Update Member
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminGalleryManager() {
  const API_URL = "/api/gallery";
  const [premises, setPremises] = useState([]);
  const [events, setEvents] = useState([]);
  const [others, setOthers] = useState([]);
  const [premisesLink, setPremisesLink] = useState("");
  const [eventsLink, setEventsLink] = useState("");
  const [othersLink, setOthersLink] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchImages = async (section, setter) => {
    const res = await fetch(`${API_URL}?section=${section}`);
    const data = await res.json();
    setter(data);
  };
  useEffect(() => {
    fetchImages("premises", setPremises);
    fetchImages("events", setEvents);
    fetchImages("others", setOthers);
  }, []);
  const handleFileUpload = async (e, section, setter) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("section", section);
      formData.append("image", file);
      await fetch(API_URL, { method: "POST", body: formData });
    }
    await fetchImages(section, setter);
    setLoading(false);
  };
  const handleAddLink = async (url, section, setter, clear) => {
    if (!url.trim()) return;
    setLoading(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, url: url.trim() })
    });
    await fetchImages(section, setter);
    clear();
    setLoading(false);
  };
  const handleDelete = async (id, section, setter) => {
    setLoading(true);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await fetchImages(section, setter);
    setLoading(false);
  };
  return (
    <div className="py-6 px-2">
      <h2 className="text-2xl font-bold mb-4 text-maroon-700">Gallery Manager</h2>
      {/* Premises Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Company Premises</h3>
        <div className="flex gap-4 mb-2">
          <input type="file" accept="image/*" multiple onChange={e => handleFileUpload(e, "premises", setPremises)} disabled={loading} />
          <input type="url" value={premisesLink} onChange={e => setPremisesLink(e.target.value)} placeholder="Image URL" className="border p-2" />
          <button onClick={() => handleAddLink(premisesLink, "premises", setPremises, () => setPremisesLink(""))} className="bg-maroon-500 text-white px-3 py-1 rounded" disabled={loading}>Add Link</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {premises.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.url} alt="Premises" className="rounded-lg shadow-md object-cover w-full h-40" />
              <button onClick={() => handleDelete(img.id, "premises", setPremises)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
            </div>
          ))}
        </div>
      </section>
      {/* Events Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Events</h3>
        <div className="flex gap-4 mb-2">
          <input type="file" accept="image/*" multiple onChange={e => handleFileUpload(e, "events", setEvents)} disabled={loading} />
          <input type="url" value={eventsLink} onChange={e => setEventsLink(e.target.value)} placeholder="Image URL" className="border p-2" />
          <button onClick={() => handleAddLink(eventsLink, "events", setEvents, () => setEventsLink(""))} className="bg-maroon-500 text-white px-3 py-1 rounded" disabled={loading}>Add Link</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {events.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.url} alt="Event" className="rounded-lg shadow-md object-cover w-full h-40" />
              <button onClick={() => handleDelete(img.id, "events", setEvents)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
            </div>
          ))}
        </div>
      </section>
      {/* Others Section */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Other Posts</h3>
        <div className="flex gap-4 mb-2">
          <input type="file" accept="image/*" multiple onChange={e => handleFileUpload(e, "others", setOthers)} disabled={loading} />
          <input type="url" value={othersLink} onChange={e => setOthersLink(e.target.value)} placeholder="Image URL" className="border p-2" />
          <button onClick={() => handleAddLink(othersLink, "others", setOthers, () => setOthersLink(""))} className="bg-maroon-500 text-white px-3 py-1 rounded" disabled={loading}>Add Link</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {others.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.url} alt="Other" className="rounded-lg shadow-md object-cover w-full h-40" />
              <button onClick={() => handleDelete(img.id, "others", setOthers)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
            </div>
          ))}
        </div>
      </section>
      {loading && <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"><div className="bg-white p-4 rounded shadow">Processing...</div></div>}
    </div>
  );
}


