import express from 'express';
import upload from '../middleware/multer.js'; // Your multer config
import { authenticateToken, loginLimiter, registerLimiter } from '../middleware/clientAuth.js';
import {
    registerClient,
    loginClient,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
    changePassword,
    logoutClient
} from '../controllers/clientController.js';

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, registerClient);
router.post('/login', loginLimiter, loginClient);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// Image upload route with multer middleware
router.post('/upload-image', authenticateToken, upload.single('image'), uploadProfileImage);

router.put('/change-password', authenticateToken, changePassword);
router.post('/logout', authenticateToken, logoutClient);

export default router;