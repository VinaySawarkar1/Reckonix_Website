import { z } from "zod";

// User Schema (for Admin)
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  role: z.enum(['admin']).default('admin'),
  createdAt: z.date().default(() => new Date())
});

export const insertUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(['admin']).default('admin')
});

// Product Schema
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string(),
  shortDescription: z.string(),
  description: z.string().optional(), // Add description field for backend compatibility
  fullTechnicalInfo: z.string(),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string()
  })),
  featuresBenefits: z.array(z.string()),
  applications: z.array(z.string()),
  certifications: z.array(z.string()),
  imageUrl: z.string(),
  imageGallery: z.array(z.string()).default([]),
  catalogPdfUrl: z.string().optional(),
  datasheetPdfUrl: z.string().optional(),
  technicalDetails: z.object({
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    powerRequirements: z.string().optional(),
    operatingConditions: z.string().optional(),
    warranty: z.string().optional(),
    compliance: z.array(z.string()).default([])
  }).optional(),
  views: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  homeFeatured: z.boolean().default(false),
  rank: z.number().default(0)
});

export const insertProductSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string(),
  subcategory: z.string(),
  shortDescription: z.string().min(1).max(500),
  description: z.string().min(1).max(500).optional(), // Add description field for backend compatibility
  fullTechnicalInfo: z.string().min(1),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).default([]),
  featuresBenefits: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  imageUrl: z.string().min(1),
  imageGallery: z.array(z.string()).default([]),
  catalogPdfUrl: z.string().optional().or(z.literal("")),
  datasheetPdfUrl: z.string().optional().or(z.literal("")),
  technicalDetails: z.object({
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    powerRequirements: z.string().optional(),
    operatingConditions: z.string().optional(),
    warranty: z.string().optional(),
    compliance: z.array(z.string()).default([])
  }).optional(),
  homeFeatured: z.boolean().default(false),
  rank: z.number().default(0)
});

export const updateProductSchema = insertProductSchema.partial().extend({
  imageUrl: z.string().optional(),
});

// Quote Request Schema
export const quoteRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string(),
  products: z.string().optional(), // JSON string
  status: z.enum(['New', 'Contacted', 'Closed']).default('New'),
  createdAt: z.date().default(() => new Date())
});

export const insertQuoteRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1),
  products: z.string().optional(), // JSON string
});

// Contact Message Schema
export const contactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string(),
  replied: z.boolean().default(false),
  createdAt: z.date().default(() => new Date())
});

export const insertContactMessageSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000)
});

// View Data Schema
export const viewDataSchema = z.object({
  id: z.number(),
  date: z.string(), // Date in YYYY-MM-DD format
  count: z.number().default(0),
  lastViewedIPs: z.array(z.string()).default([])
});

// Company Events Schema
export const companyEventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional().nullable(),
  eventDate: z.date(),
  published: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  // New fields for detailed event page
  content: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  attendees: z.string().optional().nullable(),
  registrationUrl: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  slug: z.string().optional().nullable()
});

export const insertCompanyEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  imageUrl: z.string().optional().nullable(),
  eventDate: z.date(),
  published: z.boolean().default(true),
  // New fields for detailed event page
  content: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  attendees: z.string().optional().nullable(),
  registrationUrl: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  slug: z.string().optional().nullable()
});

// Main Catalog Schema
export const mainCatalogSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  pdfUrl: z.string(),
  fileSize: z.string().optional(),
  lastUpdated: z.date().default(() => new Date())
});

export const insertMainCatalogSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  pdfUrl: z.string().min(1),
  fileSize: z.string().optional()
});

// Auth Schema
export const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Customer Schema
export const customerSchema = z.object({
  id: z.number(),
  name: z.string(),
  logoUrl: z.string(),
  category: z.string(),
  description: z.string().optional(),
  website: z.string().optional(),
  industry: z.string(),
  featured: z.boolean().default(false),
  createdAt: z.date().default(() => new Date())
});

export const insertCustomerSchema = z.object({
  name: z.string().min(1).max(200),
  logoUrl: z.string().min(1),
  category: z.string().min(1).max(100),
  description: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().min(1).max(100),
  featured: z.boolean().default(false)
});

// Job Schema
export const jobSchema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  experience: z.string(),
  description: z.string(),
  createdAt: z.date().default(() => new Date())
});

export const insertJobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  requirements: z.string().min(1).max(1000),
  location: z.string().min(1).max(100),
  type: z.enum(['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary']),
  experience: z.string().min(1).max(100),
  salary: z.string().optional(),
});

// Job Application Schema
export const jobApplicationSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  location: z.string(),
  experience: z.string(),
  resumeUrl: z.string(),
  jobId: z.number(),
  jobTitle: z.string(),
  createdAt: z.date().default(() => new Date())
});

export const insertJobApplicationSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  location: z.string().min(1).max(100),
  experience: z.string().min(1).max(100),
  resumeUrl: z.string().min(1),
  jobId: z.number(),
  jobTitle: z.string().min(1).max(200)
});

// Category Schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  subcategories: z.array(z.string())
});

export const insertCategorySchema = z.object({
  name: z.string().min(1).max(100),
  subcategories: z.array(z.string())
});

// Export types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ViewData = z.infer<typeof viewDataSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type CompanyEvent = z.infer<typeof companyEventSchema>;
export type InsertCompanyEvent = z.infer<typeof insertCompanyEventSchema>;
export type MainCatalog = z.infer<typeof mainCatalogSchema>;
export type InsertMainCatalog = z.infer<typeof insertMainCatalogSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Job = z.infer<typeof jobSchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobApplication = z.infer<typeof jobApplicationSchema>;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export interface Complaint {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface ChatbotSummary {
  sessionId: string;
  type: string;
  name?: string;
  email?: string;
  message: string;
  createdAt: string;
}
