import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Define upload directory paths
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');

// Ensure upload directories exist
(async () => {
  try {
    await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });
    await fsPromises.mkdir(THUMBNAILS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directories:', error);
  }
})();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// Configure upload restrictions
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and PDFs
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload an image or PDF.'));
  }
};

// Create the multer upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Helper function to create a thumbnail for image files
export const createThumbnail = async (file: Express.Multer.File): Promise<string | null> => {
  try {
    // Only process image files
    if (!file.mimetype.startsWith('image/')) {
      return null;
    }
    
    const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${path.basename(file.path)}`);
    
    // Generate thumbnail
    await sharp(file.path)
      .resize(200, 200, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);
      
    return thumbnailPath;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    return null;
  }
};

// Helper function to delete a file and its thumbnail
export const deleteFile = async (filePath: string): Promise<boolean> => {
  try {
    // Delete the original file
    await fsPromises.unlink(filePath);
    
    // Try to delete thumbnail if it exists
    const fileName = path.basename(filePath);
    const thumbnailPath = path.join(THUMBNAILS_DIR, `thumb_${fileName}`);
    
    try {
      await fsPromises.access(thumbnailPath);
      await fsPromises.unlink(thumbnailPath);
    } catch (error) {
      // Thumbnail doesn't exist, which is fine
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get a file's public URL
export const getFileUrl = (filePath: string): string => {
  const relativePath = path.relative(process.cwd(), filePath);
  return `/uploads/${path.basename(filePath)}`;
};

// Helper function to get a thumbnail's public URL
export const getThumbnailUrl = (filePath: string): string => {
  const fileName = path.basename(filePath);
  return `/uploads/thumbnails/thumb_${fileName}`;
}; 