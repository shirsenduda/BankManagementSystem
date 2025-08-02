import express from 'express';
import { addManager } from '../controllers/adminController.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

// Handle multiple possible field names for the image
adminRouter.post('/add-manager', (req, res, next) => {
    // Create a custom middleware to handle different field names
    const uploadMiddleware = upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]);
    
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'File upload error',
                error: err.message
            });
        }
        
        // Normalize the file to req.file for consistency
        if (req.files) {
            req.file = req.files.image?.[0] || 
                      req.files.profileImage?.[0] || 
                      req.files.photo?.[0] || 
                      req.files.file?.[0];
        }
        
        next();
    });
}, addManager);

export default adminRouter;