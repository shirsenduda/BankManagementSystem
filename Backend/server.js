import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./Config/mongodb.js";
import connectCloudinary from "./Config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import clientrouter from "./routes/clientRoute.js";
import accountRoute from "./routes/accountRoute.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database and cloudinary
const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();
        
        // Middleware
        app.use(express.json());
        app.use(cors());

        // Routes
        app.use("/api/admin", adminRouter);
        app.use("/api/client", clientrouter);
        app.use("/api/account",accountRoute);
        app.get("/", (req, res) => {
            res.send("Welcome to the Banking System API");
        });

        app.listen(PORT, () => console.log("Server is running on port", PORT));
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();