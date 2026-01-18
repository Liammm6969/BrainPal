const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../middleware/upload.middleware");
const File = require("../models/File.model");
const asyncHandler = require("../utils/asyncHandler");

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
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = new File({
      user: req.user._id,
      filename: req.file.originalname,
      url: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });
    await file.save();
    res.status(201).json(file);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const files = await File.find({ user: req.user._id });
    res.json(files);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (file.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await file.remove();
    res.json({ message: "File deleted successfully" });
  })
);

module.exports = router;