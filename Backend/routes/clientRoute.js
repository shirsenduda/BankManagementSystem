import express from 'express';
import { 
    registerClient, 
    loginClient, 
    getUserProfile, 
    updateUserProfile,
    uploadProfileImage,
    changePassword,
    logoutClient
} from '../controllers/clientController.js';
import { authenticateToken, loginLimiter, registerLimiter } from '../middleware/clientAuth.js';
import upload from '../middleware/multer.js';

const clientRouter = express.Router();

// Public routes
clientRouter.post('/register', registerLimiter, registerClient);
clientRouter.post('/login', loginLimiter, loginClient);

// Protected routes
clientRouter.get('/profile', authenticateToken, getUserProfile);
clientRouter.put('/profile', authenticateToken, updateUserProfile);
clientRouter.post('/upload-image', authenticateToken, upload.single('image'), uploadProfileImage);
clientRouter.put('/change-password', authenticateToken, changePassword);
clientRouter.post('/logout', authenticateToken, logoutClient);

export default clientRouter;