import { exec } from 'child_process';
import { promisify } from 'util';
import { db, pool } from './server/db.js';
import {
  services,
  galleryItems,
  testimonials,
  users
} from './shared/schema.js';
import bcrypt from 'bcryptjs';
import { services as servicesData } from './client/src/lib/data.js';
import { galleryItems as galleryItemsData } from './client/src/lib/data.js';
import { testimonials as testimonialsData } from './client/src/lib/data.js';

const execPromise = promisify(exec);

async function main() {
  try {
    console.log('Running database migrations...');
    await execPromise('npm run db:push');
    console.log('Migrations completed successfully.');
    
    // Seed admin user
    console.log('Seeding admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if users table is empty
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists. Skipping...');
    }
    
    // Seed services
    console.log('Seeding services...');
    const existingServices = await db.select().from(services);
    
    if (existingServices.length === 0) {
      for (let i = 0; i < servicesData.length; i++) {
        await db.insert(services).values({
          title: servicesData[i].title,
          description: servicesData[i].description,
          image: servicesData[i].image,
          displayOrder: i,
          isActive: true,
        });
      }
      console.log('Services seeded successfully.');
    } else {
      console.log('Services already exist. Skipping...');
    }
    
    // Seed gallery items
    console.log('Seeding gallery items...');
    const existingGalleryItems = await db.select().from(galleryItems);
    
    if (existingGalleryItems.length === 0) {
      for (let i = 0; i < galleryItemsData.length; i++) {
        await db.insert(galleryItems).values({
          title: galleryItemsData[i].title,
          description: galleryItemsData[i].description,
          image: galleryItemsData[i].image,
          category: galleryItemsData[i].category,
          displayOrder: i,
          isActive: true,
        });
      }
      console.log('Gallery items seeded successfully.');
    } else {
      console.log('Gallery items already exist. Skipping...');
    }
    
    // Seed testimonials
    console.log('Seeding testimonials...');
    const existingTestimonials = await db.select().from(testimonials);
    
    if (existingTestimonials.length === 0) {
      for (let i = 0; i < testimonialsData.length; i++) {
        await db.insert(testimonials).values({
          name: testimonialsData[i].name,
          title: testimonialsData[i].title,
          quote: testimonialsData[i].quote,
          avatar: testimonialsData[i].avatar,
          rating: testimonialsData[i].rating * 10, // Convert to integer (e.g., 4.5 -> 45)
          displayOrder: i,
          isActive: true,
        });
      }
      console.log('Testimonials seeded successfully.');
    } else {
      console.log('Testimonials already exist. Skipping...');
    }
    
    console.log('All migrations and seeding completed successfully!');
    
    // Close database connection
    await pool.end();
    
  } catch (error) {
    console.error('Error running migrations and seeding:', error);
    process.exit(1);
  }
}

main(); 