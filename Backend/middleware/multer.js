import multer from "multer";

// Use memory storage instead of disk storage for Cloudinary uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter
});

export default upload;