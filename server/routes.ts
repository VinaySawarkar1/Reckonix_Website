import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { PrismaClient } from '@prisma/client';
import { 
  insertProductSchema, 
  insertQuoteRequestSchema, 
  insertContactMessageSchema,
  insertCompanyEventSchema,
  insertMainCatalogSchema,
  insertCustomerSchema,
  loginSchema,
  insertJobSchema,
  insertJobApplicationSchema,
  updateProductSchema
} from "@shared/schema";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Initialize Prisma client
const prisma = new PrismaClient();

// @ts-ignore: Suppress nodemailer type error if types are missing
declare module 'nodemailer' {
  interface SentMessageInfo {
    messageId: string;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// In-memory session state for chatbot (for demo; use real session in production)
const chatSessions: Record<string, any> = {};

// Helper to determine type from session
function getSessionType(session: any) {
  if (session.complaint) return "complaint";
  // Add more types as needed
  return "inquiry";
}

// Replace transporter config with provided credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinaysawarkar53@gmail.com',
    pass: 'ezkxbkrtmmdodfoh',
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const whatsappFrom = '+14155238886'; // Twilio sandbox or your WhatsApp number
const whatsappTo = '+919175240313'; // Admin WhatsApp number

async function sendAdminEmail(subject: string, body: string) {
  await transporter.sendMail({
    from: 'vinaysawarkar53@gmail.com',
    to: 'vinaysawarkar53@gmail.com',
    subject,
    text: body,
  });
}

async function sendAdminWhatsApp(body: string) {
  await twilioClient.messages.create({
    from: `whatsapp:${whatsappFrom}`,
    to: `whatsapp:${whatsappTo}`,
    body,
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename with original extension
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  const productUpload = multer({
    storage: storageConfig,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Test route to verify API routing is working
  app.get("/api/test", async (req: Request, res: Response) => {
    console.log("GET /api/test route hit");
    res.json({ message: "API routing is working!" });
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    console.log("GET /api/testimonials route hit");
    try {
      const testimonials = await prisma.testimonial.findMany({ 
        orderBy: { createdAt: "desc" } 
      });
      console.log("Found testimonials:", testimonials.length);
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/testimonials", async (req: Request, res: Response) => {
    console.log("POST /api/testimonials route hit");
    try {
      const { name, role, company, content, rating, featured } = req.body;
      console.log("Creating testimonial:", { name, role, company, content, rating, featured });
      const testimonial = await prisma.testimonial.create({
        data: { 
          name, 
          role, 
          company, 
          content, 
          rating: rating ?? 5, 
          featured: featured ?? false 
        },
      });
      console.log("Created testimonial:", testimonial);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: "Failed to create testimonial", details: error instanceof Error ? error.message : error });
    }
  });

  app.put("/api/testimonials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { name, role, company, content, rating, featured } = req.body;
      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: { name, role, company, content, rating, featured },
      });
      res.json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Failed to update testimonial", details: error instanceof Error ? error.message : error });
    }
  });

  app.delete("/api/testimonials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.testimonial.delete({ where: { id } });
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete testimonial", details: error instanceof Error ? error.message : error });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, use proper JWT and password hashing
      res.json({ 
        user: { id: user.id, username: user.username, role: user.role },
        token: `mock-jwt-${user.id}` // Mock token for demo
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Products routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      let products = await prisma.product.findMany({
        where: category ? { category: category } : undefined,
        include: { images: true }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: { images: true }
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Increment view count
      await prisma.product.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Update product image upload setup for multiple images
  const productImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/products/"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
    },
  });
  const productImageUpload = multer({ storage: productImageStorage });

  // Add product with multiple images
  app.post("/api/products", productImageUpload.array("images", 10), async (req, res) => {
    try {
      const data = req.body;
      // Create product first
      const product = await prisma.product.create({
        data: {
          name: data.name,
          category: data.category,
          subcategory: data.subcategory,
          shortDescription: data.shortDescription,
          fullTechnicalInfo: data.fullTechnicalInfo,
          specifications: data.specifications,
          featuresBenefits: data.featuresBenefits,
          applications: data.applications,
          certifications: data.certifications,
          technicalDetails: data.technicalDetails,
          catalogPdfUrl: data.catalogPdfUrl,
          datasheetPdfUrl: data.datasheetPdfUrl,
          homeFeatured: data.homeFeatured === "true" || data.homeFeatured === true,
        },
      });
      // Save images if any
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: `/uploads/products/${file.filename}`,
            },
          });
        }
      }
      // Return product with images
      const productWithImages = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: true },
      });
      res.status(201).json(productWithImages);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to add product", error: err.message });
    }
  });

  // Edit product with multiple images
  app.put("/api/products/:id", productImageUpload.array("images", 10), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      
      // Handle existing images - remove images that are no longer in the list
      if (data.existingImages) {
        let existingImageUrls: string[] = [];
        if (Array.isArray(data.existingImages)) {
          existingImageUrls = data.existingImages;
        } else if (typeof data.existingImages === 'string') {
          try {
            existingImageUrls = JSON.parse(data.existingImages);
          } catch {
            existingImageUrls = [];
          }
        }
        // Get current images for this product
        const currentImages = await prisma.productImage.findMany({
          where: { productId: id }
        });
        
        // Remove images that are no longer in the existingImages list
        for (const currentImage of currentImages) {
          if (!existingImageUrls.includes(currentImage.url)) {
            await prisma.productImage.delete({
              where: { id: currentImage.id }
            });
          }
        }
      } else {
        // If no existingImages provided, remove all current images
        await prisma.productImage.deleteMany({
          where: { productId: id }
        });
      }
      
      // Update product fields
      const product = await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          category: data.category,
          subcategory: data.subcategory,
          shortDescription: data.shortDescription,
          fullTechnicalInfo: data.fullTechnicalInfo,
          specifications: data.specifications,
          featuresBenefits: data.featuresBenefits,
          applications: data.applications,
          certifications: data.certifications,
          technicalDetails: data.technicalDetails,
          catalogPdfUrl: data.catalogPdfUrl,
          datasheetPdfUrl: data.datasheetPdfUrl,
          homeFeatured: data.homeFeatured === "true" || data.homeFeatured === true,
        },
      });
      
      // Save new images if any
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: `/uploads/products/${file.filename}`,
            },
          });
        }
      }
      
      // Return product with images
      const productWithImages = await prisma.product.findUnique({
        where: { id: product.id },
        include: { images: true },
      });
      res.json(productWithImages);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to update product", error: err.message });
    }
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const deleted = await prisma.product.delete({
        where: { id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Bulk update product ranks
  app.put("/api/products/rank", async (req: Request, res: Response) => {
    try {
      const updates = req.body; // [{ id: number, rank: number }]
      if (!Array.isArray(updates)) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      const results = [];
      const skipped = [];
      const invalidIds = [];
      for (const { id, rank } of updates) {
        if (typeof id !== 'number' || typeof rank !== 'number' || isNaN(id)) {
          console.warn('Invalid id or rank in update:', { id, rank });
          skipped.push({ id, rank, reason: 'Invalid id or rank' });
          invalidIds.push(id);
          continue;
        }
        // Use the partial schema for validation
        const validatedData = updateProductSchema.parse({ rank });
        const updated = await prisma.product.update({
          where: { id },
          data: validatedData,
        });
        if (updated) results.push(updated);
        else {
          console.warn('Product not found for update:', id);
          skipped.push({ id, rank, reason: 'Product not found' });
          invalidIds.push(id);
        }
      }
      if (invalidIds.length > 0) {
        console.error('Invalid product IDs in rank update:', invalidIds);
        return res.status(400).json({ message: "Invalid product ID(s)", invalidIds });
      }
      res.json({ message: "Ranks updated", updated: results, skipped });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product ranks" });
    }
  });

  // Category routes (moved up)
  app.get('/api/categories', async (req, res) => {
    try {
      // Fetch categories with nested subcategories (tree)
      const categories = await prisma.category.findMany({
        include: {
          subcategories: {
            where: { parentId: null },
            include: {
              children: {
                include: {
                  children: true // up to 2 levels deep, can be made recursive in frontend
                }
              }
            }
          }
        }
      });
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const { name, subcategories } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Invalid category data' });
      }
      // Recursive function to create nested subcategories
      async function createSubcategories(subs, categoryId, parentId = null) {
        for (const sub of subs) {
          const created = await prisma.subcategory.create({
            data: {
              name: sub.name,
              categoryId,
              parentId,
            },
          });
          if (sub.children && sub.children.length > 0) {
            await createSubcategories(sub.children, categoryId, created.id);
          }
        }
      }
      const newCategory = await prisma.category.create({
        data: { name },
      });
      if (Array.isArray(subcategories)) {
        await createSubcategories(subcategories, newCategory.id);
      }
      // Fetch with tree for response
      const categoryWithTree = await prisma.category.findUnique({
        where: { id: newCategory.id },
        include: {
          subcategories: {
            where: { parentId: null },
            include: {
              children: {
                include: { children: true }
              }
            }
          }
        }
      });
      res.status(201).json(categoryWithTree);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.put('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, subcategories } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Invalid category data' });
      }
      // Delete all subcategories for this category (cascade will handle children)
      await prisma.subcategory.deleteMany({ where: { categoryId: id } });
      // Recursive function to create nested subcategories
      async function createSubcategories(subs, categoryId, parentId = null) {
        for (const sub of subs) {
          const created = await prisma.subcategory.create({
            data: {
              name: sub.name,
              categoryId,
              parentId,
            },
          });
          if (sub.children && sub.children.length > 0) {
            await createSubcategories(sub.children, categoryId, created.id);
          }
        }
      }
      await prisma.category.update({
        where: { id },
        data: { name },
      });
      if (Array.isArray(subcategories)) {
        await createSubcategories(subcategories, id);
      }
      // Fetch with tree for response
      const categoryWithTree = await prisma.category.findUnique({
        where: { id },
        include: {
          subcategories: {
            where: { parentId: null },
            include: {
              children: {
                include: { children: true }
              }
            }
          }
        }
      });
      res.json(categoryWithTree);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await prisma.category.delete({
        where: { id },
      });
      
      if (!success) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  // Quote routes
  app.post("/api/quotes", async (req: Request, res: Response) => {
    try {
      // Stringify products before validation if it's an array
      let body = { ...req.body };
      if (body.products && Array.isArray(body.products)) {
        body.products = JSON.stringify(body.products);
      }
      const quoteData = insertQuoteRequestSchema.parse(body);
      const quote = await prisma.quoteRequest.create({
        data: quoteData,
      });
      // Try to send notifications, but don't fail the request if they error
      const quoteBody = `New Quote Request:\n${JSON.stringify(quote, null, 2)}`;
      try {
      await sendAdminEmail('New Quote Request', quoteBody);
      } catch (emailErr) {
        console.error('Failed to send admin email:', emailErr);
      }
      try {
      await sendAdminWhatsApp(quoteBody);
      } catch (waErr) {
        console.error('Failed to send WhatsApp notification:', waErr);
      }
      res.status(201).json({ message: "Quote request submitted successfully", id: quote.id });
    } catch (error) {
      console.error("Quote creation error:", error);
      res.status(400).json({ 
        message: "Invalid quote request data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/quotes", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const quotes = await prisma.quoteRequest.findMany();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.put("/api/quotes/:id/status", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (isNaN(id) || !['New', 'Contacted', 'Closed'].includes(status)) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const quote = await prisma.quoteRequest.update({
        where: { id },
        data: { status },
      });
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quote status" });
    }
  });

  // Messages routes
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      console.log("/api/messages received:", req.body); // DEBUG LOG
      console.log("Using schema:", insertContactMessageSchema); // DEBUG: Log the schema being used
      const messageData = insertContactMessageSchema.parse(req.body);
      console.log("Parsed data:", messageData); // DEBUG: Log the parsed data
      // Remove phone before saving to DB
      const { phone, ...dbData } = messageData;
      const message = await prisma.contactMessage.create({
        data: dbData,
      });
      
      // In production, send email notification here using Nodemailer
      const messageBody = `New Contact Message:\n${JSON.stringify(message, null, 2)}`;
      await sendAdminEmail('New Contact Message', messageBody);
      // await sendAdminWhatsApp(messageBody); // Disabled to fix Twilio username error
      
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.log("Error details:", error); // DEBUG: Log the full error
      res.status(400).json({ message: "Invalid message data", details: error instanceof Error ? error.message : error });
    }
  });

  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const messages = await prisma.contactMessage.findMany();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/messages/:id/replied", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      const { replied } = req.body;
      
      if (isNaN(id) || typeof replied !== 'boolean') {
        return res.status(400).json({ message: "Invalid data" });
      }

      const message = await prisma.contactMessage.update({
        where: { id },
        data: { replied },
      });
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message status" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/website-views", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const views = await prisma.websiteView.findMany({
        select: {
          ip: true,
          createdAt: true,
        },
      });
      res.json({ totalViews: views.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website views" });
    }
  });

  app.post("/api/analytics/website-views", async (req: Request, res: Response) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      await prisma.websiteView.create({
        data: { ip },
      });
      res.json({ message: "View recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  app.get("/api/analytics/product-views", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const productViews = await prisma.productView.findMany();
      res.json(productViews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product views" });
    }
  });

  // Company Events routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await prisma.companyEvent.findMany();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const event = await prisma.companyEvent.findUnique({
        where: { id },
      });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const raw = { ...req.body } as any;
      const sanitized = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, (v === "" || v === null) ? undefined : v])
      ) as any;
      const eventData = insertCompanyEventSchema.parse({
        ...sanitized,
        eventDate: new Date(raw.eventDate),
      });
      const event = await prisma.companyEvent.create({
        data: eventData,
      });
      res.status(201).json(event);
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(400).json({ 
        message: "Invalid event data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/events/:id", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const raw = { ...req.body } as any;
      const sanitized = Object.fromEntries(
        Object.entries(raw).map(([k, v]) => [k, (v === "" || v === null) ? undefined : v])
      ) as any;
      const eventData = insertCompanyEventSchema.partial().parse({
        ...sanitized,
        eventDate: raw.eventDate ? new Date(raw.eventDate) : undefined,
      });
      const event = await prisma.companyEvent.update({
        where: { id },
        data: eventData,
      });
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      console.error("Event update error:", error);
      res.status(400).json({ 
        message: "Invalid event data",
        details: error instanceof Error ? error.message : error,
        received: req.body,
      });
    }
  });

  app.delete("/api/events/:id", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const deleted = await prisma.companyEvent.delete({
        where: { id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Catalog routes
  app.get("/api/catalog/main-catalog", async (req: Request, res: Response) => {
    try {
      const catalogInfo = await prisma.mainCatalog.findFirst();
      if (!catalogInfo || !catalogInfo.pdfUrl) {
        return res.status(404).json({ message: "Main catalog not found" });
      }
      res.json(catalogInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to serve catalog" });
    }
  });

  // === Catalog PDF Upload Support ===
  const catalogUploadsDir = path.join(__dirname, '..', 'uploads', 'catalogs');
  if (!fs.existsSync(catalogUploadsDir)) {
    fs.mkdirSync(catalogUploadsDir, { recursive: true });
  }
  const catalogStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, catalogUploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
  const catalogUpload = multer({
    storage: catalogStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    }
  });

  // Serve uploaded catalog PDFs statically
  app.use('/uploads/catalogs', (req, res, next) => {
    const filePath = path.join(catalogUploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  // Upload catalog PDF endpoint
  app.post('/api/catalog/upload-pdf', catalogUpload.single('pdf'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const pdfUrl = `/uploads/catalogs/${req.file.filename}`;
    const fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
    res.json({ pdfUrl, fileSize });
  });

  // Update main catalog endpoint to support both JSON and multipart/form-data
  app.post('/api/catalog/main-catalog', catalogUpload.single('pdf'), async (req: Request, res: Response) => {
    try {
      let catalogData: any = {};
      if (req.is('multipart/form-data')) {
        // Handle file upload and form fields
        const { title, description } = req.body;
        if (!title || !description) {
          return res.status(400).json({ message: 'Title and description are required' });
        }
        let pdfUrl = req.body.pdfUrl;
        let fileSize = req.body.fileSize;
        if (req.file) {
          pdfUrl = `/uploads/catalogs/${req.file.filename}`;
          fileSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
        }
        catalogData = { title, description, pdfUrl, fileSize };
      } else {
        // Handle JSON body
        catalogData = req.body;
      }
      const validated = insertMainCatalogSchema.parse(catalogData);
      // Only save fields that exist in the Prisma model
      const dbData = {
        title: validated.title,
        description: validated.description,
        pdfUrl: validated.pdfUrl
      };
      const catalog = await prisma.mainCatalog.upsert({
        where: { id: 1 },
        create: dbData,
        update: dbData,
      });
      // Respond with fileSize if present, for UI
      res.json({ ...catalog, fileSize: validated.fileSize });
    } catch (error) {
      console.error('Catalog update error:', error);
      res.status(400).json({ 
        message: 'Failed to update catalog',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req: Request, res: Response) => {
    try {
      const customers = await prisma.customer.findMany();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.get("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const customer = await prisma.customer.findUnique({
        where: { id },
      });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.post("/api/customers", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await prisma.customer.create({
        data: customerData,
      });
      res.status(201).json(customer);
    } catch (error) {
      console.error("Customer creation error:", error);
      res.status(400).json({ 
        message: "Invalid customer data",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const customerData = insertCustomerSchema.partial().parse(req.body);
      const customer = await prisma.customer.update({
        where: { id },
        data: customerData,
      });
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer data" });
    }
  });

  app.delete("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      // In production, verify JWT token here
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid customer ID" });
      }

      const deleted = await prisma.customer.delete({
        where: { id },
      });
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Industry routes
  app.get("/api/industries", async (req: Request, res: Response) => {
    try {
      const industries = await prisma.industry.findMany({ orderBy: { rank: "asc" } });
      res.json(industries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch industries" });
    }
  });

  app.post("/api/industries", async (req: Request, res: Response) => {
    try {
      const { name, description, icon, rank } = req.body;
      const industry = await prisma.industry.create({
        data: { name, description, icon, rank: rank ?? 0 },
      });
      res.status(201).json(industry);
    } catch (error) {
      res.status(400).json({ message: "Failed to create industry", details: error instanceof Error ? error.message : error });
    }
  });

  app.put("/api/industries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, icon, rank } = req.body;
      const industry = await prisma.industry.update({
        where: { id },
        data: { name, description, icon, rank },
      });
      res.json(industry);
    } catch (error) {
      res.status(400).json({ message: "Failed to update industry", details: error instanceof Error ? error.message : error });
    }
  });

  app.delete("/api/industries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await prisma.industry.delete({ where: { id } });
      res.json({ message: "Industry deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete industry", details: error instanceof Error ? error.message : error });
    }
  });



  // === Job Management & Applications ===
  // Set up multer for resume uploads
  const uploadDir = path.join(__dirname, '../uploads/resumes');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const upload = multer({ dest: uploadDir });

  // List all jobs
  app.get('/api/jobs', async (req, res) => {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  });

  // Create a new job (admin)
  app.post('/api/jobs', async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await prisma.job.create({
        data: jobData,
      });
      res.status(201).json(job);
    } catch (error) {
      res.status(400).json({ message: 'Invalid job data' });
    }
  });

  // Delete a job (admin)
  app.delete('/api/jobs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid job ID' });
    const deleted = await prisma.job.delete({
      where: { id },
    });
    if (!deleted) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  });

  // Submit a job application (with resume upload)
  app.post('/api/apply', upload.single('resume'), async (req, res) => {
    try {
      const { name, email, location, experience, jobId } = req.body;
      const job = await prisma.job.findUnique({
        where: { id: Number(jobId) },
      });
      if (!job) return res.status(400).json({ message: 'Invalid job' });
      if (!req.file) return res.status(400).json({ message: 'Resume required' });
      const resumeUrl = `/uploads/resumes/${req.file.filename}`;
      const appData = insertJobApplicationSchema.parse({
        name, email, location, experience, resumeUrl, jobId: Number(jobId), jobTitle: job.title
      });
      const application = await prisma.jobApplication.create({
        data: appData,
      });
      res.status(201).json(application);
    } catch (error) {
      res.status(400).json({ message: 'Invalid application data' });
    }
  });

  // List all job applications (admin)
  app.get('/api/applications', async (req, res) => {
    const applications = await prisma.jobApplication.findMany();
    res.json(applications);
  });

  // Serve uploaded resumes statically
  app.use('/uploads/resumes', (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  // Serve uploaded product images statically
  app.use('/uploads/products', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  // Gallery image upload setup
  const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/gallery/"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
    },
  });
  const galleryUpload = multer({ storage: galleryStorage });

  // GET /api/gallery?section=premises|events|others
  app.get("/api/gallery", async (req, res) => {
    const section = req.query.section as string;
    if (!section) return res.status(400).json({ message: "Section is required" });
    const images = await prisma.galleryImage.findMany({
      where: { section },
      orderBy: { uploadedAt: "desc" },
    });
    res.json(images);
  });

  // POST /api/gallery (multipart/form-data for file, or JSON for URL)
  app.post("/api/gallery", galleryUpload.single("image"), async (req, res) => {
    try {
      const section = req.body.section;
      if (!section) return res.status(400).json({ message: "Section is required" });
      let url = req.body.url;
      if (req.file) {
        url = `/uploads/gallery/${req.file.filename}`;
      }
      if (!url) return res.status(400).json({ message: "Image file or URL is required" });
      const image = await prisma.galleryImage.create({
        data: { section, url },
      });
      res.status(201).json(image);
    } catch (err: any) {
      res.status(500).json({ message: "Failed to add image", error: err.message });
    }
  });

  // DELETE /api/gallery/:id
  app.delete("/api/gallery/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid ID" });
    try {
      const image = await prisma.galleryImage.delete({ where: { id } });
      res.json({ message: "Image deleted", image });
    } catch (err: any) {
      res.status(404).json({ message: "Image not found" });
    }
  });

  router.post("/api/chatbot", async (req, res) => {
    const { message, sessionId } = req.body;
    const text = message?.toLowerCase() || "";
    let reply = "Sorry, I didn't understand that. Can you rephrase or provide more details?";

    // Session state
    let session = chatSessions[sessionId] || {};

    // Complaint flow
    if (session.awaiting === "complaint_detail") {
      session.complaint = { ...session.complaint, message };
      reply = "Thank you. Please provide your name.";
      session.awaiting = "complaint_name";
    } else if (session.awaiting === "complaint_name") {
      session.complaint = { ...session.complaint, name: message };
      reply = "And your email address?";
      session.awaiting = "complaint_email";
    } else if (session.awaiting === "complaint_email") {
      session.complaint = { ...session.complaint, email: message };
      // Store complaint
      // Store summary
      // Store summary for product inquiry
      // Store summary for product inquiry
      // Store summary for support inquiry
      // Store summary for support inquiry
      // Store summary for company info
      // Store summary for company info
      reply = "Your complaint/requirement has been submitted. Our team will contact you soon. Is there anything else I can help with?";
      session = {};
    } else if (text.includes("complaint") || text.includes("issue") || text.includes("problem") || text.includes("requirement")) {
      reply = "I'm sorry to hear that. Please describe your complaint or requirement in detail.";
      session = { awaiting: "complaint_detail", complaint: {} };
    } else if (text.includes("product") || text.includes("catalog")) {
      // Store summary for product inquiry
      // Store summary for product inquiry
    } else if (text.includes("contact") || text.includes("support") || text.includes("help")) {
      // Store summary for support inquiry
      // Store summary for support inquiry
    } else if (text.includes("company") || text.includes("about")) {
      // Store summary for company info
      // Store summary for company info
    }

    chatSessions[sessionId] = session;
    console.log("Chatbot received:", { message, sessionId, reply });
    res.json({ reply });
  });

  // Admin: Get all chatbot summaries
  router.get("/api/chatbot-summaries", (req, res) => {
    // TODO: Implement fetching chatbot summaries from the database
    res.json([]); // Placeholder
  });

  // Admin: Download summaries as Excel
  router.get("/api/chatbot-summaries/excel", (req, res) => {
    // TODO: Implement fetching chatbot summaries from the database
    const summaries: any[] = []; // Placeholder
    const ws = XLSX.utils.json_to_sheet(summaries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summaries");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.setHeader("Content-Disposition", "attachment; filename=summaries.xlsx");
    res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buf);
  });

  // Product search endpoint for navbar search bar
  router.get("/api/products", async (req, res) => {
    const { search } = req.query;
    let products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });
    if (search) {
      const s = String(search).toLowerCase();
      products = products.filter((p: any) => p.name.toLowerCase().includes(s));
    }
    res.json(products);
  });

  // Team member photo upload setup
  const teamUploadsDir = path.join(__dirname, '..', 'uploads', 'team');
  if (!fs.existsSync(teamUploadsDir)) {
    fs.mkdirSync(teamUploadsDir, { recursive: true });
  }
  const teamStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, teamUploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
  const teamUpload = multer({
    storage: teamStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Serve uploaded team photos statically
  app.use('/uploads/team', (req, res, next) => {
    const filePath = path.join(teamUploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

  // GET /api/team - list all team members
  app.get('/api/team', async (req, res) => {
    try {
      const team = await prisma.teamMember.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch team members' });
    }
  });

  // POST /api/team - add new team member (with photo)
  app.post('/api/team', teamUpload.single('photo'), async (req, res) => {
    try {
      const { name, role, bio } = req.body;
      let photoUrl = undefined;
      if (req.file) {
        photoUrl = `/uploads/team/${req.file.filename}`;
      }
      const member = await prisma.teamMember.create({
        data: { name, role, bio, photoUrl },
      });
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: 'Failed to add team member' });
    }
  });

  // PUT /api/team/:id - update team member (with optional new photo)
  app.put('/api/team/:id', teamUpload.single('photo'), async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, role, bio } = req.body;
      let photoUrl = undefined;
      if (req.file) {
        photoUrl = `/uploads/team/${req.file.filename}`;
        // Delete old photo if exists
        const old = await prisma.teamMember.findUnique({ where: { id } });
        if (old && old.photoUrl) {
          const oldPath = path.join(teamUploadsDir, path.basename(old.photoUrl));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      const data = { name, role, bio };
      if (photoUrl) Object.assign(data, { photoUrl });
      const member = await prisma.teamMember.update({ where: { id }, data });
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update team member' });
    }
  });

  // DELETE /api/team/:id - delete team member and photo
  app.delete('/api/team/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const member = await prisma.teamMember.findUnique({ where: { id } });
      if (!member) return res.status(404).json({ message: 'Not found' });
      if (member.photoUrl) {
        const photoPath = path.join(teamUploadsDir, path.basename(member.photoUrl));
        if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
      }
      await prisma.teamMember.delete({ where: { id } });
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete team member' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

