import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Enhanced connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000, // 15 seconds
            socketTimeoutMS: 45000, // 45 seconds
            connectTimeoutMS: 15000, // 15 seconds
            maxPoolSize: 10,
            retryWrites: true,
            retryReads: true,
            heartbeatFrequencyMS: 10000, // 10 seconds
            maxIdleTimeMS: 30000, // 30 seconds
        };

        // Connection event handlers
        mongoose.connection.on('connecting', () => {
            console.log('🔄 Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            console.log(`✅ MongoDB connected successfully to ${mongoose.connection.host}`);
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
            
            // Log specific error types
            if (err.name === 'MongoNetworkTimeoutError') {
                console.error('💡 Network timeout - check your internet connection and MongoDB Atlas IP whitelist');
            } else if (err.name === 'MongoServerSelectionError') {
                console.error('💡 Server selection error - check if your cluster is running and accessible');
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('📴 MongoDB connection closed due to application termination');
            process.exit(0);
        });

        // Connect with retry logic
        let retries = 3;
        while (retries > 0) {
            try {
                console.log(`🔌 Attempting to connect to MongoDB (${4 - retries}/3)...`);
                await mongoose.connect(`${process.env.MONGODB_URI}/GreenBanking`, options);
                break; // Success, exit retry loop
            } catch (error) {
                retries--;
                console.error(`❌ Connection attempt failed: ${error.message}`);
                
                if (retries === 0) {
                    console.error('🚫 All connection attempts failed');
                    
                    // In production, you might want to handle this differently
                    if (process.env.NODE_ENV === 'production') {
                        // Log error but don't exit, allow the app to handle gracefully
                        console.error('Production environment: Application continuing without database');
                        return;
                    } else {
                        throw error;
                    }
                } else {
                    console.log(`⏳ Retrying in 5 seconds... (${retries} attempts remaining)`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

    } catch (error) {
        console.error("💥 MongoDB connection failed:", error.message);
        
        // Provide helpful error messages based on error type
        if (error.message.includes('ETIMEDOUT')) {
            console.error('\n🔧 Troubleshooting steps:');
            console.error('   1. Check if MongoDB Atlas cluster is running');
            console.error('   2. Verify IP address is whitelisted in Network Access');
            console.error('   3. Check internet connection');
            console.error('   4. Verify connection string in .env file');
        }
        
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

// Health check function
export const checkDBHealth = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping();
            return { healthy: true, message: 'Database connection is healthy' };
        } else {
            return { healthy: false, message: 'Database not connected' };
        }
    } catch (error) {
        return { healthy: false, message: `Database health check failed: ${error.message}` };
    }
};

export default connectDB;