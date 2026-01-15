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
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`
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
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  }
  if (err) {
    return res.status(400).json({
      message: err.message || "File upload failed",
    });
  }
  next();
};

module.exports = { upload, handleMulterError };