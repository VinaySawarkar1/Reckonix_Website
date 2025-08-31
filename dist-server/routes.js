import { createServer } from "http";
import { ObjectId } from 'mongodb';
import { getDb } from './mongo';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from "express";
import { v4 as uuidv4 } from "uuid";
import nodemailer from 'nodemailer';
import twilio from 'twilio';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
// In-memory session state for chatbot
const chatSessions = {};
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
async function sendAdminEmail(subject, body) {
    try {
        await transporter.sendMail({
            from: 'vinaysawarkar53@gmail.com',
            to: 'vinaysawarkar53@gmail.com',
            subject,
            text: body,
        });
    }
    catch (error) {
        console.error('Failed to send email:', error);
    }
}
async function sendAdminWhatsApp(body) {
    try {
        await twilioClient.messages.create({
            from: `whatsapp:${whatsappFrom}`,
            to: `whatsapp:${whatsappTo}`,
            body,
        });
    }
    catch (error) {
        console.error('Failed to send WhatsApp:', error);
    }
}
export async function registerRoutes(app) {
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
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        }
    });
    // Test route
    app.get("/api/test", async (req, res) => {
        res.json({ message: "API routing is working!" });
    });
    // Products routes
    app.get("/api/products", async (req, res) => {
        try {
            const db = await getDb();
            const products = await db.collection('Product').find({}).sort({ createdAt: -1 }).toArray();
            // Fetch images for each product
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
            res.json(products);
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
            // Fetch images
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
            res.json(product);
        }
        catch (error) {
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
            }
            else {
                res.status(404).json({ message: "Product not found after creation" });
            }
        }
        catch (err) {
            res.status(500).json({ message: "Failed to add product", error: err.message });
        }
    });
    // Update product
    app.put("/api/products/:id", productUpload.array("images", 10), async (req, res) => {
        try {
            const idParam = req.params.id;
            const data = req.body;
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
                return res.status(404).json({ message: 'Product not found' });
            }
            // Update product fields
            await db.collection('Product').updateOne(productQuery, { $set: data });
            // Save new images if any
            if (req.files && Array.isArray(req.files)) {
                for (const file of req.files) {
                    const imageDoc = {
                        productId: product._id ?? product.id,
                        url: `/uploads/products/${file.filename}`,
                        uploadedAt: new Date()
                    };
                    await db.collection('ProductImage').insertOne(imageDoc);
                }
            }
            // Return updated product
            const productWithImages = await db.collection('Product').findOne(productQuery);
            if (productWithImages) {
                const imageQuery = { $or: [] };
                if (product._id)
                    imageQuery.$or.push({ productId: product._id });
                if (typeof product.id === 'number')
                    imageQuery.$or.push({ productId: product.id });
                const refreshedImages = imageQuery.$or.length > 0
                    ? await db.collection('ProductImage').find(imageQuery).toArray()
                    : [];
                productWithImages.images = refreshedImages;
                res.json(productWithImages);
            }
            else {
                res.status(404).json({ message: "Product not found after update" });
            }
        }
        catch (err) {
            res.status(500).json({ message: "Failed to update product", error: err.message });
        }
    });
    // Delete product
    app.delete("/api/products/:id", async (req, res) => {
        try {
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
    // Categories route
    app.get('/api/categories', async (req, res) => {
        try {
            const db = await getDb();
            const categories = await db.collection('Category').find({}).toArray();
            const subcategories = await db.collection('Subcategory').find({}).toArray();
            const categoryMap = {};
            categories.forEach((cat) => {
                cat.subcategories = [];
                categoryMap[cat.id] = cat;
            });
            subcategories.forEach((sub) => {
                if (sub.categoryId && categoryMap[sub.categoryId]) {
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
    // Catalog route
    app.get('/api/catalog/main-catalog', async (req, res) => {
        try {
            const db = await getDb();
            const catalog = await db.collection('MainCatalog').findOne({});
            res.json(catalog || {});
        }
        catch (error) {
            console.error('Error fetching catalog:', error);
            res.status(500).json({ error: 'Failed to fetch catalog' });
        }
    });
    // Chatbot summaries route
    app.get('/api/chatbot-summaries', async (req, res) => {
        try {
            const db = await getDb();
            const summaries = await db.collection('ChatbotSummary').find({}).sort({ createdAt: -1 }).toArray();
            res.json(summaries);
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error exporting chatbot summaries:', error);
            res.status(500).json({ error: 'Failed to export summaries' });
        }
    });
    // Serve uploaded files
    app.use('/uploads/products', (req, res, next) => {
        const filePath = path.join(uploadsDir, req.path);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
            res.status(404).send('File not found');
        }
    });
    // Team members route
    app.get('/api/team', async (req, res) => {
        try {
            const db = await getDb();
            const teamMembers = await db.collection('TeamMember').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
            res.json(teamMembers);
        }
        catch (error) {
            console.error('Error fetching team members:', error);
            res.status(500).json({ error: 'Failed to fetch team members' });
        }
    });
    // Customers route
    app.get('/api/customers', async (req, res) => {
        try {
            const db = await getDb();
            const customers = await db.collection('Customer').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
            res.json(customers);
        }
        catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Failed to fetch customers' });
        }
    });
    // Jobs route
    app.get('/api/jobs', async (req, res) => {
        try {
            const db = await getDb();
            const jobs = await db.collection('Job').find({}).sort({ createdAt: -1 }).toArray();
            res.json(jobs);
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Error fetching events:', error);
            res.status(500).json({ error: 'Failed to fetch events' });
        }
    });
    // Testimonials route
    app.get('/api/testimonials', async (req, res) => {
        try {
            const db = await getDb();
            const testimonials = await db.collection('Testimonial').find({}).sort({ createdAt: -1 }).toArray();
            res.json(testimonials);
        }
        catch (error) {
            console.error('Error fetching testimonials:', error);
            res.status(500).json({ error: 'Failed to fetch testimonials' });
        }
    });
    // Industries route
    app.get('/api/industries', async (req, res) => {
        try {
            const db = await getDb();
            const industries = await db.collection('Industry').find({}).sort({ rank: 1, createdAt: -1 }).toArray();
            res.json(industries);
        }
        catch (error) {
            console.error('Error fetching industries:', error);
            res.status(500).json({ error: 'Failed to fetch industries' });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
