"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use the correct password for local development
const mongoUri = process.env.MONGODB_URL || 'mongodb+srv://vinaysarkar0:vinasawarkar@cluster0.4adl4tl.mongodb.net/reckonix?retryWrites=true&w=majority&authSource=admin';
const client = new mongodb_1.MongoClient(mongoUri, {
    serverApi: mongodb_1.ServerApiVersion.v1,
    retryWrites: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
    retryReads: true,
    // Additional SSL/TLS options for production compatibility
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
});
let isConnected = false;
async function getDb() {
    try {
        if (!isConnected) {
            // Try different connection approaches for production
            if (process.env.NODE_ENV === 'production') {
                // For production, use the same URI as it already has all needed parameters
                const productionUri = mongoUri;
                const prodClient = new mongodb_1.MongoClient(productionUri, {
                    serverApi: mongodb_1.ServerApiVersion.v1,
                    retryWrites: true,
                    maxPoolSize: 5,
                    serverSelectionTimeoutMS: 15000,
                    socketTimeoutMS: 60000,
                    connectTimeoutMS: 15000,
                    maxIdleTimeMS: 30000,
                    retryReads: true,
                    tls: true,
                    tlsAllowInvalidCertificates: false,
                    tlsAllowInvalidHostnames: false,
                });
                await prodClient.connect();
                isConnected = true;
                console.log('MongoDB connected successfully (production mode)');
                return prodClient.db('reckonix');
            }
            else {
                await client.connect();
                isConnected = true;
                console.log('MongoDB connected successfully');
            }
        }
        return client.db('reckonix'); // Use your MongoDB database name
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        isConnected = false;
        // Try to reconnect after a short delay
        setTimeout(async () => {
            try {
                await client.connect();
                isConnected = true;
                console.log('MongoDB reconnected successfully');
            }
            catch (retryErr) {
                console.error('MongoDB reconnection failed:', retryErr);
            }
        }, 5000);
        throw err;
    }
}
