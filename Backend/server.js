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
import fdRoute from "./routes/fdRoute.js"; // ADD FIXED DEPOSIT ROUTE

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database and cloudinary
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    // Add this to your server.js after the connectDB() call to debug connection status


    // Debug MongoDB connection status
    const debugConnection = () => {
      console.log("=== MongoDB Connection Debug Info ===");
      console.log("Connection State:", mongoose.connection.readyState);
      console.log(
        "States: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting"
      );
      console.log(
        "Connection Host:",
        mongoose.connection.host || "Not connected"
      );
      console.log(
        "Database Name:",
        mongoose.connection.name || "Not connected"
      );
      console.log(
        "MongoDB URI:",
        process.env.MONGODB_URI ? "Present" : "Missing"
      );

      // Check if URI is properly formatted
      if (process.env.MONGODB_URI) {
        const uriCheck =
          process.env.MONGODB_URI.startsWith("mongodb://") ||
          process.env.MONGODB_URI.startsWith("mongodb+srv://");
        console.log("URI Format Valid:", uriCheck);

        // Hide credentials but show structure
        const safeUri = process.env.MONGODB_URI.replace(
          /:\/\/[^@]+@/,
          "://***:***@"
        );
        console.log("URI Structure:", safeUri);
      }
      console.log("=====================================");
    };

    // Call this after your connection attempts
    setTimeout(debugConnection, 3000); // Wait 3 seconds then debug

    // Also add a periodic check
    setInterval(() => {
      if (mongoose.connection.readyState !== 1) {
        console.log(
          `Connection check: State ${
            mongoose.connection.readyState
          } at ${new Date().toISOString()}`
        );
      }
    }, 30000); // Check every 30 seconds

    // Middleware
    app.use(express.json());
    app.use(cors());

    // Routes
    // app.use("/api/admin", adminRouter);
    app.use("/api/client", clientrouter);
    app.use("/api/account", accountRoute);
    app.use("/api/transaction", transactionRoute);
    app.use("/api/fd", fdRoute); // ADD FIXED DEPOSIT ROUTES

    app.get("/", (req, res) => {
      res.send("Welcome to the Banking System API - Now with Fixed Deposits!");
    });

    app.listen(PORT, () => console.log("Server is running on port", PORT));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
