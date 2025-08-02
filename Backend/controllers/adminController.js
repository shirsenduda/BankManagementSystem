import bankManagerModel from "../models/bankManagerModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

const addManager = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            department, 
            experience, 
            about, 
            address, 
            city, 
            state, 
            postalCode, 
            gender, 
            position, 
            idType, 
            idNumber,
            dateOfBirth,  // Add this line
            phone         // Add this if you want to handle phone too
        } = req.body;
        
        const imageFile = req.file;
        
        
        
        // Check if manager already exists by email
        const existingManager = await bankManagerModel.findOne({ email });
        if (existingManager) {
            return res.status(400).json({
                success: false,
                message: "Manager with this email already exists"
            });
        }
        
        // Check if manager already exists by idNumber
        const existingManagerByIdNumber = await bankManagerModel.findOne({ idNumber });
        if (existingManagerByIdNumber) {
            return res.status(400).json({
                success: false,
                message: "Manager with this ID number already exists"
            });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Upload image to Cloudinary if provided
        let imageUrl = '';
        if (imageFile) {
            try {
                // For memory storage, upload buffer directly
                const result = await cloudinary.uploader.upload(
                    `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`,
                    {
                        folder: 'bank_managers',
                        resource_type: 'image'
                    }
                );
                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image",
                    error: uploadError.message
                });
            }
        }
        
        // Parse dateOfBirth if it's provided
        let parsedDateOfBirth = null;
        if (dateOfBirth) {
            // Handle different date formats
            if (typeof dateOfBirth === 'string') {
                // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
                if (dateOfBirth.includes('/')) {
                    const [day, month, year] = dateOfBirth.split('/');
                    parsedDateOfBirth = new Date(`${year}-${month}-${day}`);
                } else {
                    parsedDateOfBirth = new Date(dateOfBirth);
                }
            } else {
                parsedDateOfBirth = new Date(dateOfBirth);
            }
            
            // Validate the date
            if (isNaN(parsedDateOfBirth.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format for dateOfBirth"
                });
            }
        }
        
        // Create new manager
        const newManager = new bankManagerModel({
            name,
            email,
            password: hashedPassword,
            department,
            experience,
            about,
            address: typeof address === 'string' ? JSON.parse(address) : address,
            city,
            state,
            postalCode,
            gender,
            position,
            idType,
            idNumber,
            dateOfBirth: parsedDateOfBirth,  // Add this line
            phone: phone || "0000000000",    // Add this line with default
            image: imageUrl
        });
        
        await newManager.save();
        
        res.status(201).json({
            success: true,
            message: "Manager added successfully",
            data: {
                id: newManager._id,
                name: newManager.name,
                email: newManager.email,
                employeeId: newManager.employeeId,
                dateOfBirth: newManager.dateOfBirth
            }
        });
        
    } catch (error) {
        console.error("Error in addManager:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add manager",
            error: error.message
        });
    }
};

export { addManager };