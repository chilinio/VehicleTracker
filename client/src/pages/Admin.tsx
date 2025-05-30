import React, { useState, useEffect } from 'react';
import { useLocation, useRoute, useRouter } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, Edit, Eye, Upload, Save, Plus, Image } from 'lucide-react';

// Define service type
interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define gallery item type
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define testimonial type
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Define media item type
interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

// Login component
const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store token
      localStorage.setItem('auth_token', data.token);
      
      // Call the onLogin callback
      onLogin(data.token);
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Sign in to manage your website content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Service management component
const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const token = localStorage.getItem('auth_token');
  
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setImage(service.image);
    setDisplayOrder(service.displayOrder);
    setIsActive(service.isActive);
    setIsEditing(true);
  };
  
  const handleNew = () => {
    setCurrentService(null);
    setTitle('');
    setDescription('');
    setImage('');
    setDisplayOrder(services.length);
    setIsActive(true);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentService(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      title,
      description,
      image,
      displayOrder,
      isActive,
    };
    
    try {
      let response;
      
      if (currentService) {
        // Update
        response = await fetch(`/api/admin/services/${currentService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      } else {
        // Create
        response = await fetch('/api/admin/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save service');
      }
      
      toast({
        title: 'Success',
        description: currentService ? 'Service updated successfully' : 'Service created successfully',
      });
      
      // Refresh services
      fetchServices();
      setIsEditing(false);
      setCurrentService(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
      
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      
      // Refresh services
      fetchServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading && services.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentService ? 'Edit Service' : 'New Service'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL</label>
              <Input 
                id="image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                required 
              />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img src={image} alt="Preview" className="max-w-full h-40 object-cover rounded" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="displayOrder" className="text-sm font-medium">Display Order</label>
              <Input 
                id="displayOrder" 
                type="number" 
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))} 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                id="isActive" 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)} 
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Services</h2>
        <Button onClick={handleNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>
      
      {services.length === 0 ? (
        <p>No services found. Create your first service!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.displayOrder}</TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Gallery management component
const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<GalleryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const token = localStorage.getItem('auth_token');
  
  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/gallery', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchGalleryItems();
  }, []);
  
  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImage(item.image);
    setDisplayOrder(item.displayOrder);
    setIsActive(item.isActive);
    setIsEditing(true);
  };
  
  const handleNew = () => {
    setCurrentItem(null);
    setTitle('');
    setDescription('');
    setImage('');
    setDisplayOrder(galleryItems.length);
    setIsActive(true);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentItem(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData = {
      title,
      description,
      image,
      displayOrder,
      isActive,
    };
    
    try {
      let response;
      
      if (currentItem) {
        // Update
        response = await fetch(`/api/admin/gallery/${currentItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });
      } else {
        // Create
        response = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save gallery item');
      }
      
      toast({
        title: 'Success',
        description: currentItem ? 'Gallery item updated successfully' : 'Gallery item created successfully',
      });
      
      // Refresh gallery items
      fetchGalleryItems();
      setIsEditing(false);
      setCurrentItem(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }
      
      toast({
        title: 'Success',
        description: 'Gallery item deleted successfully',
      });
      
      // Refresh gallery items
      fetchGalleryItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading && galleryItems.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentItem ? 'Edit Gallery Item' : 'New Gallery Item'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image URL</label>
              <Input 
                id="image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                required 
              />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img src={image} alt="Preview" className="max-w-full h-40 object-cover rounded" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="displayOrder" className="text-sm font-medium">Display Order</label>
              <Input 
                id="displayOrder" 
                type="number" 
                value={displayOrder} 
                onChange={(e) => setDisplayOrder(parseInt(e.target.value))} 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                id="isActive" 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)} 
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gallery</h2>
        <Button onClick={handleNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Gallery Item
        </Button>
      </div>
      
      {galleryItems.length === 0 ? (
        <p>No gallery items found. Create your first gallery item!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {galleryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.displayOrder}</TableCell>
                <TableCell>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Testimonials management component
const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(5);
  const [isActive, setIsActive] = useState(true);
  
  const token = localStorage.getItem('auth_token');
  
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/testimonials', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTestimonials();
  }, []);
  
  const handleEdit = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setName(testimonial.name);
    setRole(testimonial.role);
    setContent(testimonial.content);
    setImage(testimonial.image || '');
    setRating(testimonial.rating);
    setIsActive(testimonial.isActive);
    setIsEditing(true);
  };
  
  const handleNew = () => {
    setCurrentTestimonial(null);
    setName('');
    setRole('');
    setContent('');
    setImage('');
    setRating(5);
    setIsActive(true);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentTestimonial(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const testimonialData = {
      name,
      role,
      content,
      image: image || undefined,
      rating,
      isActive,
    };
    
    try {
      let response;
      
      if (currentTestimonial) {
        // Update
        response = await fetch(`/api/admin/testimonials/${currentTestimonial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(testimonialData),
        });
      } else {
        // Create
        response = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(testimonialData),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save testimonial');
      }
      
      toast({
        title: 'Success',
        description: currentTestimonial ? 'Testimonial updated successfully' : 'Testimonial created successfully',
      });
      
      // Refresh testimonials
      fetchTestimonials();
      setIsEditing(false);
      setCurrentTestimonial(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }
      
      toast({
        title: 'Success',
        description: 'Testimonial deleted successfully',
      });
      
      // Refresh testimonials
      fetchTestimonials();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading && testimonials.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentTestimonial ? 'Edit Testimonial' : 'New Testimonial'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role/Company</label>
              <Input 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Testimonial</label>
              <Textarea 
                id="content" 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Profile Image URL (optional)</label>
              <Input 
                id="image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
              />
              {image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-full" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="rating" className="text-sm font-medium">Rating (1-5)</label>
              <Input 
                id="rating" 
                type="number" 
                min="1" 
                max="5" 
                value={rating} 
                onChange={(e) => setRating(parseInt(e.target.value))} 
                required 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                id="isActive" 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)} 
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">Active</label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Testimonials</h2>
        <Button onClick={handleNew} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>
      
      {testimonials.length === 0 ? (
        <p>No testimonials found. Create your first testimonial!</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Testimonial</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {testimonial.image && (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    )}
                    <span>{testimonial.name}</span>
                  </div>
                </TableCell>
                <TableCell>{testimonial.role}</TableCell>
                <TableCell className="max-w-xs truncate">{testimonial.content}</TableCell>
                <TableCell>{testimonial.rating} / 5</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {testimonial.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

// Media uploads management component
const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const token = localStorage.getItem('auth_token');
  
  const fetchMediaItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/media', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch media items');
      }
      
      const data = await response.json();
      setMediaItems(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMediaItems();
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          toast({
            title: 'Success',
            description: `${files.length} file(s) uploaded successfully`,
          });
          fetchMediaItems();
        } else {
          throw new Error('Upload failed');
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
      
      xhr.addEventListener('error', () => {
        toast({
          title: 'Error',
          description: 'An error occurred during upload',
          variant: 'destructive',
        });
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
      
      xhr.open('POST', '/api/admin/media/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
      
      // Refresh media items
      fetchMediaItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied',
        description: 'URL copied to clipboard',
      });
    });
  };
  
  if (isLoading && mediaItems.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Media Library</h2>
        
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,application/pdf"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
            className="flex items-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading ({uploadProgress}%)
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {mediaItems.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <Image className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">No media files found. Upload your first file!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {item.fileType.startsWith('image/') ? (
                  <img 
                    src={item.url} 
                    alt={item.originalName} 
                    className="w-full h-full object-cover"
                  />
                ) : item.fileType.startsWith('video/') ? (
                  <div className="flex items-center justify-center h-full">
                    <video 
                      src={item.url} 
                      className="max-h-full max-w-full" 
                      controls
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-sm font-medium">{item.fileType}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.originalName}</p>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="truncate pr-2">
                    <p className="text-sm font-medium truncate" title={item.originalName}>
                      {item.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.fileSize)}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(item.url)}
                      title="Copy URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="uploads">Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services">
          <ServicesManager />
        </TabsContent>
        
        <TabsContent value="gallery">
          <GalleryManager />
        </TabsContent>
        
        <TabsContent value="testimonials">
          <TestimonialsManager />
        </TabsContent>
        
        <TabsContent value="uploads">
          <MediaManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Admin page wrapper with auth
const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [, setLocation] = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setLocation('/admin');
  };
  
  if (!token) {
    return <Login onLogin={setToken} />;
  }
  
  return (
    <div>
      <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Blackdot Autos Admin</h1>
        <div className="flex items-center space-x-4">
          <a href="/" className="text-blue-600 hover:underline">View Website</a>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage; 