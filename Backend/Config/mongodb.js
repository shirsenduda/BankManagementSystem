import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Don't reconnect if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB already connected");
            return;
        }

        // Set up connection event listeners
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB disconnected");
        });

        // Connect to MongoDB - use URI as is, don't append database name
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'GreenBanking', // Specify database name this way
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        // Don't use process.exit in serverless environment
        throw error;
    }
};

export default connectDB;