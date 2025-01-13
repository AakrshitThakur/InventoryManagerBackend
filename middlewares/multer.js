// Third party middleware to store images in Cloudinary cloud storage
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary.js');

// Configure Cloudinary storage, enabling the storage engine to interact with your Cloudinary account.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Assigning our cloudinary credential instance
  params: {
    folder: 'InventoryManagerImgs', // Specifies the folder in the Cloudinary account where files will be stored
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage });

module.exports = upload;
