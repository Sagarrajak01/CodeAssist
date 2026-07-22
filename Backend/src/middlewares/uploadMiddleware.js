const multer = require('multer');
const path = require('path');

// Configure storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be temporarily stored in backend/uploads/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Restrict uploads to ZIP files only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/zip' || 
    file.mimetype === 'application/x-zip-compressed' ||
    file.originalname.endsWith('.zip')
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only .zip files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  }
});

module.exports = upload;