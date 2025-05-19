import { users, contacts, subscribers, type User, type InsertUser, type Contact, type InsertContact, type Subscriber, type InsertSubscriber } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  getContact(id: number): Promise<Contact | undefined>;
  addContact(contact: InsertContact & { createdAt: string }): Promise<Contact>;
  
  // Subscriber methods
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  addSubscriber(subscriber: InsertSubscriber & { createdAt: string }): Promise<Subscriber>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
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
  
  // Subscriber methods
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }
  
  async addSubscriber(subscriberData: InsertSubscriber & { createdAt: string }): Promise<Subscriber> {
    const [subscriber] = await db.insert(subscribers).values(subscriberData).returning();
    return subscriber;
  }
}

export const storage = new DatabaseStorage();
