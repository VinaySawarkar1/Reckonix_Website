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
    to: 'sales@reckonix.co.in',
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
      fileSize: 10 * 1024 * 1024, // 10MB to match frontend
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

  // Configure multer for FormData parsing (text fields + files)
  const productFormUpload = multer({
    storage: storageConfig,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB to match frontend
      files: 10
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  }).any(); // Accept all fields and files

  // Middleware
  app.use(express.json());
  // Serve static files with no-cache headers for images
  app.use('/uploads', (req, res, next) => {
    if (req.path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  }, express.static('uploads'));

  // File upload configuration
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Create resumes directory if it doesn't exist
      const resumesDir = path.join(__dirname, '../uploads/resumes');
      if (!fs.existsSync(resumesDir)) {
        fs.mkdirSync(resumesDir, { recursive: true });
      }
      cb(null, resumesDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    }
  });

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
    console.log('✅ Test endpoint hit');
    res.json({ message: "API routing is working!", timestamp: new Date().toISOString() });
  });

  // Health check endpoint for AWS load balancer
  app.get("/health", async (req: Request, res: Response) => {
    try {
      console.log('🔍 Health check requested');
      const db = await getDb();
      // Simple database connectivity check
      await db.admin().ping();
      console.log('✅ Health check passed');
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version
      });
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      res.status(503).json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
        details: error.message
      });
    }
  });

  // Products routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const products = await db.collection('Product').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
      
      console.log(`🔍 Found ${products.length} products`);
      
      // Get all product IDs (both numeric and ObjectId) for batch image query
      const productIds = products.map(p => p.id).filter(id => typeof id === 'number');
      const productObjectIds = products.map(p => p._id).filter(id => id);
      
      console.log(`📊 Product numeric IDs: ${productIds.length}, ObjectIds: ${productObjectIds.length}`);
      
      // Fetch all images using both numeric IDs and ObjectIds
      const allImages = await db.collection('ProductImage').find({ 
        $or: [
          { productId: { $in: productIds } },
          { productId: { $in: productObjectIds.map(id => new ObjectId(id)) } }
        ]
      }).toArray();
      
      console.log(`🖼️  Found ${allImages.length} product images`);
      
      // Group images by productId
      const imagesByProductId = allImages.reduce((acc, image) => {
        const productId = image.productId;
        if (!acc[productId]) acc[productId] = [];
        acc[productId].push(image);
        return acc;
      }, {} as Record<string, any[]>);
      
      // Map fields for frontend compatibility and assign images
      for (const product of products) {
        // Ensure product has a numeric ID for frontend compatibility
        if (!product.id && product._id) {
          // Generate a numeric ID if missing
          const lastProduct = await db.collection('Product').findOne({}, { sort: { id: -1 } });
          const nextId = lastProduct ? (lastProduct.id || 0) + 1 : 1;
          product.id = nextId;
          
          // Update the product in database with numeric ID
          await db.collection('Product').updateOne(
            { _id: product._id },
            { $set: { id: nextId } }
          );
        }
        
        // Map description to shortDescription for frontend compatibility
        if (product.description) {
          product.shortDescription = product.description;
        } else if (product.shortDescription) {
          product.shortDescription = product.shortDescription;
        }
        
        // Find images using both numeric ID and ObjectId
        const productId = product.id;
        const productObjectId = product._id;
        let images = imagesByProductId[productId] || imagesByProductId[productObjectId?.toString()] || [];
        
        product.images = images;
        
        // Set the main image field for frontend compatibility
        if (images.length > 0) {
          product.image = images[0].url;
          console.log(`✅ Product ${product.name} has ${images.length} images`);
        } else {
          product.image = null; // No fallback - only show images from database
          console.log(`⚠️  Product ${product.name} has no images from database`);
        }
      }

      console.log(`✅ Returning ${products.length} products with images`);
      res.json(products);
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
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

      // Map description to shortDescription for frontend compatibility
      // Always use description if it exists, regardless of shortDescription
      if (product.description) {
        product.shortDescription = product.description;
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
  app.post("/api/products", productFormUpload, async (req, res) => {
    try {
      const db = await getDb();

      // Extract data from multer parsed fields
      const data: any = {};

      // Process text fields from req.body (parsed by multer) with improved JSON handling
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (value && typeof value === 'string') {
          try {
            // Try to parse JSON for complex fields
            const parsed = JSON.parse(value);
            // Ensure arrays/objects are properly typed
            if (Array.isArray(parsed)) {
              data[key] = parsed;
            } else if (typeof parsed === 'object' && parsed !== null) {
              data[key] = parsed;
            } else {
              data[key] = parsed;
            }
          } catch (parseError) {
            // If parsing fails, treat as string and set defaults for expected complex fields
            data[key] = value;
            // Set defaults for complex fields if empty
            if (key === 'specifications' && !data.specifications) data.specifications = [];
            if (key === 'featuresBenefits' && !data.featuresBenefits) data.featuresBenefits = [];
            if (key === 'applications' && !data.applications) data.applications = [];
            if (key === 'certifications' && !data.certifications) data.certifications = [];
            if (key === 'technicalDetails' && !data.technicalDetails) data.technicalDetails = { dimensions: '', weight: '', powerRequirements: '', operatingConditions: '', warranty: '', compliance: [] };
            if (key === 'imageGallery' && !data.imageGallery) data.imageGallery = [];
          }
        } else {
          data[key] = value || '';
        }
      });

      // Basic validation - require shortDescription as frontend sends it
      if (!data.name?.trim() || !data.category?.trim() || !data.shortDescription?.trim()) {
        return res.status(400).json({
          message: "Missing required fields: name, category, and shortDescription are required"
        });
      }

      // Map shortDescription to description for DB consistency
      if (data.shortDescription) {
        data.description = data.shortDescription;
      }

      data.createdAt = new Date();

      // Generate a numeric ID for frontend compatibility
      const lastProduct = await db.collection('Product').findOne({}, { sort: { id: -1 } });
      const nextId = lastProduct ? (lastProduct.id || 0) + 1 : 1;
      data.id = nextId;

      const result = await db.collection('Product').insertOne(data);
      const productId = result.insertedId;

      // Handle uploaded files from req.files
      if (req.files && typeof req.files === 'object') {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Process image files
        if (files.images && Array.isArray(files.images)) {
          for (const file of files.images) {
            await db.collection('ProductImage').insertOne({
              productId,
              url: `/uploads/products/${file.filename}`,
              uploadedAt: new Date()
            });
          }
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
  app.put("/api/products/:id", productFormUpload, async (req, res) => {
    try {
      const idParam = req.params.id;
      const db = await getDb();

      // Extract data from multer parsed fields
      const data: any = {};

      // Process text fields from req.body (parsed by multer) with improved JSON handling
      Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        if (value && typeof value === 'string') {
          try {
            // Try to parse JSON for complex fields
            const parsed = JSON.parse(value);
            // Ensure arrays/objects are properly typed
            if (Array.isArray(parsed)) {
              data[key] = parsed;
            } else if (typeof parsed === 'object' && parsed !== null) {
              data[key] = parsed;
            } else {
              data[key] = parsed;
            }
          } catch (parseError) {
            // If parsing fails, treat as string and set defaults for expected complex fields
            data[key] = value;
            // Set defaults for complex fields if empty
            if (key === 'specifications' && !data.specifications) data.specifications = [];
            if (key === 'featuresBenefits' && !data.featuresBenefits) data.featuresBenefits = [];
            if (key === 'applications' && !data.applications) data.applications = [];
            if (key === 'certifications' && !data.certifications) data.certifications = [];
            if (key === 'technicalDetails' && !data.technicalDetails) data.technicalDetails = { dimensions: '', weight: '', powerRequirements: '', operatingConditions: '', warranty: '', compliance: [] };
            if (key === 'imageGallery' && !data.imageGallery) data.imageGallery = [];
          }
        } else {
          data[key] = value || '';
        }
      });
      

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
      // Map shortDescription to description for DB consistency if provided
      if (data.shortDescription) {
        data.description = data.shortDescription;
      }
      
      // Always update both fields to ensure consistency
      const updateData = { ...data };
      if (updateData.shortDescription) {
        updateData.description = updateData.shortDescription;
      }
      
      await db.collection('Product').updateOne(productQuery, { $set: updateData });

      // Handle image updates - completely replace all images
      // Delete all existing images for this product using both ObjectId and numeric ID (number and string)
      const deleteQuery = { $or: [] };
      if (product._id) {
        deleteQuery.$or.push({ productId: product._id });
      }
      if (product.id) {
        const numId = product.id;
        const strId = numId.toString();
        deleteQuery.$or.push({ productId: numId });
        deleteQuery.$or.push({ productId: strId });
      }
      
      const deleteResult = await db.collection('ProductImage').deleteMany(deleteQuery);
      
      // Process imageGallery data (this contains the final state of all images)
      let finalImageGallery = [];
      if (data.imageGallery) {
        try {
          let imageGallery;
          
          // Handle both string and object formats
          if (typeof data.imageGallery === 'string') {
            // Check if it's a JSON string or the problematic '[object Object]' format
            if (data.imageGallery.includes('[object Object]')) {
              finalImageGallery = [];
            } else {
              try {
                imageGallery = JSON.parse(data.imageGallery);
              } catch (parseError) {
                // Try to extract the valid JSON part from the string
                const jsonMatch = data.imageGallery.match(/\[.*\]/);
                if (jsonMatch) {
                  try {
                    imageGallery = JSON.parse(jsonMatch[0]);
                  } catch {
                    imageGallery = [];
                  }
                } else {
                  imageGallery = [];
                }
              }
            }
          } else if (Array.isArray(data.imageGallery)) {
            imageGallery = data.imageGallery;
          } else {
            imageGallery = [];
          }
          
          if (imageGallery) {
            finalImageGallery = imageGallery || [];
          }
          console.log('BACKEND - Received imageGallery:', finalImageGallery);
        } catch (error) {
          console.error('Error processing imageGallery:', error);
          console.log('BACKEND - Raw imageGallery data:', data.imageGallery);
          finalImageGallery = [];
        }
      }
      
      // Process new uploaded files and update the imageGallery with actual file URLs
      if (req.files && typeof req.files === 'object') {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Process image files
        if (files.images && Array.isArray(files.images)) {
          const uploadedFiles = files.images;
          console.log('BACKEND - Received uploaded files:', uploadedFiles.length);
          let fileIndex = 0;

          // Update new images in the gallery with actual uploaded file URLs
          finalImageGallery = finalImageGallery.map((img: any) => {
            if (img.isNew && img.url && img.url.startsWith('NEW_IMAGE_') && fileIndex < uploadedFiles.length) {
              const uploadedFile = uploadedFiles[fileIndex];
              fileIndex++;
              console.log('BACKEND - Updating image URL:', img.url, '->', `/uploads/products/${uploadedFile.filename}`);
              return {
                ...img,
                url: `/uploads/products/${uploadedFile.filename}`,
                isNew: false // Mark as processed
              };
            }
            return img;
          });

          // If we have more files than NEW_IMAGE_ placeholders, add them as new images
          while (fileIndex < uploadedFiles.length) {
            const uploadedFile = uploadedFiles[fileIndex];
            fileIndex++;
            finalImageGallery.push({
              id: `new_${Date.now()}_${fileIndex}`,
              url: `/uploads/products/${uploadedFile.filename}`,
              isNew: false
            });
            console.log('BACKEND - Added extra image:', `/uploads/products/${uploadedFile.filename}`);
          }
        }
      }
      
      console.log('BACKEND - Final imageGallery before insert:', finalImageGallery);
      
      // Insert all final images into the database (filter out placeholder URLs)
      const validImages = finalImageGallery.filter((img: any) => 
        img.url && !img.url.startsWith('NEW_IMAGE_')
      );
      
      if (validImages.length > 0) {
        const imageDocs = validImages.map((img: any) => ({
          productId: product._id,
          url: img.url,
          isNew: img.isNew || false,
          createdAt: new Date()
        }));
        
        await db.collection('ProductImage').insertMany(imageDocs);
        console.log('BACKEND - Inserted images:', imageDocs.length);
      } else {
        console.log('BACKEND - No valid images to insert');
      }

      // Return updated product
      const productWithImages: any = await db.collection('Product').findOne(productQuery);
      if (productWithImages) {
        // Map description to shortDescription for frontend compatibility
        // Always use description if it exists, regardless of shortDescription
        if (productWithImages.description) {
          productWithImages.shortDescription = productWithImages.description;
        }
        
        const imageQuery: any = { $or: [] };
        if (product._id) imageQuery.$or.push({ productId: product._id });
        if (product.id) {
          const numId = product.id;
          const strId = numId.toString();
          imageQuery.$or.push({ productId: numId });
          if (strId !== numId.toString()) {
            imageQuery.$or.push({ productId: strId });
          }
        }
        
        console.log('BACKEND - Fetching images with query:', imageQuery);
        const refreshedImages = imageQuery.$or.length > 0
          ? await db.collection('ProductImage').find(imageQuery).toArray()
          : [];
        console.log('BACKEND - Fetched images from DB:', refreshedImages);
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
      
      // Build nested subcategory structure
      const subcategoryMap: { [key: string]: any } = {};
      const rootSubcategories: any[] = [];
      
      // First pass: create all subcategory objects
      subcategories.forEach((sub: any) => {
        subcategoryMap[sub.id] = {
          name: sub.name,
          children: []
        };
      });
      
      // Second pass: build the tree structure
      subcategories.forEach((sub: any) => {
        if (sub.parentId === null || sub.parentId === undefined) {
          // Root level subcategory
          if (sub.categoryId && categoryMap[sub.categoryId]) {
            (categoryMap[sub.categoryId] as any).subcategories.push(subcategoryMap[sub.id]);
          }
        } else {
          // Child subcategory - add to parent's children
          if (subcategoryMap[sub.parentId]) {
            subcategoryMap[sub.parentId].children.push(subcategoryMap[sub.id]);
          }
        }
      });
      
      res.json(Object.values(categoryMap));
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.json([]);
    }
  });

  // Create category
  app.post('/api/categories', async (req, res) => {
    try {
      const { name, subcategories } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const db = await getDb();
      
      // Get the next ID
      const lastCategory = await db.collection('Category').findOne({}, { sort: { id: -1 } });
      const nextId = lastCategory ? lastCategory.id + 1 : 1;
      
      // Create the category
      const category = {
        id: nextId,
        name: name.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('Category').insertOne(category);
      
      // Handle subcategories if provided
      if (subcategories && Array.isArray(subcategories)) {
        const subcategoryDocs = [];
        let subId = 1;
        
        // Get the last subcategory ID
        const lastSubcategory = await db.collection('Subcategory').findOne({}, { sort: { id: -1 } });
        if (lastSubcategory) {
          subId = lastSubcategory.id + 1;
        }
        
        const processSubcategories = (subs: any[], parentId: number | null = null) => {
          subs.forEach((sub: any) => {
            const subName = typeof sub === 'string' ? sub : sub.name;
            if (subName) {
              subcategoryDocs.push({
                id: subId++,
                name: subName,
                categoryId: nextId,
                parentId: parentId,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              
              // Process children if they exist
              if (sub.children && Array.isArray(sub.children)) {
                processSubcategories(sub.children, subId - 1);
              }
            }
          });
        };
        
        processSubcategories(subcategories);
        
        if (subcategoryDocs.length > 0) {
          await db.collection('Subcategory').insertMany(subcategoryDocs);
        }
      }
      
      res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category
  app.put('/api/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, subcategories } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Category name is required" });
      }

      const db = await getDb();
      const categoryId = parseInt(id);
      
      // Update the category
      const updateResult = await db.collection('Category').updateOne(
        { id: categoryId },
        { 
          $set: { 
            name: name.trim(),
            updatedAt: new Date()
          }
        }
      );
      
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Delete existing subcategories for this category
      await db.collection('Subcategory').deleteMany({ categoryId: categoryId });
      
      // Add new subcategories if provided
      if (subcategories && Array.isArray(subcategories)) {
        const subcategoryDocs = [];
        let subId = 1;
        
        // Get the last subcategory ID
        const lastSubcategory = await db.collection('Subcategory').findOne({}, { sort: { id: -1 } });
        if (lastSubcategory) {
          subId = lastSubcategory.id + 1;
        }
        
        const processSubcategories = (subs: any[], parentId: number | null = null) => {
          subs.forEach((sub: any) => {
            const subName = typeof sub === 'string' ? sub : sub.name;
            if (subName) {
              subcategoryDocs.push({
                id: subId++,
                name: subName,
                categoryId: categoryId,
                parentId: parentId,
                createdAt: new Date(),
                updatedAt: new Date()
              });
              
              // Process children if they exist
              if (sub.children && Array.isArray(sub.children)) {
                processSubcategories(sub.children, subId - 1);
              }
            }
          });
        };
        
        processSubcategories(subcategories);
        
        if (subcategoryDocs.length > 0) {
          await db.collection('Subcategory').insertMany(subcategoryDocs);
        }
      }
      
      // Fetch and return the updated category with subcategories
      const updatedCategory = await db.collection('Category').findOne({ id: categoryId });
      const updatedSubcategories = await db.collection('Subcategory').find({ categoryId: categoryId }).toArray();
      
      // Build nested subcategory structure for response
      const subcategoryMap: { [key: string]: any } = {};
      
      // First pass: create all subcategory objects
      updatedSubcategories.forEach((sub: any) => {
        subcategoryMap[sub.id] = {
          name: sub.name,
          children: []
        };
      });
      
      // Second pass: build the tree structure
      const rootSubcategories: any[] = [];
      updatedSubcategories.forEach((sub: any) => {
        if (sub.parentId === null || sub.parentId === undefined) {
          // Root level subcategory
          rootSubcategories.push(subcategoryMap[sub.id]);
        } else {
          // Child subcategory - add to parent's children
          if (subcategoryMap[sub.parentId]) {
            subcategoryMap[sub.parentId].children.push(subcategoryMap[sub.id]);
          }
        }
      });
      
      const response = {
        ...updatedCategory,
        subcategories: rootSubcategories
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete category
  app.delete('/api/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const categoryId = parseInt(id);
      
      const db = await getDb();
      
      // Delete the category
      const categoryResult = await db.collection('Category').deleteOne({ id: categoryId });
      
      if (categoryResult.deletedCount === 0) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Delete all subcategories for this category
      await db.collection('Subcategory').deleteMany({ categoryId: categoryId });
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Subcategory routes
  app.get('/api/subcategories', async (req, res) => {
    try {
      const db = await getDb();
      const subcategories = await db.collection('Subcategory').find({}).toArray();
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.get('/api/subcategories/category/:categoryId', async (req, res) => {
    try {
      const { categoryId } = req.params;
      const db = await getDb();
      const subcategories = await db.collection('Subcategory').find({ 
        categoryId: parseInt(categoryId) 
      }).toArray();
      res.json(subcategories);
    } catch (error) {
      console.error('Error fetching subcategories for category:', error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.post('/api/subcategories', async (req, res) => {
    try {
      const { name, categoryId, parentId } = req.body;
      
      if (!name || !categoryId) {
        return res.status(400).json({ message: "Name and categoryId are required" });
      }

      const db = await getDb();
      
      // Get the next ID
      const lastSubcategory = await db.collection('Subcategory').findOne({}, { sort: { id: -1 } });
      const nextId = lastSubcategory ? lastSubcategory.id + 1 : 1;
      
      const subcategory = {
        id: nextId,
        name: name.trim(),
        categoryId: parseInt(categoryId),
        parentId: parentId ? parseInt(parentId) : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('Subcategory').insertOne(subcategory);
      res.status(201).json({ message: "Subcategory created successfully", subcategory });
    } catch (error) {
      console.error('Error creating subcategory:', error);
      res.status(500).json({ message: "Failed to create subcategory" });
    }
  });

  app.put('/api/subcategories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, categoryId, parentId } = req.body;
      
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const db = await getDb();
      const subcategoryId = parseInt(id);
      
      const updateResult = await db.collection('Subcategory').updateOne(
        { id: subcategoryId },
        { 
          $set: { 
            name: name.trim(),
            categoryId: categoryId ? parseInt(categoryId) : undefined,
            parentId: parentId ? parseInt(parentId) : null,
            updatedAt: new Date()
          }
        }
      );
      
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      
      res.json({ message: "Subcategory updated successfully" });
    } catch (error) {
      console.error('Error updating subcategory:', error);
      res.status(500).json({ message: "Failed to update subcategory" });
    }
  });

  app.delete('/api/subcategories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const subcategoryId = parseInt(id);
      
      const db = await getDb();
      
      // Delete the subcategory
      const result = await db.collection('Subcategory').deleteOne({ id: subcategoryId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      
      // Delete all child subcategories
      await db.collection('Subcategory').deleteMany({ parentId: subcategoryId });
      
      res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      res.status(500).json({ message: "Failed to delete subcategory" });
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

  // Customers routes
  app.get('/api/customers', async (req, res) => {
    try {
      const db = await getDb();
      const customers = await db.collection('Customer').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
      res.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.json([]);
    }
  });

  // Create customer
  app.post('/api/customers', async (req, res) => {
    try {
      const db = await getDb();
      const customerData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('Customer').insertOne(customerData);
      res.status(201).json({ 
        message: "Customer created successfully", 
        id: result.insertedId 
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: "Failed to create customer", error: error.message });
    }
  });

  // Update customer
  app.put('/api/customers/:id', async (req, res) => {
    try {
      const db = await getDb();
      const customerId = req.params.id;
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };
      
      // Try both numeric and ObjectId formats
      const numericId = parseInt(customerId);
      let result;
      
      if (customerId.length === 24 && /^[0-9a-fA-F]{24}$/.test(customerId)) {
        const { ObjectId } = await import('mongodb');
        result = await db.collection('Customer').updateOne(
          { _id: new ObjectId(customerId) },
          { $set: updateData }
        );
      } else {
        result = await db.collection('Customer').updateOne(
          { $or: [{ id: numericId }, { _id: new ObjectId(customerId) }] },
          { $set: updateData }
        );
      }
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json({ message: "Customer updated successfully" });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({ message: "Failed to update customer", error: error.message });
    }
  });

  // Delete customer
  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const db = await getDb();
      const customerId = req.params.id;
      
      // Try both numeric and ObjectId formats
      const numericId = parseInt(customerId);
      let result;
      
      if (customerId.length === 24 && /^[0-9a-fA-F]{24}$/.test(customerId)) {
        const { ObjectId } = await import('mongodb');
        result = await db.collection('Customer').deleteOne({ _id: new ObjectId(customerId) });
      } else {
        result = await db.collection('Customer').deleteOne(
          { $or: [{ id: numericId }, { _id: new ObjectId(customerId) }] }
        );
      }
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }
      
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ message: "Failed to delete customer", error: error.message });
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
      
      // Ensure all events have both _id and id fields for frontend compatibility
      const eventsWithIds = events.map(event => ({
        ...event,
        id: event.id || event._id,
        _id: event._id
      }));
      
      res.json(eventsWithIds);
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
      
      // Generate a numeric ID for frontend compatibility
      const numericId = Date.now();
      await db.collection('CompanyEvent').updateOne(
        { _id: eventId },
        { $set: { id: numericId } }
      );
      
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
      const eventId = req.params.id;
      const data = req.body;
      
      console.log('Updating event with ID:', eventId);
      console.log('Update data:', data);
      
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
      
      // Remove immutable fields from update data
      delete data._id;
      delete data.id;
      delete data.createdAt;
      
      // Handle both numeric IDs and ObjectIds
      let query;
      if (eventId && !isNaN(parseInt(eventId))) {
        // Numeric ID
        query = { id: parseInt(eventId) };
      } else if (eventId && eventId.length === 24) {
        // ObjectId
        query = { _id: new ObjectId(eventId) };
      } else {
        // Try both approaches
        query = { $or: [{ id: parseInt(eventId) }, { _id: new ObjectId(eventId) }] };
      }

      const result = await db.collection('CompanyEvent').updateOne(query, { $set: data });
      
      console.log('Update result:', result);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      const updatedEvent = await db.collection('CompanyEvent').findOne(query);
      
      console.log('Updated event:', updatedEvent);
      res.json(updatedEvent);
    } catch (err: any) {
      console.error('Event update error:', err);
      res.status(500).json({ message: "Failed to update event", error: err.message });
    }
  });

  // Get single event
  app.get('/api/events/:id', async (req, res) => {
    try {
      const db = await getDb();
      const eventId = req.params.id;
      
      // Handle both numeric IDs and ObjectIds
      let query;
      if (eventId && !isNaN(parseInt(eventId))) {
        // Numeric ID
        query = { id: parseInt(eventId) };
      } else if (eventId && eventId.length === 24) {
        // ObjectId
        query = { _id: new ObjectId(eventId) };
      } else {
        // Try both approaches
        query = { $or: [{ id: parseInt(eventId) }, { _id: new ObjectId(eventId) }] };
      }
      
      const event = await db.collection('CompanyEvent').findOne(query);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event", error: error.message });
    }
  });

  // Delete event
  app.delete('/api/events/:id', async (req, res) => {
    try {
      const db = await getDb();
      const eventId = req.params.id;
      
      console.log('Deleting event with ID:', eventId);
      
      // Try both numeric and ObjectId formats
      const numericId = parseInt(eventId);
      let result;
      
      // First try with ObjectId if it looks like one
      if (eventId.length === 24 && /^[0-9a-fA-F]{24}$/.test(eventId)) {
        const { ObjectId } = await import('mongodb');
        result = await db.collection('CompanyEvent').deleteOne({ _id: new ObjectId(eventId) });
      } else {
        // Try numeric ID and string ID
        result = await db.collection('CompanyEvent').deleteOne({ 
          $or: [
            { id: numericId }, 
            { id: parseInt(eventId) },
            { _id: new ObjectId(eventId) }
          ] 
        });
      }
      
      console.log('Delete result:', result);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (err: any) {
      console.error('Event deletion error:', err);
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

  // Industries routes
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

  // Create industry
  app.post('/api/industries', async (req, res) => {
    try {
      const db = await getDb();
      const { name, description, icon, rank } = req.body;
      
      // Generate a numeric ID
      const lastIndustry = await db.collection('Industry').findOne({}, { sort: { id: -1 } });
      const nextId = lastIndustry ? (lastIndustry.id || 0) + 1 : 1;
      
      const industryData = {
        id: nextId,
        name,
        description,
        icon,
        rank: rank || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await db.collection('Industry').insertOne(industryData);
      
      res.status(201).json({ 
        success: true, 
        message: 'Industry created successfully',
        industry: { ...industryData, _id: result.insertedId }
      });
    } catch (error) {
      console.error('Error creating industry:', error);
      res.status(500).json({ error: 'Failed to create industry' });
    }
  });

  // Update industry
  app.put('/api/industries/:id', async (req, res) => {
    try {
      const db = await getDb();
      const industryId = req.params.id;
      const { name, description, icon, rank } = req.body;
      
      const updateData = {
        name,
        description,
        icon,
        rank: rank || 0,
        updatedAt: new Date()
      };
      
      const result = await db.collection('Industry').updateOne(
        { id: parseInt(industryId) },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Industry not found' });
      }
      
      
      res.json({ 
        success: true, 
        message: 'Industry updated successfully',
        industry: { id: parseInt(industryId), ...updateData }
      });
    } catch (error) {
      console.error('Error updating industry:', error);
      res.status(500).json({ error: 'Failed to update industry' });
    }
  });

  // Delete industry
  app.delete('/api/industries/:id', async (req, res) => {
    try {
      const db = await getDb();
      const industryId = req.params.id;
      
      const result = await db.collection('Industry').deleteOne({ id: parseInt(industryId) });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Industry not found' });
      }
      
      
      res.json({ 
        success: true, 
        message: 'Industry deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting industry:', error);
      res.status(500).json({ error: 'Failed to delete industry' });
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

  // Job application submission route
  app.post('/api/apply', upload.single('resume'), async (req, res) => {
    try {
      const db = await getDb();
      const { name, email, phone, location, experience, jobId } = req.body;
      
      // Validate required fields
      if (!name || !email || !location || !experience || !jobId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get job details to include job title
      let job;
      try {
        job = await db.collection('Job').findOne({ _id: new ObjectId(jobId) });
      } catch (error) {
        // If ObjectId conversion fails, try finding by string ID
        job = await db.collection('Job').findOne({ _id: jobId });
      }
      
      if (!job) {
        return res.status(400).json({ error: 'Job not found' });
      }

      // Handle file upload if resume is provided
      let resumeUrl = '';
      if (req.file) {
        resumeUrl = `/uploads/resumes/${req.file.filename}`;
      }

      // Create application document
      const application = {
        name,
        email,
        phone: phone || '',
        location,
        experience,
        jobId,
        jobTitle: job.title,
        resumeUrl,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert application into database
      const result = await db.collection('Application').insertOne(application);
      
      res.status(201).json({ 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: result.insertedId 
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Request body:', req.body);
      console.error('Request file:', req.file);
      res.status(500).json({ error: 'Failed to submit application', details: error.message });
    }
  });

  // Gallery routes
  app.get('/api/gallery', async (req, res) => {
    try {
      const db = await getDb();
      const section = req.query.section;
      
      let query = {};
      if (section) {
        query = { section: section };
      }
      
      const galleryItems = await db.collection('Gallery').find(query).sort({ createdAt: -1 }).toArray();
      
      // Ensure each item has both _id and id fields for frontend compatibility
      const itemsWithIds = galleryItems.map(item => ({
        ...item,
        id: item.id || item._id.toString()
      }));
      
      res.json(itemsWithIds);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ error: 'Failed to fetch gallery' });
    }
  });

  // Create gallery item with file upload
  app.post('/api/gallery', productUpload.single("image"), async (req, res) => {
    try {
      const db = await getDb();
      const { section, url, title, description } = req.body;
      
      // Validate required fields
      if (!section) {
        return res.status(400).json({ message: "Section is required" });
      }
      
      if (!req.file && !url) {
        return res.status(400).json({ message: "Either image file or URL is required" });
      }
      
      const galleryData = {
        section,
        url: req.file ? `/uploads/products/${req.file.filename}` : url,
        title: title || '',
        description: description || '',
        createdAt: new Date(),
        type: req.file ? 'uploaded' : 'url'
      };
      
      const result = await db.collection('Gallery').insertOne(galleryData);
      
      // Add a numeric ID for frontend compatibility
      const numericId = Date.now();
      await db.collection('Gallery').updateOne(
        { _id: result.insertedId },
        { $set: { id: numericId } }
      );
      
      const createdItem = await db.collection('Gallery').findOne({ _id: result.insertedId });
      
      // Ensure the response has both _id and id fields
      const itemWithId = {
        ...createdItem,
        id: createdItem.id || createdItem._id.toString()
      };
      
      res.status(201).json(itemWithId);
    } catch (error) {
      // Console log removed for production
      res.status(500).json({ message: "Failed to create gallery item", error: error.message });
    }
  });

  // Delete gallery item
  app.delete('/api/gallery/:id', async (req, res) => {
    try {
      const db = await getDb();
      const itemId = req.params.id;
      
      console.log('Deleting gallery item with ID:', itemId);
      
      // Handle both MongoDB ObjectId and string ID
      let query;
      if (ObjectId.isValid(itemId) && itemId.length === 24) {
        query = { _id: new ObjectId(itemId) };
        console.log('Using ObjectId query:', query);
      } else if (itemId && !isNaN(parseInt(itemId))) {
        // Numeric ID
        query = { id: parseInt(itemId) };
        console.log('Using numeric ID query:', query);
      } else {
        // String ID
        query = { id: itemId };
        console.log('Using string ID query:', query);
      }
      
      const result = await db.collection('Gallery').deleteOne(query);
      console.log('Delete result:', result);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Gallery item not found" });
      }
      
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error('Gallery deletion error:', error);
      res.status(500).json({ message: "Failed to delete gallery item", error: error.message });
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
  app.get('/api/analytics', async (req, res) => {
    try {
      const db = await getDb();
      const websiteViews = await db.collection('WebsiteView').find({}).toArray();
      const productViews = await db.collection('ProductView').find({}).toArray();
      const totalWebsiteViews = websiteViews.length;
      const totalProductViews = productViews.length;
      
      res.json({ 
        totalViews: totalWebsiteViews,
        totalProductViews: totalProductViews,
        topViewedProducts: [] // Could be implemented later
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

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

  // Upload industry images
  const industryUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const industryDir = path.join(__dirname, '../uploads/industries');
        if (!fs.existsSync(industryDir)) {
          fs.mkdirSync(industryDir, { recursive: true });
        }
        cb(null, industryDir);
      },
      filename: (req, file, cb) => {
        const uniqueName = `industry-${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
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

  // Upload industry image endpoint
  app.post('/api/upload/industry', industryUpload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const fileUrl = `/uploads/industries/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        message: 'Industry image uploaded successfully',
        url: fileUrl,
        filename: req.file.filename
      });
    } catch (error) {
      console.error('Industry image upload error:', error);
      res.status(500).json({ error: 'Failed to upload industry image' });
    }
  });

  // Sitemap generation endpoint
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      const products = await db.collection('products').find({}).toArray();
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>https://reckonix.co.in/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://reckonix.co.in/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://reckonix.co.in/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://reckonix.co.in/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://reckonix.co.in/gallery</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://reckonix.co.in/career</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;

      // Add product pages
      products.forEach(product => {
        sitemap += `
  <url>
    <loc>https://reckonix.co.in/product/${product.id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      sitemap += `
</urlset>`;

      res.setHeader('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
