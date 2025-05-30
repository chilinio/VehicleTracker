import { Router } from 'express';
import { storage } from './storage';
import { 
  insertServiceSchema, 
  insertGalleryItemSchema, 
  insertTestimonialSchema,
  insertUploadSchema
} from '@shared/schema';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { upload as fileUpload, createThumbnail, getFileUrl, deleteFile } from './uploads';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.user = user;
    next();
  });
};

// Admin role check middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  next();
};

export const adminRouter = Router();

// Admin authentication routes
adminRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Create initial admin user if none exists
adminRouter.post('/setup', async (req, res) => {
  try {
    // Check if any users exist
    const users = await storage.getUsers();
    
    if (users.length > 0) {
      return res.status(400).json({ message: 'Setup has already been completed' });
    }
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      isAdmin: true
    });
    
    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ message: 'An error occurred during setup' });
  }
});

// Protected admin routes
// Services
adminRouter.get('/services', authenticateToken, async (req, res) => {
  try {
    const services = await storage.getServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'An error occurred while fetching services' });
  }
});

adminRouter.post('/services', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const serviceData = insertServiceSchema.parse(req.body);
    const service = await storage.createService(serviceData);
    
    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({
        message: 'Validation error',
        errors: validationError.message
      });
    } else {
      console.error('Error creating service:', error);
      res.status(500).json({ message: 'An error occurred while creating the service' });
    }
  }
});

adminRouter.put('/services/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingService = await storage.getService(id);
    
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Partial validation of request body
    const serviceData = req.body;
    const updatedService = await storage.updateService(id, serviceData);
    
    res.status(200).json({
      message: 'Service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'An error occurred while updating the service' });
  }
});

adminRouter.delete('/services/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingService = await storage.getService(id);
    
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    const deleted = await storage.deleteService(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Service deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete service' });
    }
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'An error occurred while deleting the service' });
  }
});

// Gallery Items
adminRouter.get('/gallery', authenticateToken, async (req, res) => {
  try {
    const items = await storage.getGalleryItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'An error occurred while fetching gallery items' });
  }
});

adminRouter.post('/gallery', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const itemData = insertGalleryItemSchema.parse(req.body);
    const item = await storage.createGalleryItem(itemData);
    
    res.status(201).json({
      message: 'Gallery item created successfully',
      item
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({
        message: 'Validation error',
        errors: validationError.message
      });
    } else {
      console.error('Error creating gallery item:', error);
      res.status(500).json({ message: 'An error occurred while creating the gallery item' });
    }
  }
});

adminRouter.put('/gallery/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingItem = await storage.getGalleryItem(id);
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    const itemData = req.body;
    const updatedItem = await storage.updateGalleryItem(id, itemData);
    
    res.status(200).json({
      message: 'Gallery item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'An error occurred while updating the gallery item' });
  }
});

adminRouter.delete('/gallery/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingItem = await storage.getGalleryItem(id);
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    const deleted = await storage.deleteGalleryItem(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Gallery item deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete gallery item' });
    }
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the gallery item' });
  }
});

// Testimonials
adminRouter.get('/testimonials', authenticateToken, async (req, res) => {
  try {
    const testimonials = await storage.getTestimonials();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ message: 'An error occurred while fetching testimonials' });
  }
});

adminRouter.post('/testimonials', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testimonialData = insertTestimonialSchema.parse(req.body);
    const testimonial = await storage.createTestimonial(testimonialData);
    
    res.status(201).json({
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      res.status(400).json({
        message: 'Validation error',
        errors: validationError.message
      });
    } else {
      console.error('Error creating testimonial:', error);
      res.status(500).json({ message: 'An error occurred while creating the testimonial' });
    }
  }
});

adminRouter.put('/testimonials/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingTestimonial = await storage.getTestimonial(id);
    
    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    const testimonialData = req.body;
    const updatedTestimonial = await storage.updateTestimonial(id, testimonialData);
    
    res.status(200).json({
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ message: 'An error occurred while updating the testimonial' });
  }
});

adminRouter.delete('/testimonials/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingTestimonial = await storage.getTestimonial(id);
    
    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    const deleted = await storage.deleteTestimonial(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Testimonial deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete testimonial' });
    }
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ message: 'An error occurred while deleting the testimonial' });
  }
});

// File uploads
adminRouter.post('/uploads', authenticateToken, requireAdmin, fileUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Create thumbnail for images
    let thumbnailPath = null;
    if (req.file.mimetype.startsWith('image/')) {
      thumbnailPath = await createThumbnail(req.file);
    }
    
    // Store upload info in database
    const uploadData = {
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    };
    
    const upload = await storage.createUpload(uploadData);
    
    // Generate URLs
    const fileUrl = getFileUrl(req.file.path);
    const thumbnailUrl = thumbnailPath ? getFileUrl(thumbnailPath) : null;
    
    res.status(201).json({
      message: 'File uploaded successfully',
      upload: {
        ...upload,
        url: fileUrl,
        thumbnailUrl
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'An error occurred while uploading the file' });
  }
});

adminRouter.get('/uploads', authenticateToken, async (req, res) => {
  try {
    const uploads = await storage.getUploads();
    
    // Add URLs to each upload
    const uploadsWithUrls = uploads.map(upload => ({
      ...upload,
      url: getFileUrl(upload.path),
      thumbnailUrl: upload.mimetype.startsWith('image/') 
        ? `/uploads/thumbnails/thumb_${path.basename(upload.path)}`
        : null
    }));
    
    res.status(200).json(uploadsWithUrls);
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ message: 'An error occurred while fetching uploads' });
  }
});

adminRouter.delete('/uploads/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingUpload = await storage.getUpload(id);
    
    if (!existingUpload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    
    // Delete the file first
    const fileDeleted = await deleteFile(existingUpload.path);
    
    if (!fileDeleted) {
      return res.status(500).json({ message: 'Failed to delete file' });
    }
    
    // Then delete the database entry
    const deleted = await storage.deleteUpload(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Upload deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete upload from database' });
    }
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ message: 'An error occurred while deleting the upload' });
  }
});

// Contacts management
adminRouter.get('/contacts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'An error occurred while fetching contacts' });
  }
});

adminRouter.delete('/contacts/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const existingContact = await storage.getContact(id);
    
    if (!existingContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const deleted = await storage.deleteContact(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete contact' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'An error occurred while deleting the contact' });
  }
});

// Subscribers management
adminRouter.get('/subscribers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subscribers = await storage.getSubscribers();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'An error occurred while fetching subscribers' });
  }
});

adminRouter.delete('/subscribers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const deleted = await storage.deleteSubscriber(id);
    
    if (deleted) {
      res.status(200).json({ message: 'Subscriber deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete subscriber' });
    }
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'An error occurred while deleting the subscriber' });
  }
}); 