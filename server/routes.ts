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
      res.status(500).json({ message: "Failed to fetch products" });
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
      
      let images = [];
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
      res.status(500).json({ error: 'Failed to fetch categories' });
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

  const httpServer = createServer(app);
  return httpServer;
}
