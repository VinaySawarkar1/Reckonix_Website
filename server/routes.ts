import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { ObjectId } from 'mongodb';
import { getDb } from './mongo';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from "express";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// In-memory session state for chatbot
const chatSessions: Record<string, any> = {};

// Basic email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vinaysawarkar53@gmail.com',
    pass: 'ezkxbkrtmmdodfoh',
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const whatsappFrom = '+14155238886';
const whatsappTo = '+919175240313';

async function sendAdminEmail(subject: string, body: string) {
  try {
  await transporter.sendMail({
    from: 'vinaysawarkar53@gmail.com',
    to: 'vinaysawarkar53@gmail.com',
    subject,
    text: body,
  });
  } catch (error) {
    // Console log removed for production
  }
}

async function sendAdminWhatsApp(body: string) {
  try {
  await twilioClient.messages.create({
    from: `whatsapp:${whatsappFrom}`,
    to: `whatsapp:${whatsappTo}`,
    body,
  });
  } catch (error) {
    // Console log removed for production
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory
  const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer
  const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  const productUpload = multer({
    storage: storageConfig,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 10
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Middleware
  app.use(express.json());
  app.use(express.static('uploads'));

  // File upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Simple authentication - you can modify these credentials
      if (username === 'admin' && password === 'Reckonix@#$12345') {
        res.json({
          success: true,
          user: {
            id: 'admin-001',
            username: 'admin',
            role: 'admin'
          }
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      // Console log removed for production
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  });

  // Test route
  app.get("/api/test", async (req: Request, res: Response) => {
    res.json({ message: "API routing is working!" });
  });

  // Health check endpoint for AWS load balancer
  app.get("/health", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      // Simple database connectivity check
      await db.admin().ping();
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      });
    } catch (error) {
      res.status(503).json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        error: "Database connection failed"
      });
    }
  });

  // Products routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const products = await db.collection('Product').find({}).sort({ createdAt: -1 }).toArray();
      
      // Fetch images for each product
      for (const product of products) {
        const imageQuery: any = { $or: [] };
        if (product._id) imageQuery.$or.push({ productId: product._id });
        if (typeof product.id === 'number') imageQuery.$or.push({ productId: product.id });
        
        if (imageQuery.$or.length > 0) {
          const images = await db.collection('ProductImage').find(imageQuery).toArray();
          product.images = images;
          // Set the main image field for frontend compatibility
          if (images.length > 0) {
            product.image = images[0].url;
          }
        } else {
          product.images = [];
          product.image = null;
        }
      }

      res.json(products);
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      const db = await getDb();

      let query: any;
      if (ObjectId.isValid(idParam) && idParam.length === 24) {
        query = { _id: new ObjectId(idParam) };
      } else {
        const idNum = Number(idParam);
        if (Number.isNaN(idNum)) {
        return res.status(400).json({ message: "Invalid product ID" });
        }
        query = { id: idNum };
      }

      const product: any = await db.collection('Product').findOne(query);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Fetch images
      const imageQuery: any = { $or: [] };
      if (product._id) imageQuery.$or.push({ productId: product._id });
      if (typeof product.id === 'number') imageQuery.$or.push({ productId: product.id });
      
      let images: any[] = [];
      if (imageQuery.$or.length > 0) {
        images = await db.collection('ProductImage').find(imageQuery).toArray();
      }
      product.images = images;
      // Set the main image field for frontend compatibility
      if (images.length > 0) {
        product.image = images[0].url;
      } else {
        product.image = null;
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Add product
  app.post("/api/products", productUpload.array("images", 10), async (req, res) => {
    try {
      const db = await getDb();
      const data = req.body;
      
      // Basic validation
      if (!data.name || !data.category || !data.description) {
        return res.status(400).json({ 
          message: "Missing required fields: name, category, and description are required" 
        });
      }
      
      data.createdAt = new Date();
      
      const result = await db.collection('Product').insertOne(data);
      const productId = result.insertedId;
      
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          await db.collection('ProductImage').insertOne({
            productId,
            url: `/uploads/products/${file.filename}`,
            uploadedAt: new Date()
          });
        }
      }
      
      const productWithImages = await db.collection('Product').findOne({ _id: productId });
      if (productWithImages) {
        const images = await db.collection('ProductImage').find({ productId }).toArray();
        productWithImages.images = images;
        res.status(201).json(productWithImages);
      } else {
        res.status(404).json({ message: "Product not found after creation" });
      }
    } catch (err: any) {
      res.status(500).json({ message: "Failed to add product", error: err.message });
    }
  });

  // Update product ranks - WORKING VERSION (must be before /api/products/:id)
  app.put("/api/products/rank", async (req: Request, res: Response) => {
    // Console log removed for production
    // Console log removed for production
    // Console log removed for production
    // Console log removed for production);
    
    try {
      const db = await getDb();
      const updates = req.body;
      
      // Console log removed for production
      // Console log removed for production);
      
      if (!Array.isArray(updates)) {
        // Console log removed for production
        return res.status(400).json({ message: "Updates must be an array" });
      }
      
      if (updates.length === 0) {
        // Console log removed for production
        return res.status(400).json({ message: "Updates array cannot be empty" });
      }
      
      // Process each update
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        // Console log removed for production
        // Console log removed for production
        // Console log removed for production
        // Console log removed for production
        
        // Validate ID - WORKING VERSION
        if (update.id === undefined || update.id === null || update.id === '') {
          // Console log removed for production
          return res.status(400).json({ message: "Missing or invalid id field" });
        }
        
        // Validate rank
        if (typeof update.rank !== 'number') {
          // Console log removed for production
          return res.status(400).json({ message: "Rank must be a number" });
        }
        
        // Determine query type - WORKING VERSION
        let productQuery: any;
        if (ObjectId.isValid(update.id) && update.id.length === 24) {
          productQuery = { _id: new ObjectId(update.id) };
          // Console log removed for production
        } else {
          // Handle numeric ID - WORKING VERSION
          const idNum = parseInt(String(update.id), 10);
          // Console log removed for production
          
          if (isNaN(idNum)) {
            // Console log removed for production
            return res.status(400).json({ message: "Invalid product ID" });
          }
          
          productQuery = { id: idNum };
          // Console log removed for production
        }
        
        // Console log removed for production
        
        const result = await db.collection('Product').updateOne(
          productQuery,
          { $set: { rank: update.rank, updatedAt: new Date() } }
        );
        
        // Console log removed for production
      }
      
      // Console log removed for production
      res.json({ message: "Product ranks updated successfully" });
    } catch (err: any) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to update product ranks", error: err.message });
    }
  });

  // Update product
  app.put("/api/products/:id", productUpload.array("images", 10), async (req, res) => {
    try {
      const idParam = req.params.id;
      const data = req.body;
      const db = await getDb();

      let productQuery: any;
      if (ObjectId.isValid(idParam) && idParam.length === 24) {
        productQuery = { _id: new ObjectId(idParam) };
      } else {
        const idNum = Number(idParam);
        if (Number.isNaN(idNum)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        productQuery = { id: idNum };
      }

      const product = await db.collection('Product').findOne(productQuery);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Update product fields
      await db.collection('Product').updateOne(productQuery, { $set: data });

      // Save new images if any
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          const imageDoc = {
            productId: product._id ?? product.id,
            url: `/uploads/products/${file.filename}`,
            uploadedAt: new Date()
          };
          await db.collection('ProductImage').insertOne(imageDoc);
        }
      }

      // Return updated product
      const productWithImages: any = await db.collection('Product').findOne(productQuery);
      if (productWithImages) {
        const imageQuery: any = { $or: [] };
        if (product._id) imageQuery.$or.push({ productId: product._id });
        if (typeof product.id === 'number') imageQuery.$or.push({ productId: product.id });
        
        const refreshedImages = imageQuery.$or.length > 0
          ? await db.collection('ProductImage').find(imageQuery).toArray()
          : [];
        productWithImages.images = refreshedImages;
        res.json(productWithImages);
      } else {
        res.status(404).json({ message: "Product not found after update" });
      }
    } catch (err: any) {
      res.status(500).json({ message: "Failed to update product", error: err.message });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
      const db = await getDb();

      let productQuery: any;
      if (ObjectId.isValid(idParam) && idParam.length === 24) {
        productQuery = { _id: new ObjectId(idParam) };
      } else {
        const idNum = Number(idParam);
        if (Number.isNaN(idNum)) {
        return res.status(400).json({ message: "Invalid product ID" });
        }
        productQuery = { id: idNum };
      }

      const product = await db.collection('Product').findOne(productQuery);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      await db.collection('Product').deleteOne(productQuery);
      
      // Clean up related images
      const imageDeleteQuery: any = { $or: [] };
      if (product._id) imageDeleteQuery.$or.push({ productId: product._id });
      if (typeof product.id === 'number') imageDeleteQuery.$or.push({ productId: product.id });
      if (imageDeleteQuery.$or.length > 0) {
        await db.collection('ProductImage').deleteMany(imageDeleteQuery);
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });


  // Categories route
  app.get('/api/categories', async (req, res) => {
    try {
      const db = await getDb();
      const categories = await db.collection('Category').find({}).toArray();
      const subcategories = await db.collection('Subcategory').find({}).toArray();
      
      const categoryMap: { [key: string]: any } = {};
      categories.forEach((cat: any) => {
        cat.subcategories = [];
        categoryMap[cat.id] = cat;
      });
      
      subcategories.forEach((sub: any) => {
        if (sub.categoryId && categoryMap[sub.categoryId]) {
          (categoryMap[sub.categoryId] as any).subcategories.push(sub);
        }
      });
      
      res.json(Object.values(categoryMap));
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Catalog route
  app.get('/api/catalog/main-catalog', async (req, res) => {
    try {
      const db = await getDb();
      const catalog = await db.collection('MainCatalog').findOne({});
      res.json(catalog || {});
    } catch (error) {
      // Console log removed for production
      // Return empty object as fallback instead of error
      res.json({});
    }
  });

  // Chatbot summaries route
  app.get('/api/chatbot-summaries', async (req, res) => {
    try {
      const db = await getDb();
      const summaries = await db.collection('ChatbotSummary').find({}).sort({ createdAt: -1 }).toArray();
      res.json(summaries);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch chatbot summaries' });
    }
  });

  // Save chatbot conversation
  app.post('/api/chatbot-summaries', async (req, res) => {
    try {
      const { userMessage, botResponse, userInfo } = req.body;
      
      if (!userMessage || !botResponse) {
        return res.status(400).json({ error: 'User message and bot response are required' });
      }

      const db = await getDb();
      const summary = {
        id: Date.now(),
        userMessage,
        botResponse,
        userInfo: userInfo || {},
        createdAt: new Date(),
        status: 'new'
      };

      await db.collection('ChatbotSummary').insertOne(summary);
      res.status(201).json({ success: true, message: 'Conversation saved successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to save conversation' });
    }
  });

  // Export chatbot summaries to Excel
  app.get('/api/chatbot-summaries/excel', async (req, res) => {
    try {
      const db = await getDb();
      const summaries = await db.collection('ChatbotSummary').find({}).sort({ createdAt: -1 }).toArray();
      
      // Create CSV content
      const csvContent = [
        'ID,User Message,Bot Response,User Info,Date,Status',
        ...summaries.map(s => [
          s.id,
          `"${s.userMessage.replace(/"/g, '""')}"`,
          `"${s.botResponse.replace(/"/g, '""')}"`,
          `"${JSON.stringify(s.userInfo).replace(/"/g, '""')}"`,
          s.createdAt,
          s.status
        ].join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="chatbot-summaries.csv"');
      res.send(csvContent);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to export summaries' });
    }
  });

  // Image serving is handled by the main server in index.ts

  // Team members route
  app.get('/api/team', async (req, res) => {
    try {
  const db = await getDb();
      const teamMembers = await db.collection('TeamMember').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
      res.json(teamMembers);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  // Create team member route
  app.post('/api/team', productUpload.single('photo'), async (req, res) => {
    try {
      const db = await getDb();
      const data = req.body;
      
      // Basic validation
      if (!data.name || !data.role) {
        return res.status(400).json({ 
          message: "Missing required fields: name and role are required" 
        });
      }
      
      // Get the next ID
      const lastMember = await db.collection('TeamMember').findOne({}, { sort: { id: -1 } });
      const nextId = lastMember ? lastMember.id + 1 : 1;
      
      // Prepare team member data
      const teamMemberData = {
        id: nextId,
        name: data.name,
        role: data.role,
        bio: data.bio || '',
        photoUrl: req.file ? `/uploads/products/${req.file.filename}` : null,
        createdAt: new Date(),
        rank: 0
      };
      
      const result = await db.collection('TeamMember').insertOne(teamMemberData);
      const createdMember = await db.collection('TeamMember').findOne({ _id: result.insertedId });
      
      res.status(201).json(createdMember);
    } catch (err: any) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to create team member", error: err.message });
    }
  });

  // Update team member route
  app.put('/api/team/:id', productUpload.single('photo'), async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const db = await getDb();
      
      // Remove _id from update data if present to avoid MongoDB errors
      if (updateData._id) {
        delete updateData._id;
      }
      
      // Handle photo upload
      if (req.file) {
        updateData.photoUrl = `/uploads/products/${req.file.filename}`;
      }
      
      const result = await db.collection('TeamMember').updateOne(
        { id: parseInt(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      const updatedMember = await db.collection('TeamMember').findOne({ id: parseInt(id) });
      res.json(updatedMember);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to update team member' });
    }
  });

  // Delete team member route
  app.delete('/api/team/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await getDb();
      
      const result = await db.collection('TeamMember').deleteOne({ id: parseInt(id) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      res.json({ success: true, message: 'Team member deleted successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to delete team member' });
    }
  });

  // Customers route
  app.get('/api/customers', async (req, res) => {
    try {
      const db = await getDb();
      const customers = await db.collection('Customer').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
  res.json(customers);
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Jobs route
  app.get('/api/jobs', async (req, res) => {
    try {
      const db = await getDb();
      const jobs = await db.collection('Job').find({}).sort({ createdAt: -1 }).toArray();
      res.json(jobs);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  // Events route
  app.get('/api/events', async (req, res) => {
    try {
  const db = await getDb();
      const events = await db.collection('CompanyEvent').find({}).sort({ createdAt: -1 }).toArray();
      res.json(events);
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Create event with image upload
  app.post('/api/events', productUpload.array("images", 5), async (req, res) => {
    try {
      const db = await getDb();
      const data = req.body;
      
      // Basic validation
      if (!data.title || !data.description || !data.eventDate) {
        return res.status(400).json({ 
          message: "Missing required fields: title, description, and eventDate are required" 
        });
      }
      
      // Convert eventDate to Date object
      data.eventDate = new Date(data.eventDate);
      data.createdAt = new Date();
      data.published = data.published === 'true' || data.published === true;
      data.featured = data.featured === 'true' || data.featured === true;
      
      // Handle image upload
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Use the first uploaded image as the main image
        data.imageUrl = `/uploads/products/${req.files[0].filename}`;
      }
      
      const result = await db.collection('CompanyEvent').insertOne(data);
      const eventId = result.insertedId;
      
      const createdEvent = await db.collection('CompanyEvent').findOne({ _id: eventId });
      res.status(201).json(createdEvent);
    } catch (err: any) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to create event", error: err.message });
    }
  });

  // Update event with image upload
  app.put('/api/events/:id', productUpload.array("images", 5), async (req, res) => {
    try {
      const db = await getDb();
      const eventId = parseInt(req.params.id);
      const data = req.body;
      
      // Convert eventDate to Date object if provided
      if (data.eventDate) {
        data.eventDate = new Date(data.eventDate);
      }
      
      // Convert boolean fields
      if (data.published !== undefined) {
        data.published = data.published === 'true' || data.published === true;
      }
      if (data.featured !== undefined) {
        data.featured = data.featured === 'true' || data.featured === true;
      }
      
      // Handle image upload
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Use the first uploaded image as the main image
        data.imageUrl = `/uploads/products/${req.files[0].filename}`;
      }
      
      const result = await db.collection('CompanyEvent').updateOne(
        { id: eventId },
        { $set: data }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const updatedEvent = await db.collection('CompanyEvent').findOne({ id: eventId });
      res.json(updatedEvent);
    } catch (err: any) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to update event", error: err.message });
    }
  });

  // Delete event
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const db = await getDb();
      const eventId = parseInt(req.params.id);
      
      const result = await db.collection('CompanyEvent').deleteOne({ id: eventId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (err: any) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
  });

  // Testimonials routes
  app.get('/api/testimonials', async (req, res) => {
    try {
      const db = await getDb();
      const testimonials = await db.collection('Testimonial').find({}).sort({ createdAt: -1 }).toArray();
      res.json(testimonials);
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Create testimonial
  app.post('/api/testimonials', async (req, res) => {
    try {
      const db = await getDb();
      const testimonialData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('Testimonial').insertOne(testimonialData);
      res.status(201).json({ success: true, id: result.insertedId });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to create testimonial' });
    }
  });

  // Update testimonial
  app.put('/api/testimonials/:id', async (req, res) => {
    try {
      const db = await getDb();
      const { id } = req.params;
      const { _id, ...updateData } = req.body; // Exclude _id from update data
      const finalUpdateData = {
        ...updateData,
        updatedAt: new Date()
      };
      const result = await db.collection('Testimonial').updateOne(
        { _id: new ObjectId(id) },
        { $set: finalUpdateData }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json({ success: true });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to update testimonial' });
    }
  });

  // Delete testimonial
  app.delete('/api/testimonials/:id', async (req, res) => {
    try {
      const db = await getDb();
      const { id } = req.params;
      const result = await db.collection('Testimonial').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Testimonial not found' });
      }
      res.json({ success: true });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to delete testimonial' });
    }
  });

  // Industries route
    app.get('/api/industries', async (req, res) => {
    try {
      const db = await getDb();
      const industries = await db.collection('Industry').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
  res.json(industries);
    } catch (error) {
      // Console log removed for production
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Applications route
  app.get('/api/applications', async (req, res) => {
    try {
  const db = await getDb();
      const applications = await db.collection('Application').find({}).sort({ createdAt: -1 }).toArray();
      res.json(applications);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Gallery route
  app.get('/api/gallery', async (req, res) => {
    try {
      const db = await getDb();
      const galleryItems = await db.collection('Gallery').find({}).sort({ createdAt: -1 }).toArray();
      res.json(galleryItems);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch gallery' });
    }
  });

  // Quotes route
  app.get('/api/quotes', async (req, res) => {
    try {
      const db = await getDb();
      const quotes = await db.collection('Quote').find({}).sort({ createdAt: -1 }).toArray();
      res.json(quotes);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  });

  // Post quote request
  app.post('/api/quotes', async (req, res) => {
    try {
      const db = await getDb();
      const quoteData = {
        ...req.body,
        createdAt: new Date(),
        status: 'new'
      };
      
      await db.collection('Quote').insertOne(quoteData);
      
      // Send email notification to admin
      await sendAdminEmail(
        `New Quote Request from ${quoteData.name}`,
        `Name: ${quoteData.name}\nEmail: ${quoteData.email}\nPhone: ${quoteData.phone || 'Not provided'}\nCompany: ${quoteData.company || 'Not provided'}\nProducts: ${JSON.stringify(quoteData.products, null, 2)}\nTotal Items: ${quoteData.products?.length || 0}`
      );
      
      res.status(201).json({ success: true, message: 'Quote request sent successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to send quote request' });
    }
  });

  // Update quote status
  app.put('/api/quotes/:id/status', async (req, res) => {
    try {
      const db = await getDb();
      const { id } = req.params;
      const { status } = req.body;
      
      await db.collection('Quote').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );
      
      res.json({ success: true, message: 'Quote status updated successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to update quote status' });
    }
  });

  // Messages route
  app.get('/api/messages', async (req, res) => {
    try {
  const db = await getDb();
      const messages = await db.collection('Message').find({}).sort({ createdAt: -1 }).toArray();
      res.json(messages);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Post contact message
  app.post('/api/messages', async (req, res) => {
    try {
      const db = await getDb();
      const messageData = {
        ...req.body,
        createdAt: new Date(),
        replied: false
      };
      
      await db.collection('Message').insertOne(messageData);
      
      // Send email notification to admin
      await sendAdminEmail(
        `New Contact Message from ${messageData.name}`,
        `Name: ${messageData.name}\nEmail: ${messageData.email}\nPhone: ${messageData.phone || 'Not provided'}\nSubject: ${messageData.subject}\nMessage: ${messageData.message}`
      );
      
      res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to send message' });
    }
  });

  // Update message replied status
  app.put('/api/messages/:id/replied', async (req, res) => {
    try {
      const db = await getDb();
      const { id } = req.params;
      const { replied } = req.body;
      
      await db.collection('Message').updateOne(
        { _id: new ObjectId(id) },
        { $set: { replied, updatedAt: new Date() } }
      );
      
      res.json({ success: true, message: 'Message status updated successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to update message status' });
    }
  });

  // Analytics routes
  app.get('/api/analytics/website-views', async (req, res) => {
    try {
      const db = await getDb();
      const websiteViews = await db.collection('WebsiteView').find({}).toArray();
      const totalViews = websiteViews.length;
      res.json({ totalViews });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch website views' });
    }
  });

  app.get('/api/analytics/product-views', async (req, res) => {
    try {
      const db = await getDb();
      const productViews = await db.collection('ProductView').find({}).toArray();
      const totalViews = productViews.length;
      
      // Get product details for each view
      const products = await db.collection('Product').find({}).toArray();
      const productViewData = products.map(product => ({
        _id: product._id,
        name: product.name,
        views: productViews.filter(pv => pv.productId === product.id).length
      }));
      
      res.json({ totalViews, products: productViewData });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch product views' });
    }
  });

  // Post analytics data
  app.post('/api/analytics/website-views', async (req, res) => {
    try {
      const db = await getDb();
      const newView = {
        timestamp: new Date(),
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress
      };
      await db.collection('WebsiteView').insertOne(newView);
      res.status(201).json({ success: true, message: 'Website view recorded' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to record website view' });
    }
  });

  // Media Management API endpoints
  // Get media settings
  app.get('/api/media/settings', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const settings = await db.collection('MediaSettings').findOne({});
      res.json(settings || {
        heroVideo: '/hero-video-new.mp4',
        homeAboutImage: '/generated-image (1).png',
        aboutPageImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch media settings' });
    }
  });

  // Update media settings
  app.put('/api/media/settings', async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const { heroVideo, homeAboutImage, aboutPageImage } = req.body;
      
      const updateData = {
        heroVideo: heroVideo || '/hero-video-new.mp4',
        homeAboutImage: homeAboutImage || '/generated-image (1).png',
        aboutPageImage: aboutPageImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        updatedAt: new Date()
      };

      await db.collection('MediaSettings').updateOne(
        {},
        { $set: updateData },
        { upsert: true }
      );

      res.json({ success: true, message: 'Media settings updated successfully' });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to update media settings' });
    }
  });

  // Upload media files
  const mediaUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '../uploads');
        
        if (file.fieldname === 'heroVideo') {
          uploadPath = path.join(__dirname, '../client/public');
        } else if (file.fieldname === 'homeAboutImage' || file.fieldname === 'aboutPageImage') {
          uploadPath = path.join(__dirname, '../client/public');
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        let filename = '';
        
        if (file.fieldname === 'heroVideo') {
          filename = `hero-video-${uniqueSuffix}.mp4`;
        } else if (file.fieldname === 'homeAboutImage') {
          filename = `home-about-${uniqueSuffix}.${file.originalname.split('.').pop()}`;
        } else if (file.fieldname === 'aboutPageImage') {
          filename = `about-page-${uniqueSuffix}.${file.originalname.split('.').pop()}`;
        } else {
          filename = `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`;
        }
        
        cb(null, filename);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'heroVideo') {
        if (file.mimetype.startsWith('video/')) {
          cb(null, true);
        } else {
          cb(new Error('Only video files are allowed for hero video'));
        }
      } else if (file.fieldname === 'homeAboutImage' || file.fieldname === 'aboutPageImage') {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'));
        }
      } else {
        cb(null, true);
      }
    },
    limits: {
      fileSize: 50 * 1024 * 1024 // 50MB limit
    }
  });

  // Upload media endpoint
  app.post('/api/media/upload', mediaUpload.fields([
    { name: 'heroVideo', maxCount: 1 },
    { name: 'homeAboutImage', maxCount: 1 },
    { name: 'aboutPageImage', maxCount: 1 }
  ]), async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploadedFiles: { [key: string]: string } = {};

      // Process uploaded files
      for (const fieldname in files) {
        const fileArray = files[fieldname];
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const filePath = `/${file.filename}`;
          uploadedFiles[fieldname] = filePath;
        }
      }

      // Update media settings with new file paths
      if (Object.keys(uploadedFiles).length > 0) {
        const db = await getDb();
        const currentSettings = await db.collection('MediaSettings').findOne({}) || {};
        
        const updateData = {
          ...currentSettings,
          ...uploadedFiles,
          updatedAt: new Date()
        };

        await db.collection('MediaSettings').updateOne(
          {},
          { $set: updateData },
          { upsert: true }
        );
      }

      res.json({ 
        success: true, 
        message: 'Media files uploaded successfully',
        files: uploadedFiles
      });
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to upload media files' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
