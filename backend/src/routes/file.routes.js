const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middleware/upload.middleware");
const File = require("../models/File.model");
const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("../config/cloudinary");
const {
  uploadFile,
  getUserFiles,
  deleteFile,
  viewFile,
} = require("../controller/file.controller");
const multerMiddleware = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
};

router.post(
  "/upload",
  multerMiddleware,
  asyncHandler(uploadFile)
);

router.get(
  "/",
  asyncHandler(getUserFiles)
);

router.delete(
  "/:id",
  asyncHandler(deleteFile)
);

router.get(
  "/view/:id",
  asyncHandler(viewFile)
);
module.exports = router;