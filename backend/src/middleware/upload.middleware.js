const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const path = require("path");

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studybuddy_files",
    resource_type: "auto",
    public_id: (req, file) => {
      const sanitizedName = path.parse(file.originalname).name
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .substring(0, 100);
      return sanitizedName;
    },
  },
});

const fileFilter = (req, file, cb) => {
  console.log("File upload attempt:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });
  
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn(`File type rejected: ${file.mimetype} for file ${file.originalname}`);
    cb(
      new Error(
        `File type "${file.mimetype}" not allowed. Allowed types: PDF, Word, Excel, PowerPoint, TXT, CSV`
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
});

const handleMulterError = (err, req, res, next) => {
  console.error("Upload error:", {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack,
  });
  
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Only one file allowed per upload.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Unexpected file field. Use 'file' as the field name.",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
      error: err.code,
    });
  }

  if (err) {
    if (err.http_code || err.message?.includes("cloudinary")) {
      console.error("Cloudinary error:", err);
      return res.status(500).json({
        message: "File upload service error. Please check Cloudinary configuration.",
      });
    }
    
    return res.status(400).json({
      message: err.message || "File upload failed",
    });
  }
  
  next();
};

module.exports = { upload, handleMulterError };