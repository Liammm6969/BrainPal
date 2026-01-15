const File = require("../models/File.model");

exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
        }
        const fileData = {
        user: req.user.id,
        filename: req.file.originalname,
        url: req.file.path,
        size: req.file.size,
        fileType: req.file.mimetype,
        };
        const file = new File(fileData);
        await file.save();
        res.status(201).json({ message: "File uploaded successfully", file });
    } catch (err) {
        next(err);
    }
};

exports.getUserFiles = async (req, res, next) => {
    try {
        const files = await File.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ files });
    } catch (err) {
        next(err);
    }
};

exports.deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
        return res.status(404).json({ message: "File not found" });
        }
        if (file.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
        }
        await file.remove();
        res.json({ message: "File deleted successfully" });
    } catch (err) {
        next(err);
    }
};