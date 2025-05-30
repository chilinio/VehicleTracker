import { users, contacts, subscribers, services, galleryItems, testimonials, uploads, 
  type User, type InsertUser, 
  type Contact, type InsertContact, 
  type Subscriber, type InsertSubscriber,
  type Service, type InsertService,
  type GalleryItem, type InsertGalleryItem,
  type Testimonial, type InsertTestimonial,
  type Upload, type InsertUpload
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  addContact(contact: InsertContact & { createdAt: string }): Promise<Contact>;
  deleteContact(id: number): Promise<boolean>;
  
  // Subscriber methods
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getSubscribers(): Promise<Subscriber[]>;
  addSubscriber(subscriber: InsertSubscriber & { createdAt: string }): Promise<Subscriber>;
  deleteSubscriber(id: number): Promise<boolean>;
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Gallery methods
  getGalleryItem(id: number): Promise<GalleryItem | undefined>;
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  updateGalleryItem(id: number, item: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined>;
  deleteGalleryItem(id: number): Promise<boolean>;
  
  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
  
  // Upload methods
  getUpload(id: number): Promise<Upload | undefined>;
  getUploads(): Promise<Upload[]>;
  createUpload(upload: InsertUpload): Promise<Upload>;
  deleteUpload(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }
  
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  
  async addContact(contactData: InsertContact & { createdAt: string }): Promise<Contact> {
    // Make sure service is never undefined
    const data = {
      ...contactData,
      service: contactData.service || ""
    };
    
    const [contact] = await db.insert(contacts).values(data).returning();
    return contact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id)).returning();
    return result.length > 0;
  }
  
  // Subscriber methods
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }
  
  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }
  
  async addSubscriber(subscriberData: InsertSubscriber & { createdAt: string }): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(subscriberData).returning();
    return subscriber;
  }
  
  async deleteSubscriber(id: number): Promise<boolean> {
    const result = await db.delete(subscribers).where(eq(subscribers.id, id)).returning();
    return result.length > 0;
  }
  
  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }
  
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.displayOrder));
  }
  
  async createService(serviceData: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values({
      ...serviceData,
      updatedAt: new Date()
    }).returning();
    return service;
  }
  
  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const [service] = await db.update(services)
      .set({
        ...serviceData,
        updatedAt: new Date()
      })
      .where(eq(services.id, id))
      .returning();
    return service;
  }
  
  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }
  
  // Gallery methods
  async getGalleryItem(id: number): Promise<GalleryItem | undefined> {
    const [item] = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return item;
  }
  
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems).orderBy(asc(galleryItems.displayOrder));
  }
  
  async createGalleryItem(itemData: InsertGalleryItem): Promise<GalleryItem> {
    const [item] = await db.insert(galleryItems).values({
      ...itemData,
      updatedAt: new Date()
    }).returning();
    return item;
  }
  
  async updateGalleryItem(id: number, itemData: Partial<InsertGalleryItem>): Promise<GalleryItem | undefined> {
    const [item] = await db.update(galleryItems)
      .set({
        ...itemData,
        updatedAt: new Date()
      })
      .where(eq(galleryItems.id, id))
      .returning();
    return item;
  }
  
  async deleteGalleryItem(id: number): Promise<boolean> {
    const result = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();
    return result.length > 0;
  }
  
  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }
  
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(asc(testimonials.displayOrder));
  }
  
  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values({
      ...testimonialData,
      updatedAt: new Date()
    }).returning();
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db.update(testimonials)
      .set({
        ...testimonialData,
        updatedAt: new Date()
      })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }
  
  // Upload methods
  async getUpload(id: number): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload;
  }
  
  async getUploads(): Promise<Upload[]> {
    return await db.select().from(uploads).orderBy(desc(uploads.createdAt));
  }
  
  async createUpload(uploadData: InsertUpload): Promise<Upload> {
    const [upload] = await db.insert(uploads).values(uploadData).returning();
    return upload;
  }
  
  async deleteUpload(id: number): Promise<boolean> {
    const result = await db.delete(uploads).where(eq(uploads.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
