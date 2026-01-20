const File = require('../models/File.model');
const cloudinary = require('cloudinary').v2;

// Upload file
const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, size, filename } = req.file; // filename is the public_id from Cloudinary
    const userId = req.user.id;

    const newFile = new File({
      filename: originalname,
      mimeType: mimetype,
      size,
      publicId: filename, // Save the Cloudinary public_id
      user: userId,
    });

    await newFile.save();
    res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
};

// Get user files
const getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await File.find({ user: userId });
    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Find the file to get the public_id
    const file = await File.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from MongoDB
    await File.findByIdAndDelete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};module.exports = { uploadFile, getUserFiles, deleteFile };

// View file
const viewFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Find the file to get the public_id
    const file = await File.findOne({ _id: fileId, user: userId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Generate a temporary URL from Cloudinary
    const url = cloudinary.url(file.publicId, { secure: true });

    res.json({ url });
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ message: 'Failed to view file' });
  }
};

module.exports = { uploadFile, getUserFiles, deleteFile, viewFile };