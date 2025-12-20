const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('No file provided or file buffer is missing'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'ecommerce',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { format: 'webp' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Image upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

const deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };