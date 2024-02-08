const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadMiddleware = (fileFields, uploadPath) => {

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
      
    const upload = multer({ storage: storage });
    
    return (req, res, next) => {
        // Use multer upload instance
        upload.fields(fileFields)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            // Retrieve uploaded files
            const files = req.files;
            const errors = [];

            // Validate file types and sizes
            Array.from(files).forEach((file) => {
                const allowedTypes = ['image/jpeg', 'image/png'];
                const maxSize = 0.00001 * 1024 * 1024; // 5MB

                if (!allowedTypes.includes(file.mimetype)) {
                    errors.push(`Invalid file type: ${file.originalname}`);
                }

                if (file.size > maxSize) {
                    errors.push(`File too large: ${file.originalname}`);
                }
            });

            if (errors.length > 0) {
                // Remove uploaded files
                files.forEach((file) => {
                    fs.unlinkSync(file.path);
                });
                return res.status(400).json({ errors });
            }

            req.files = files;
            next();
        });
    }
};

module.exports = uploadMiddleware;