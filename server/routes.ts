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
    console.error('Failed to send email:', error);
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
    console.error('Failed to send WhatsApp:', error);
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
      if (username === 'admin' && password === 'admin123') {
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
      console.error('Login error:', error);
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
      console.error('Logout error:', error);
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
          product.images = await db.collection('ProductImage').find(imageQuery).toArray();
        } else {
          product.images = [];
        }
      }

      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      console.error('Error fetching categories:', error);
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
      console.error('Error fetching catalog:', error);
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
      console.error('Error fetching chatbot summaries:', error);
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
      res.json({ success: true, message: 'Conversation saved successfully' });
    } catch (error) {
      console.error('Error saving chatbot summary:', error);
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
      console.error('Error exporting chatbot summaries:', error);
      res.status(500).json({ error: 'Failed to export summaries' });
    }
  });

  // Serve uploaded files
  app.use('/uploads/products', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
  } else {
      res.status(404).send('File not found');
    }
  });

  // Team members route
  app.get('/api/team', async (req, res) => {
    try {
  const db = await getDb();
      const teamMembers = await db.collection('TeamMember').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
      res.json(teamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  // Update team member route
  app.put('/api/team/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
  const db = await getDb();
      
      // Remove _id from update data if present to avoid MongoDB errors
      if (updateData._id) {
        delete updateData._id;
      }
      
      const result = await db.collection('TeamMember').updateOne(
        { id: parseInt(id) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Team member not found' });
      }
      
      res.json({ success: true, message: 'Team member updated successfully' });
    } catch (error) {
      console.error('Error updating team member:', error);
      res.status(500).json({ error: 'Failed to update team member' });
    }
  });

  // Customers route
  app.get('/api/customers', async (req, res) => {
    try {
      const db = await getDb();
      const customers = await db.collection('Customer').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
  res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
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
      console.error('Error fetching jobs:', error);
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
      console.error('Error fetching events:', error);
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Testimonials route
  app.get('/api/testimonials', async (req, res) => {
    try {
      const db = await getDb();
      const testimonials = await db.collection('Testimonial').find({}).sort({ createdAt: -1 }).toArray();
      res.json(testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Return empty array as fallback instead of error
      res.json([]);
    }
  });

  // Industries route
    app.get('/api/industries', async (req, res) => {
    try {
      const db = await getDb();
      const industries = await db.collection('Industry').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
  res.json(industries);
    } catch (error) {
      console.error('Error fetching industries:', error);
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
      console.error('Error fetching applications:', error);
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
      console.error('Error fetching gallery:', error);
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
      console.error('Error fetching quotes:', error);
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  });

  // Messages route
  app.get('/api/messages', async (req, res) => {
    try {
  const db = await getDb();
      const messages = await db.collection('Message').find({}).sort({ createdAt: -1 }).toArray();
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
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
      console.error('Error fetching website views:', error);
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
      console.error('Error fetching product views:', error);
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
      res.json({ success: true, message: 'Website view recorded' });
    } catch (error) {
      console.error('Error recording website view:', error);
      res.status(500).json({ error: 'Failed to record website view' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
