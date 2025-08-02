import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientModel from '../models/clientModel.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @desc    Register new client
// @route   POST /api/client/register
// @access  Public
const registerClient = async (req, res) => {
    try {
        const {
            name, email, password, gender, city, state, postalCode,
            idType, idNumber, occupation, monthlyIncome, accountType,
            initialDeposit, nomineeName, nomineeRelation, nomineePhone
        } = req.body;

        // Validation
        if (!name || !email || !password || !gender || !city || !state || 
            !postalCode || !idType || !idNumber || !occupation || 
            !monthlyIncome || !accountType || !initialDeposit || 
            !nomineeName || !nomineeRelation || !nomineePhone) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Check if client already exists
        const existingClient = await clientModel.findOne({
            $or: [{ email }, { idNumber }]
        });

        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Client already exists with this email or ID number'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate initial deposit
        if (initialDeposit < 100) {
            return res.status(400).json({
                success: false,
                message: 'Initial deposit must be at least $100'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new client
        const newClient = new clientModel({
            name,
            email,
            password: hashedPassword,
            gender,
            city,
            state,
            postalCode,
            idType,
            idNumber,
            occupation,
            monthlyIncome,
            accountType,
            initialDeposit,
            nomineeName,
            nomineeRelation,
            nomineePhone
        });

        await newClient.save();

        // Generate token
        const token = generateToken(newClient._id);

        // Remove password from response
        const clientData = {
            _id: newClient._id,
            name: newClient.name,
            email: newClient.email,
            accountNumber: newClient.accountNumber,
            accountType: newClient.accountType,
            status: newClient.status,
            image: newClient.image
        };

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            client: clientData
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login client
// @route   POST /api/client/login
// @access  Public
const loginClient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find client by email
        const client = await clientModel.findOne({ email });
        if (!client) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (client.status === 'Suspended' || client.status === 'Closed') {
            return res.status(403).json({
                success: false,
                message: `Account is ${client.status.toLowerCase()}. Please contact support.`
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, client.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(client._id);

        // Prepare client data for response
        const clientData = {
            _id: client._id,
            name: client.name,
            email: client.email,
            accountNumber: client.accountNumber,
            accountType: client.accountType,
            status: client.status,
            image: client.image,
            phone: client.phone,
            city: client.city,
            state: client.state
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            client: clientData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/client/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const client = await clientModel.findById(req.userId).select('-password');
        
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            client
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/client/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, address, city, state, postalCode, occupation, monthlyIncome } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (city) updateData.city = city;
        if (state) updateData.state = state;
        if (postalCode) updateData.postalCode = postalCode;
        if (occupation) updateData.occupation = occupation;
        if (monthlyIncome) updateData.monthlyIncome = monthlyIncome;

        const updatedClient = await clientModel.findByIdAndUpdate(
            req.userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            client: updatedClient
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

// @desc    Upload profile image
// @route   POST /api/client/upload-image
// @access  Private
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'bank_profiles',
            width: 300,
            height: 300,
            crop: 'fill',
            quality: 'auto'
        });

        // Update client profile with new image URL
        const updatedClient = await clientModel.findByIdAndUpdate(
            req.userId,
            { image: result.secure_url },
            { new: true }
        ).select('-password');

        // Delete local file
        fs.unlinkSync(req.file.path);

        if (!updatedClient) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile image updated successfully',
            imageUrl: result.secure_url,
            client: updatedClient
        });

    } catch (error) {
        console.error('Upload image error:', error);
        
        // Delete local file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: 'Server error while uploading image'
        });
    }
};

// @desc    Change password
// @route   PUT /api/client/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        // Find client
        const client = await clientModel.findById(req.userId);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, client.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await clientModel.findByIdAndUpdate(req.userId, {
            password: hashedNewPassword
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while changing password'
        });
    }
};

// @desc    Logout client
// @route   POST /api/client/logout
// @access  Private
const logoutClient = async (req, res) => {
    try {
        // In a more sophisticated setup, you might want to blacklist the token
        // For now, we'll just send a success response
        // The client will handle removing the token from localStorage
        
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};

export {
    registerClient,
    loginClient,
    getUserProfile,
    updateUserProfile,
    uploadProfileImage,
    changePassword,
    logoutClient
};