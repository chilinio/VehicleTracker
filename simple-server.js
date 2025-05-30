import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Use a different port to avoid conflicts

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/public')));
console.log(`Static directory: ${path.join(__dirname, 'dist/public')}`);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock authentication middleware for admin routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // For testing purposes, accept any token
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Handle API routes
app.post('/api/admin/login', (req, res) => {
  console.log('Login attempt:', req.body);
  // For testing purposes, accept any login
  res.json({ 
    token: 'test-token-123',
    user: {
      id: 1,
      username: req.body.username || 'admin',
      role: 'admin'
    }
  });
});

// Mock services API
app.get('/api/admin/services', authMiddleware, (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Oil Change',
      description: 'Complete oil change service with filter replacement',
      image: '/assets/services/oil-change.jpg',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Brake Service',
      description: 'Comprehensive brake inspection and repair',
      image: '/assets/services/brake-service.jpg',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Tire Rotation',
      description: 'Complete tire rotation and balancing service',
      image: '/assets/services/tire-rotation.jpg',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// CRUD operations for services
app.post('/api/admin/services', authMiddleware, (req, res) => {
  console.log('Create service:', req.body);
  // Mock successful creation
  res.status(201).json({
    id: Math.floor(Math.random() * 1000) + 10,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/admin/services/:id', authMiddleware, (req, res) => {
  console.log(`Update service ${req.params.id}:`, req.body);
  // Mock successful update
  res.json({
    id: parseInt(req.params.id),
    ...req.body,
    updatedAt: new Date().toISOString()
  });
});

app.delete('/api/admin/services/:id', authMiddleware, (req, res) => {
  console.log(`Delete service ${req.params.id}`);
  // Mock successful deletion
  res.status(204).end();
});

// Mock gallery API
app.get('/api/admin/gallery', authMiddleware, (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Luxury Car Detail',
      description: 'Professional detailing for luxury vehicles',
      image: '/assets/gallery/luxury-detail.jpg',
      displayOrder: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Engine Repair',
      description: 'Expert engine repair and maintenance',
      image: '/assets/gallery/engine-repair.jpg',
      displayOrder: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Custom Modifications',
      description: 'Custom vehicle modifications and upgrades',
      image: '/assets/gallery/custom-mods.jpg',
      displayOrder: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// CRUD operations for gallery
app.post('/api/admin/gallery', authMiddleware, (req, res) => {
  console.log('Create gallery item:', req.body);
  res.status(201).json({
    id: Math.floor(Math.random() * 1000) + 10,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/admin/gallery/:id', authMiddleware, (req, res) => {
  console.log(`Update gallery item ${req.params.id}:`, req.body);
  res.json({
    id: parseInt(req.params.id),
    ...req.body,
    updatedAt: new Date().toISOString()
  });
});

app.delete('/api/admin/gallery/:id', authMiddleware, (req, res) => {
  console.log(`Delete gallery item ${req.params.id}`);
  res.status(204).end();
});

// Mock testimonials API
app.get('/api/admin/testimonials', authMiddleware, (req, res) => {
  res.json([
    {
      id: 1,
      name: 'John Smith',
      role: 'BMW Owner',
      content: 'Excellent service! My car runs better than ever after the tune-up.',
      image: '/assets/testimonials/person1.jpg',
      rating: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Lisa Johnson',
      role: 'Mercedes Owner',
      content: 'Professional and efficient. I highly recommend their services for luxury vehicles.',
      image: '/assets/testimonials/person2.jpg',
      rating: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Robert Williams',
      role: 'Toyota Owner',
      content: 'Fair prices and excellent work. Will definitely return for future maintenance.',
      image: null,
      rating: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// CRUD operations for testimonials
app.post('/api/admin/testimonials', authMiddleware, (req, res) => {
  console.log('Create testimonial:', req.body);
  res.status(201).json({
    id: Math.floor(Math.random() * 1000) + 10,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  console.log(`Update testimonial ${req.params.id}:`, req.body);
  res.json({
    id: parseInt(req.params.id),
    ...req.body,
    updatedAt: new Date().toISOString()
  });
});

app.delete('/api/admin/testimonials/:id', authMiddleware, (req, res) => {
  console.log(`Delete testimonial ${req.params.id}`);
  res.status(204).end();
});

// Mock media API
app.get('/api/admin/media', authMiddleware, (req, res) => {
  res.json([
    {
      id: 1,
      filename: 'car-repair-1.jpg',
      originalName: 'car-repair.jpg',
      fileType: 'image/jpeg',
      fileSize: 1024000,
      url: '/uploads/car-repair-1.jpg',
      thumbnailUrl: '/uploads/thumbnails/car-repair-1.jpg',
      uploadedAt: new Date().toISOString()
    },
    {
      id: 2,
      filename: 'engine-diagnostic.jpg',
      originalName: 'engine-diagnostic.jpg',
      fileType: 'image/jpeg',
      fileSize: 1458000,
      url: '/uploads/engine-diagnostic.jpg',
      thumbnailUrl: '/uploads/thumbnails/engine-diagnostic.jpg',
      uploadedAt: new Date().toISOString()
    },
    {
      id: 3,
      filename: 'brochure.pdf',
      originalName: 'service-brochure.pdf',
      fileType: 'application/pdf',
      fileSize: 2048000,
      url: '/uploads/brochure.pdf',
      uploadedAt: new Date().toISOString()
    }
  ]);
});

// Mock file upload endpoint
app.post('/api/admin/media/upload', authMiddleware, (req, res) => {
  console.log('File upload request received');
  // Simulate successful upload
  setTimeout(() => {
    res.status(201).json({
      message: 'Files uploaded successfully',
      files: [
        {
          id: Math.floor(Math.random() * 1000) + 10,
          filename: `uploaded-file-${Date.now()}.jpg`,
          originalName: 'user-upload.jpg',
          fileType: 'image/jpeg',
          fileSize: 1024000,
          url: '/uploads/sample-upload.jpg',
          thumbnailUrl: '/uploads/thumbnails/sample-upload.jpg',
          uploadedAt: new Date().toISOString()
        }
      ]
    });
  }, 1500); // Simulate network delay
});

app.delete('/api/admin/media/:id', authMiddleware, (req, res) => {
  console.log(`Delete media item ${req.params.id}`);
  res.status(204).end();
});

// All routes serve index.html for client-side routing
app.get('*', (req, res) => {
  console.log(`Serving index.html for path: ${req.url}`);
  // Check if the file exists before sending it
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`Error: index.html not found at ${indexPath}`);
    res.status(404).send('404 - File not found: index.html is missing');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
}); 