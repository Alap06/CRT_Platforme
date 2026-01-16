const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['news', 'resources', 'activities', 'reports'];
uploadDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', 'uploads', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder based on route
        let folder = 'uploads';
        if (req.baseUrl.includes('news')) folder = 'uploads/news';
        else if (req.baseUrl.includes('resources')) folder = 'uploads/resources';
        else if (req.baseUrl.includes('activities')) folder = 'uploads/activities';
        else if (req.baseUrl.includes('reports')) folder = 'uploads/reports';

        const uploadPath = path.join(__dirname, '..', folder);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WEBP.'), false);
    }
};

// Multer config
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

// Middleware exports
const uploadSingle = upload.single('image');
const uploadMultiple = upload.array('images', 10);
const uploadFields = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 10 }
]);

// Helper function to get file URL
const getFileUrl = (filename, folder) => {
    return `/uploads/${folder}/${filename}`;
};

// Helper function to delete file
const deleteFile = (fileUrl) => {
    if (!fileUrl) return;
    try {
        const filePath = path.join(__dirname, '..', fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Le fichier est trop volumineux. Max 10MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Trop de fichiers. Max 10 fichiers.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next();
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadFields,
    getFileUrl,
    deleteFile,
    handleUploadError
};
