import { createServer } from "http";
import { ObjectId } from 'mongodb';
import { getDb } from './mongo';
// Schema imports removed - using inline validation instead
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
// MongoDB connection is handled via getDb()
// Nodemailer types are handled by the package
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
// In-memory session state for chatbot (for demo; use real session in production)
const chatSessions = {};
// Helper to determine type from session
function getSessionType(session) {
    if (session.complaint)
        return "complaint";
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
async function sendAdminEmail(subject, body) {
    await transporter.sendMail({
        from: 'vinaysawarkar53@gmail.com',
        to: 'vinaysawarkar53@gmail.com',
        subject,
        text: body,
    });
}
async function sendAdminWhatsApp(body) {
    await twilioClient.messages.create({
        from: `whatsapp:${whatsappFrom}`,
        to: `whatsapp:${whatsappTo}`,
        body,
    });
}
export async function registerRoutes(app) {
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
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });
    // Test route to verify API routing is working
    app.get("/api/test", async (req, res) => {
        console.log("GET /api/test route hit");
        res.json({ message: "API routing is working!" });
    });
    // Testimonial routes
    app.get("/api/testimonials", async (req, res) => {
        console.log("GET /api/testimonials route hit");
        try {
            const db = await getDb();
            const testimonials = await db.collection('Testimonial').find({}).sort({ createdAt: -1 }).toArray();
            console.log("Found testimonials:", testimonials.length);
            res.json(testimonials);
        }
        catch (error) {
            console.error("Error fetching testimonials:", error);
            res.status(500).json({ message: "Failed to fetch testimonials" });
        }
    });
    app.post("/api/testimonials", async (req, res) => {
        console.log("POST /api/testimonials route hit");
        try {
            const db = await getDb();
            const { name, role, company, content, rating, featured } = req.body;
            console.log("Creating testimonial:", { name, role, company, content, rating, featured });
            const result = await db.collection('Testimonial').insertOne({
                name,
                role,
                company,
                content,
                rating: rating ?? 5,
                featured: featured ?? false,
                createdAt: new Date()
            });
            const testimonial = await db.collection('Testimonial').findOne({ _id: result.insertedId });
            console.log("Created testimonial:", testimonial);
            res.status(201).json(testimonial);
        }
        catch (error) {
            console.error("Error creating testimonial:", error);
            res.status(400).json({ message: "Failed to create testimonial", details: error instanceof Error ? error.message : error });
        }
    });
    app.put("/api/testimonials/:id", async (req, res) => {
        try {
            const db = await getDb();
            const id = req.params.id;
            const { name, role, company, content, rating, featured } = req.body;
            const result = await db.collection('Testimonial').findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name, role, company, content, rating, featured } }, { returnDocument: 'after' });
            res.json(result.value);
        }
        catch (error) {
            res.status(400).json({ message: "Failed to update testimonial", details: error instanceof Error ? error.message : error });
        }
    });
    app.delete("/api/testimonials/:id", async (req, res) => {
        try {
            const db = await getDb();
            const id = req.params.id;
            await db.collection('Testimonial').deleteOne({ _id: new ObjectId(id) });
            res.json({ message: "Testimonial deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ message: "Failed to delete testimonial", details: error instanceof Error ? error.message : error });
        }
    });
    // Authentication routes
    app.post("/api/auth/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }
            const db = await getDb();
            const user = await db.collection('User').findOne({ username });
            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            // In production, use proper JWT and password hashing
            res.json({
                user: { id: user._id, username: user.username, role: user.role },
                token: `mock-jwt-${user._id}` // Mock token for demo
            });
        }
        catch (error) {
            res.status(400).json({ message: "Invalid request data" });
        }
    });
    // Products routes
    app.get("/api/products", async (req, res) => {
        try {
            const category = req.query.category;
            const db = await getDb();
            // Get products first
            const products = await db.collection('Product').find({}).sort({ createdAt: -1 }).toArray();
            // Fetch images for each product separately (more reliable than complex aggregation)
            for (const product of products) {
                const imageQuery = { $or: [] };
                if (product._id)
                    imageQuery.$or.push({ productId: product._id });
                if (typeof product.id === 'number')
                    imageQuery.$or.push({ productId: product.id });
                if (imageQuery.$or.length > 0) {
                    product.images = await db.collection('ProductImage').find(imageQuery).toArray();
                }
                else {
                    product.images = [];
                }
            }
            // Fallback: if no images via lookup, use imageGallery/imageUrl. Also ensure id exists
            const enriched = products.map((p) => {
                try {
                    const galleryRaw = p.imageGallery;
                    const galleryArr = Array.isArray(galleryRaw)
                        ? galleryRaw
                        : (typeof galleryRaw === 'string' ? JSON.parse(galleryRaw || '[]') : []);
                    if ((!p.images || p.images.length === 0) && Array.isArray(galleryArr) && galleryArr.length > 0) {
                        p.images = galleryArr.map((url) => ({ url: typeof url === 'string' ? url : url?.url })).filter((u) => u && u.url);
                    }
                }
                catch { }
                if (p.images && Array.isArray(p.images)) {
                    p.images = p.images.filter((img) => img && typeof img.url === 'string');
                }
                if (p.id === undefined || p.id === null) {
                    // expose string id for frontend routing when numeric id is absent
                    p.id = String(p._id);
                }
                return p;
            });
            res.json(enriched);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch products" });
        }
    });
    app.get("/api/products/:id", async (req, res) => {
        try {
            const idParam = req.params.id;
            const db = await getDb();
            let query;
            if (ObjectId.isValid(idParam) && idParam.length === 24) {
                query = { _id: new ObjectId(idParam) };
            }
            else {
                const idNum = Number(idParam);
                if (Number.isNaN(idNum)) {
                    return res.status(400).json({ message: "Invalid product ID" });
                }
                query = { id: idNum };
            }
            const product = await db.collection('Product').findOne(query);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            // Increment view count
            await db.collection('Product').updateOne(query, { $inc: { views: 1 } });
            // Fetch images by productId supporting both ObjectId and numeric id
            const imageQuery = { $or: [] };
            if (product._id)
                imageQuery.$or.push({ productId: product._id });
            if (typeof product.id === 'number')
                imageQuery.$or.push({ productId: product.id });
            let images = [];
            if (imageQuery.$or.length > 0) {
                images = await db.collection('ProductImage').find(imageQuery).toArray();
            }
            product.images = images;
            // Fallback to imageGallery/imageUrl
            if ((!product.images || product.images.length === 0)) {
                try {
                    const galleryRaw = product.imageGallery;
                    const galleryArr = Array.isArray(galleryRaw)
                        ? galleryRaw
                        : (typeof galleryRaw === 'string' ? JSON.parse(galleryRaw || '[]') : []);
                    if (Array.isArray(galleryArr) && galleryArr.length > 0) {
                        product.images = galleryArr.map((url) => ({ url: typeof url === 'string' ? url : url?.url })).filter((u) => u && u.url);
                    }
                    else if (product.imageUrl) {
                        product.images = [{ url: product.imageUrl }];
                    }
                }
                catch { }
            }
            if (product.id === undefined || product.id === null) {
                product.id = String(product._id);
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch product" });
        }
    });
    // Update product image upload setup for multiple images - use the same config as main upload
    const productImageUpload = multer({
        storage: storageConfig,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit
            files: 10 // Maximum 10 files
        },
        fileFilter: (req, file, cb) => {
            // Check file type
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });
    // Add product with multiple images
    app.post("/api/products", productImageUpload.array("images", 10), async (req, res) => {
        try {
            const db = await getDb();
            const data = req.body;
            data.createdAt = new Date();
            // Save product
            const result = await db.collection('Product').insertOne(data);
            const productId = result.insertedId;
            // Save images if any
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    await db.collection('ProductImage').insertOne({
                        productId,
                        url: `/uploads/products/${file.filename}`,
                        uploadedAt: new Date()
                    });
                }
            }
            // Return product with images
            const productWithImages = await db.collection('Product').findOne({ _id: productId });
            if (productWithImages) {
                const images = await db.collection('ProductImage').find({ productId }).toArray();
                productWithImages.images = images;
                res.status(201).json(productWithImages);
            }
            else {
                res.status(404).json({ message: "Product not found after creation" });
            }
        }
        catch (err) {
            res.status(500).json({ message: "Failed to add product", error: err.message });
        }
    });
    // Edit product with multiple images
    app.put("/api/products/:id", productImageUpload.array("images", 10), async (req, res) => {
        try {
            const idParam = req.params.id;
            const data = req.body;
            const db = await getDb();
            // Build product query supporting both ObjectId and numeric id
            let productQuery;
            if (ObjectId.isValid(idParam) && idParam.length === 24) {
                productQuery = { _id: new ObjectId(idParam) };
            }
            else {
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
            // Handle existing images removal
            let existingImageUrls = null;
            if (data.existingImages) {
                if (Array.isArray(data.existingImages)) {
                    existingImageUrls = data.existingImages;
                }
                else if (typeof data.existingImages === 'string') {
                    try {
                        existingImageUrls = JSON.parse(data.existingImages);
                    }
                    catch {
                        existingImageUrls = [];
                    }
                }
            }
            console.log("PUT /api/products/:id - existingImageUrls:", existingImageUrls);
            console.log("PUT /api/products/:id - req.files:", req.files);
            const imageFindQuery = { $or: [] };
            if (product._id)
                imageFindQuery.$or.push({ productId: product._id });
            if (typeof product.id === 'number')
                imageFindQuery.$or.push({ productId: product.id });
            if (imageFindQuery.$or.length > 0) {
                const currentImages = await db.collection('ProductImage').find(imageFindQuery).toArray();
                console.log("PUT /api/products/:id - currentImages in DB:", currentImages);
                if (existingImageUrls) {
                    console.log("PUT /api/products/:id - Keeping images:", existingImageUrls);
                    for (const currentImage of currentImages) {
                        console.log(`PUT /api/products/:id - Checking image: ${currentImage.url} - Keep: ${existingImageUrls.includes(currentImage.url)}`);
                        if (!existingImageUrls.includes(currentImage.url)) {
                            console.log(`PUT /api/products/:id - Deleting image: ${currentImage.url}`);
                            await db.collection('ProductImage').deleteOne({ _id: currentImage._id });
                        }
                    }
                }
                else {
                    console.log("PUT /api/products/:id - No existing images specified, deleting all");
                    await db.collection('ProductImage').deleteMany(imageFindQuery);
                }
            }
            // Update product fields
            await db.collection('Product').updateOne(productQuery, { $set: data });
            // Save new images if any
            if (req.files && Array.isArray(req.files)) {
                console.log("PUT /api/products/:id - Saving new images:", req.files.map(f => f.filename));
                for (const file of req.files) {
                    const imageDoc = {
                        productId: product._id ?? product.id,
                        url: `/uploads/products/${file.filename}`,
                        uploadedAt: new Date()
                    };
                    console.log("PUT /api/products/:id - Inserting image:", imageDoc);
                    await db.collection('ProductImage').insertOne(imageDoc);
                }
            }
            else {
                console.log("PUT /api/products/:id - No new images to save");
            }
            // Return product with images
            const productWithImages = await db.collection('Product').findOne(productQuery);
            if (!productWithImages) {
                return res.status(404).json({ message: "Product not found after update" });
            }
            const refreshedImages = imageFindQuery.$or.length > 0
                ? await db.collection('ProductImage').find(imageFindQuery).toArray()
                : [];
            productWithImages.images = refreshedImages;
            if (productWithImages.id === undefined || productWithImages.id === null) {
                productWithImages.id = String(productWithImages._id);
            }
            res.json(productWithImages);
        }
        catch (err) {
            res.status(500).json({ message: "Failed to update product", error: err.message });
        }
    });
    app.delete("/api/products/:id", async (req, res) => {
        try {
            // In production, verify JWT token here
            const idParam = req.params.id;
            const db = await getDb();
            let productQuery;
            if (ObjectId.isValid(idParam) && idParam.length === 24) {
                productQuery = { _id: new ObjectId(idParam) };
            }
            else {
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
            const imageDeleteQuery = { $or: [] };
            if (product._id)
                imageDeleteQuery.$or.push({ productId: product._id });
            if (typeof product.id === 'number')
                imageDeleteQuery.$or.push({ productId: product.id });
            if (imageDeleteQuery.$or.length > 0) {
                await db.collection('ProductImage').deleteMany(imageDeleteQuery);
            }
            res.json({ message: "Product deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete product" });
        }
    });
    // Bulk update product ranks
    app.put("/api/products/rank", async (req, res) => {
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
                // Basic validation for rank
                if (typeof rank !== 'number' || rank < 0) {
                    return res.status(400).json({ message: "Invalid rank value" });
                }
                const validatedData = { rank };
                const db = await getDb();
                const updated = await db.collection('Product').updateOne({ id }, { $set: validatedData });
                if (updated.modifiedCount)
                    results.push({ id, rank });
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
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update product ranks" });
        }
    });
    // Category routes (moved up)
    app.get('/api/categories', async (req, res) => {
        try {
            const db = await getDb();
            // Fetch all categories
            const categories = await db.collection('Category').find({}).toArray();
            // Fetch all subcategories
            const subcategories = await db.collection('Subcategory').find({}).toArray();
            // Build tree structure
            const categoryMap = {};
            categories.forEach((cat) => {
                cat.subcategories = [];
                categoryMap[cat.id] = cat;
            });
            subcategories.forEach((sub) => {
                if (sub.parentId) {
                    // Nested subcategory
                    const parent = subcategories.find((s) => s.id === sub.parentId);
                    if (parent) {
                        parent.children = parent.children || [];
                        parent.children.push(sub);
                    }
                }
                else if (sub.categoryId && categoryMap[sub.categoryId]) {
                    // Top-level subcategory
                    categoryMap[sub.categoryId].subcategories.push(sub);
                }
            });
            res.json(Object.values(categoryMap));
        }
        catch (error) {
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
            const db = await getDb();
            const newCategory = await db.collection('Category').insertOne({ name });
            const categoryId = newCategory.insertedId;
            const createSubcategories = async (subs, categoryId, parentId = null) => {
                for (const sub of subs) {
                    const created = await db.collection('Subcategory').insertOne({
                        name: sub.name,
                        categoryId,
                        parentId,
                    });
                    if (sub.children && sub.children.length > 0) {
                        await createSubcategories(sub.children, categoryId, created.insertedId);
                    }
                }
            };
            if (Array.isArray(subcategories)) {
                await createSubcategories(subcategories, categoryId);
            }
            const categoryWithTree = await db.collection('Category').findOne({ _id: categoryId });
            res.status(201).json(categoryWithTree);
        }
        catch (error) {
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
            const db = await getDb();
            await db.collection('Subcategory').deleteMany({ categoryId: new ObjectId(id) });
            const createSubcategories = async (subs, categoryId, parentId = null) => {
                for (const sub of subs) {
                    const created = await db.collection('Subcategory').insertOne({
                        name: sub.name,
                        categoryId,
                        parentId,
                    });
                    if (sub.children && sub.children.length > 0) {
                        await createSubcategories(sub.children, categoryId, created.insertedId);
                    }
                }
            };
            await db.collection('Category').updateOne({ _id: new ObjectId(id) }, { $set: { name } });
            if (Array.isArray(subcategories)) {
                await createSubcategories(subcategories, new ObjectId(id));
            }
            const categoryWithTree = await db.collection('Category').findOne({ _id: new ObjectId(id) });
            res.json(categoryWithTree);
        }
        catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: 'Failed to update category' });
        }
    });
    app.delete('/api/categories/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const db = await getDb();
            const result = await db.collection('Category').deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ error: 'Failed to delete category' });
        }
    });
    // Quote routes
    app.post("/api/quotes", async (req, res) => {
        try {
            // Stringify products before validation if it's an array
            let body = { ...req.body };
            if (body.products && Array.isArray(body.products)) {
                body.products = JSON.stringify(body.products);
            }
            const quoteData = insertQuoteRequestSchema.parse(body);
            const db = await getDb();
            const result = await db.collection('QuoteRequest').insertOne(quoteData);
            const quote = await db.collection('QuoteRequest').findOne({ _id: result.insertedId });
            if (quote) {
                // Try to send notifications, but don't fail the request if they error
                const quoteBody = `New Quote Request:\n${JSON.stringify(quote, null, 2)}`;
                try {
                    await sendAdminEmail('New Quote Request', quoteBody);
                }
                catch (emailErr) {
                    console.error('Failed to send admin email:', emailErr);
                }
                try {
                    await sendAdminWhatsApp(quoteBody);
                }
                catch (waErr) {
                    console.error('Failed to send WhatsApp notification:', waErr);
                }
                res.status(201).json({ message: "Quote request submitted successfully", id: quote._id });
            }
            else {
                res.status(404).json({ message: "Quote not found after creation" });
            }
        }
        catch (error) {
            console.error("Quote creation error:", error);
            res.status(400).json({
                message: "Invalid quote request data",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
    app.get("/api/quotes", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const quotes = await db.collection('QuoteRequest').find({}).toArray();
            res.json(quotes);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch quotes" });
        }
    });
    app.put("/api/quotes/:id/status", async (req, res) => {
        try {
            // In production, verify JWT token here
            const id = parseInt(req.params.id);
            const { status } = req.body;
            if (isNaN(id) || !['New', 'Contacted', 'Closed'].includes(status)) {
                return res.status(400).json({ message: "Invalid data" });
            }
            const db = await getDb();
            const result = await db.collection('QuoteRequest').updateOne({ _id: new ObjectId(id) }, { $set: { status } });
            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Quote not found" });
            }
            const quote = await db.collection('QuoteRequest').findOne({ _id: new ObjectId(id) });
            res.json(quote);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update quote status" });
        }
    });
    // Messages routes
    app.post("/api/messages", async (req, res) => {
        try {
            console.log("/api/messages received:", req.body); // DEBUG LOG
            console.log("Using schema:", insertContactMessageSchema); // DEBUG: Log the schema being used
            const db = await getDb();
            const messageData = insertContactMessageSchema.parse(req.body);
            console.log("Parsed data:", messageData); // DEBUG: Log the parsed data
            // Remove phone before saving to DB
            const { phone, ...dbData } = messageData;
            const result = await db.collection('ContactMessage').insertOne(dbData);
            const message = await db.collection('ContactMessage').findOne({ _id: result.insertedId });
            if (message) {
                // In production, send email notification here using Nodemailer
                const messageBody = `New Contact Message:\n${JSON.stringify(message, null, 2)}`;
                await sendAdminEmail('New Contact Message', messageBody);
                res.status(201).json({ message: "Message sent successfully", id: message._id });
            }
            else {
                res.status(404).json({ message: "Message not found after creation" });
            }
        }
        catch (error) {
            console.log("Error details:", error); // DEBUG: Log the full error
            res.status(400).json({ message: "Invalid message data", details: error instanceof Error ? error.message : error });
        }
    });
    app.get("/api/messages", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const messages = await db.collection('ContactMessage').find({}).toArray();
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch messages" });
        }
    });
    app.put("/api/messages/:id/replied", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const id = parseInt(req.params.id);
            const { replied } = req.body;
            if (isNaN(id) || typeof replied !== 'boolean') {
                return res.status(400).json({ message: "Invalid data" });
            }
            const result = await db.collection('ContactMessage').updateOne({ id }, { $set: { replied } });
            if (!result.modifiedCount) {
                return res.status(404).json({ message: "Message not found" });
            }
            const message = await db.collection('ContactMessage').findOne({ id });
            res.json(message);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update message status" });
        }
    });
    // Analytics routes
    app.get("/api/analytics/website-views", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const views = await db.collection('WebsiteView').find({}, { projection: { ip: 1, createdAt: 1 } }).toArray();
            res.json({ totalViews: views.length });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch website views" });
        }
    });
    app.post("/api/analytics/website-views", async (req, res) => {
        try {
            const db = await getDb();
            const ip = req.ip || req.connection.remoteAddress;
            await db.collection('WebsiteView').insertOne({ ip, createdAt: new Date() });
            res.json({ message: "View recorded" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to record view" });
        }
    });
    app.get("/api/analytics/product-views", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const productViews = await db.collection('ProductView').find({}).toArray();
            res.json(productViews);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch product views" });
        }
    });
    // Company Events routes
    app.get("/api/events", async (req, res) => {
        try {
            const db = await getDb();
            const events = await db.collection('CompanyEvent').find({}).toArray();
            res.json(events);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch events" });
        }
    });
    app.get("/api/events/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid event ID" });
            }
            const db = await getDb();
            const event = await db.collection('CompanyEvent').findOne({ id });
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.json(event);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch event" });
        }
    });
    app.post("/api/events", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const raw = { ...req.body };
            const sanitized = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, (v === "" || v === null) ? undefined : v]));
            const eventData = insertCompanyEventSchema.parse({
                ...sanitized,
                eventDate: new Date(raw.eventDate),
            });
            const result = await db.collection('CompanyEvent').insertOne(eventData);
            const event = await db.collection('CompanyEvent').findOne({ _id: result.insertedId });
            res.status(201).json(event);
        }
        catch (error) {
            console.error("Event creation error:", error);
            res.status(400).json({
                message: "Invalid event data",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
    app.put("/api/events/:id", async (req, res) => {
        try {
            // In production, verify JWT token here
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid event ID" });
            }
            const raw = { ...req.body };
            const sanitized = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, (v === "" || v === null) ? undefined : v]));
            const eventData = insertCompanyEventSchema.partial().parse({
                ...sanitized,
                eventDate: raw.eventDate ? new Date(raw.eventDate) : undefined,
            });
            const db = await getDb();
            const result = await db.collection('CompanyEvent').updateOne({ id }, { $set: eventData });
            if (!result.modifiedCount) {
                return res.status(404).json({ message: "Event not found" });
            }
            const event = await db.collection('CompanyEvent').findOne({ id });
            res.json(event);
        }
        catch (error) {
            console.error("Event update error:", error);
            res.status(400).json({
                message: "Invalid event data",
                details: error instanceof Error ? error.message : error,
                received: req.body,
            });
        }
    });
    app.delete("/api/events/:id", async (req, res) => {
        try {
            // In production, verify JWT token here
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid event ID" });
            }
            const db = await getDb();
            const deleted = await db.collection('CompanyEvent').deleteOne({ id });
            if (!deleted.deletedCount) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.json({ message: "Event deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete event" });
        }
    });
    // Catalog routes
    app.get("/api/catalog/main-catalog", async (req, res) => {
        try {
            const db = await getDb();
            const catalogInfo = await db.collection('MainCatalog').findOne({});
            if (!catalogInfo || !catalogInfo.pdfUrl) {
                return res.status(404).json({ message: "Main catalog not found" });
            }
            res.json(catalogInfo);
        }
        catch (error) {
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
            }
            else {
                cb(new Error('Only PDF files are allowed'));
            }
        }
    });
    // Serve uploaded catalog PDFs statically
    app.use('/uploads/catalogs', (req, res, next) => {
        const filePath = path.join(catalogUploadsDir, req.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
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
    app.post('/api/catalog/main-catalog', catalogUpload.single('pdf'), async (req, res) => {
        try {
            let catalogData = {};
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
            }
            else {
                // Handle JSON body
                catalogData = req.body;
            }
            const db = await getDb();
            const validated = insertMainCatalogSchema.parse(catalogData);
            const dbData = {
                title: validated.title,
                description: validated.description,
                pdfUrl: validated.pdfUrl,
                fileSize: validated.fileSize
            };
            // Upsert logic for MongoDB
            const result = await db.collection('MainCatalog').updateOne({}, { $set: dbData }, { upsert: true });
            const catalog = await db.collection('MainCatalog').findOne({});
            res.json(catalog);
        }
        catch (error) {
            console.error('Catalog update error:', error);
            res.status(400).json({
                message: 'Failed to update catalog',
                details: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
    // Customer routes
    app.get("/api/customers", async (req, res) => {
        try {
            const db = await getDb();
            const customers = await db.collection('Customer').find({}).toArray();
            res.json(customers);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch customers" });
        }
    });
    app.get("/api/customers/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }
            const db = await getDb();
            const customer = await db.collection('Customer').findOne({ id });
            if (!customer) {
                return res.status(404).json({ message: "Customer not found" });
            }
            res.json(customer);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch customer" });
        }
    });
    app.post("/api/customers", async (req, res) => {
        try {
            // In production, verify JWT token here
            const db = await getDb();
            const customerData = insertCustomerSchema.parse(req.body);
            const result = await db.collection('Customer').insertOne(customerData);
            const customer = await db.collection('Customer').findOne({ _id: result.insertedId });
            res.status(201).json(customer);
        }
        catch (error) {
            console.error("Customer creation error:", error);
            res.status(400).json({
                message: "Invalid customer data",
                details: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
    app.put("/api/customers/:id", async (req, res) => {
        try {
            // In production, verify JWT token here
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }
            const db = await getDb();
            const customerData = insertCustomerSchema.partial().parse(req.body);
            const result = await db.collection('Customer').updateOne({ id }, { $set: customerData });
            if (!result.modifiedCount) {
                return res.status(404).json({ message: "Customer not found" });
            }
            const customer = await db.collection('Customer').findOne({ id });
            res.json(customer);
        }
        catch (error) {
            res.status(400).json({ message: "Invalid customer data" });
        }
    });
    app.delete("/api/customers/:id", async (req, res) => {
        try {
            // In production, verify JWT token here
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid customer ID" });
            }
            const db = await getDb();
            const deleted = await db.collection('Customer').deleteOne({ id });
            if (!deleted.deletedCount) {
                return res.status(404).json({ message: "Customer not found" });
            }
            res.json({ message: "Customer deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete customer" });
        }
    });
    // Industry routes
    app.get("/api/industries", async (req, res) => {
        try {
            const db = await getDb();
            const industries = await db.collection('Industry').find({}).sort({ rank: 1 }).toArray();
            res.json(industries);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch industries" });
        }
    });
    app.post("/api/industries", async (req, res) => {
        try {
            const db = await getDb();
            const { name, description, icon, rank } = req.body;
            const result = await db.collection('Industry').insertOne({ name, description, icon, rank: rank ?? 0 });
            const industry = await db.collection('Industry').findOne({ _id: result.insertedId });
            res.status(201).json(industry);
        }
        catch (error) {
            res.status(400).json({ message: "Failed to create industry", details: error instanceof Error ? error.message : error });
        }
    });
    app.put("/api/industries/:id", async (req, res) => {
        try {
            const db = await getDb();
            const id = parseInt(req.params.id);
            const { name, description, icon, rank } = req.body;
            const result = await db.collection('Industry').updateOne({ id }, { $set: { name, description, icon, rank } });
            if (!result.modifiedCount) {
                return res.status(404).json({ message: "Industry not found" });
            }
            const industry = await db.collection('Industry').findOne({ id });
            res.json(industry);
        }
        catch (error) {
            res.status(400).json({ message: "Failed to update industry", details: error instanceof Error ? error.message : error });
        }
    });
    app.delete("/api/industries/:id", async (req, res) => {
        try {
            const db = await getDb();
            const id = parseInt(req.params.id);
            const deleted = await db.collection('Industry').deleteOne({ id });
            if (!deleted.deletedCount) {
                return res.status(404).json({ message: "Industry not found" });
            }
            res.json({ message: "Industry deleted successfully" });
        }
        catch (error) {
            res.status(400).json({ message: "Failed to delete industry", details: error instanceof Error ? error.message : error });
        }
    });
    // === Job Management & Applications ===
    // Set up multer for resume uploads
    const uploadDir = path.join(__dirname, '../uploads/resumes');
    if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
    const upload = multer({ dest: uploadDir });
    // List all jobs
    app.get('/api/jobs', async (req, res) => {
        const db = await getDb();
        const jobs = await db.collection('Job').find({}).toArray();
        res.json(jobs);
    });
    // Create a new job (admin)
    app.post('/api/jobs', async (req, res) => {
        try {
            const db = await getDb();
            const jobData = insertJobSchema.parse(req.body);
            const result = await db.collection('Job').insertOne(jobData);
            const job = await db.collection('Job').findOne({ _id: result.insertedId });
            res.status(201).json(job);
        }
        catch (error) {
            res.status(400).json({ message: 'Invalid job data' });
        }
    });
    // Delete a job (admin)
    app.delete('/api/jobs/:id', async (req, res) => {
        const db = await getDb();
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid job ID' });
        const deleted = await db.collection('Job').deleteOne({ id });
        if (!deleted.deletedCount)
            return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted' });
    });
    // Submit a job application (with resume upload)
    app.post('/api/apply', upload.single('resume'), async (req, res) => {
        try {
            const db = await getDb();
            const { name, email, location, experience, jobId } = req.body;
            const job = await db.collection('Job').findOne({ id: Number(jobId) });
            if (!job)
                return res.status(400).json({ message: 'Invalid job' });
            if (!req.file)
                return res.status(400).json({ message: 'Resume required' });
            const resumeUrl = `/uploads/resumes/${req.file.filename}`;
            const appData = insertJobApplicationSchema.parse({
                name, email, location, experience, resumeUrl, jobId: Number(jobId), jobTitle: job.title
            });
            const result = await db.collection('JobApplication').insertOne(appData);
            const application = await db.collection('JobApplication').findOne({ _id: result.insertedId });
            res.status(201).json(application);
        }
        catch (error) {
            res.status(400).json({ message: 'Invalid application data' });
        }
    });
    // List all job applications (admin)
    app.get('/api/applications', async (req, res) => {
        const db = await getDb();
        const applications = await db.collection('JobApplication').find({}).toArray();
        res.json(applications);
    });
    // Serve uploaded resumes statically
    app.use('/uploads/resumes', (req, res, next) => {
        const filePath = path.join(uploadDir, req.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).send('File not found');
        }
    });
    // Serve uploaded product images statically
    app.use('/uploads/products', (req, res, next) => {
        const filePath = path.join(uploadsDir, req.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
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
        const db = await getDb();
        const section = req.query.section;
        if (!section)
            return res.status(400).json({ message: "Section is required" });
        const images = await db.collection('GalleryImage').find({ section }).sort({ uploadedAt: -1 }).toArray();
        res.json(images);
    });
    // POST /api/gallery (multipart/form-data for file, or JSON for URL)
    app.post("/api/gallery", galleryUpload.single("image"), async (req, res) => {
        try {
            const db = await getDb();
            const section = req.body.section;
            if (!section)
                return res.status(400).json({ message: "Section is required" });
            let url = req.body.url;
            if (req.file) {
                url = `/uploads/gallery/${req.file.filename}`;
            }
            if (!url)
                return res.status(400).json({ message: "Image file or URL is required" });
            const result = await db.collection('GalleryImage').insertOne({ section, url, uploadedAt: new Date() });
            const image = await db.collection('GalleryImage').findOne({ _id: result.insertedId });
            res.status(201).json(image);
        }
        catch (err) {
            res.status(500).json({ message: "Failed to add image", error: err.message });
        }
    });
    // DELETE /api/gallery/:id
    app.delete("/api/gallery/:id", async (req, res) => {
        const db = await getDb();
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ message: "Invalid ID" });
        try {
            const image = await db.collection('GalleryImage').findOneAndDelete({ id: new ObjectId(id) });
            if (!image)
                return res.status(404).json({ message: "Image not found" });
            res.json({ message: "Image deleted", image: image });
        }
        catch (err) {
            res.status(404).json({ message: "Image not found" });
        }
    });
    router.post("/api/chatbot", async (req, res) => {
        const { message, sessionId } = req.body;
        const text = req.body.message?.toLowerCase() || "";
        let reply = "Sorry, I didn't understand that. Can you rephrase or provide more details?";
        // Session state
        let session = chatSessions[sessionId] || {};
        // Complaint flow
        if (session.awaiting === "complaint_detail") {
            session.complaint = { ...session.complaint, message };
            reply = "Thank you. Please provide your name.";
            session.awaiting = "complaint_name";
        }
        else if (session.awaiting === "complaint_name") {
            session.complaint = { ...session.complaint, name: message };
            reply = "And your email address?";
            session.awaiting = "complaint_email";
        }
        else if (session.awaiting === "complaint_email") {
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
        }
        else if (text.includes("complaint") || text.includes("issue") || text.includes("problem") || text.includes("requirement")) {
            reply = "I'm sorry to hear that. Please describe your complaint or requirement in detail.";
            session = { awaiting: "complaint_detail", complaint: {} };
        }
        else if (text.includes("product") || text.includes("catalog")) {
            // Store summary for product inquiry
            // Store summary for product inquiry
        }
        else if (text.includes("contact") || text.includes("support") || text.includes("help")) {
            // Store summary for support inquiry
            // Store summary for support inquiry
        }
        else if (text.includes("company") || text.includes("about")) {
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
        const summaries = []; // Placeholder
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
        const db = await getDb();
        const { search } = req.query;
        let products = await db.collection('Product').find({}).toArray();
        // Attach images
        for (const product of products) {
            product.images = await db.collection('ProductImage').find({ productId: product._id }).toArray();
        }
        if (search) {
            const s = String(search).toLowerCase();
            products = products.filter((p) => p.name && p.name.toLowerCase().includes(s));
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
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });
    // Serve uploaded team photos statically
    app.use('/uploads/team', (req, res, next) => {
        const filePath = path.join(teamUploadsDir, req.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).send('File not found');
        }
    });
    // GET /api/team - list all team members
    app.get('/api/team', async (req, res) => {
        try {
            const db = await getDb();
            const team = await db.collection('TeamMember').find({}).sort({ createdAt: -1 }).toArray();
            res.json(team);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to fetch team members' });
        }
    });
    // POST /api/team - add new team member (with photo)
    app.post('/api/team', teamUpload.single('photo'), async (req, res) => {
        try {
            const db = await getDb();
            const { name, role, bio } = req.body;
            let photoUrl = undefined;
            if (req.file) {
                photoUrl = `/uploads/team/${req.file.filename}`;
            }
            const result = await db.collection('TeamMember').insertOne({ name, role, bio, photoUrl, createdAt: new Date() });
            const member = await db.collection('TeamMember').findOne({ _id: result.insertedId });
            res.status(201).json(member);
        }
        catch (error) {
            res.status(400).json({ message: 'Failed to add team member' });
        }
    });
    // PUT /api/team/:id - update team member (with optional new photo)
    app.put('/api/team/:id', teamUpload.single('photo'), async (req, res) => {
        try {
            const db = await getDb();
            const id = Number(req.params.id);
            const { name, role, bio } = req.body;
            let photoUrl = undefined;
            if (req.file) {
                photoUrl = `/uploads/team/${req.file.filename}`;
                // Delete old photo if exists
                const old = await db.collection('TeamMember').findOne({ id });
                if (old && old.photoUrl) {
                    const oldPath = path.join(teamUploadsDir, path.basename(old.photoUrl));
                    if (fs.existsSync(oldPath))
                        fs.unlinkSync(oldPath);
                }
            }
            const data = { name, role, bio };
            if (photoUrl)
                Object.assign(data, { photoUrl });
            const result = await db.collection('TeamMember').updateOne({ id }, { $set: data });
            if (!result.modifiedCount) {
                return res.status(404).json({ message: 'Team member not found' });
            }
            const member = await db.collection('TeamMember').findOne({ id });
            res.json(member);
        }
        catch (error) {
            res.status(400).json({ message: 'Failed to update team member' });
        }
    });
    // DELETE /api/team/:id - delete team member and photo
    app.delete('/api/team/:id', async (req, res) => {
        try {
            const db = await getDb();
            const id = Number(req.params.id);
            const member = await db.collection('TeamMember').findOne({ id });
            if (!member)
                return res.status(404).json({ message: 'Not found' });
            if (member.photoUrl) {
                const photoPath = path.join(teamUploadsDir, path.basename(member.photoUrl));
                if (fs.existsSync(photoPath))
                    fs.unlinkSync(photoPath);
            }
            await db.collection('TeamMember').deleteOne({ id });
            res.json({ message: 'Deleted' });
        }
        catch (error) {
            res.status(400).json({ message: 'Failed to delete team member' });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
