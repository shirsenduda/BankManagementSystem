import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./Config/mongodb.js";
import connectCloudinary from "./Config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import clientrouter from "./routes/clientRoute.js";
import accountRoute from "./routes/accountRoute.js";
import transactionRoute from "./routes/transactionRoute.js";
import fdRoute from "./routes/fdRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize connections once at startup
let connectionInitialized = false;

const initializeConnections = async () => {
    if (!connectionInitialized) {
        try {
            await connectDB();
            await connectCloudinary();
            connectionInitialized = true;
            console.log('All connections initialized successfully');
        } catch (error) {
            console.error('Connection initialization failed:', error);
            // Don't throw here, let individual requests handle connection
        }
    }
};

// Initialize on startup
initializeConnections();

// Middleware to ensure database connection
app.use(async (req, res, next) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            console.log('MongoDB not connected, attempting to connect...');
            await connectDB();
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Database connection failed' 
        });
    }
});

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/client", clientrouter);
app.use("/api/account", accountRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/fd", fdRoute);

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Banking System API - Now with Fixed Deposits!",
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        port: PORT
    });
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

// Start server only when not in Vercel environment
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;