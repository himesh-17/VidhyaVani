import multer from 'multer';
import { storage } from '../config/cloudinary.js';

// Init upload with Cloudinary storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Check file type (kept for extra validation, though CloudinaryStorage also has allowed_formats)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    // access originalname safely
    const originalname = file.originalname || '';
    const extname = filetypes.test(
        (originalname.split('.').pop() || '').toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

export const uploadImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            // Multer error
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: err.message,
                });
            }
            // Helper error
            return res.status(400).json({
                success: false,
                message: err.message,
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // Cloudinary returns the URL in req.file.path
        const imageUrl = req.file.path;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                imageUrl,
                // Cloudinary specific info if needed
                publicId: req.file.filename
            }
        });
    });
};
