import { users, type User, type InsertUser, type Contact, type InsertContact, type Subscriber, type InsertSubscriber } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private subscribers: Map<number, Subscriber>;
  private userCurrentId: number;
  private contactCurrentId: number;
  private subscriberCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.subscribers = new Map();
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.subscriberCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Contact methods
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async addContact(contactData: InsertContact & { createdAt: string }): Promise<Contact> {
    const id = this.contactCurrentId++;
    // Ensure service has a default value if not provided
    const contact: Contact = { 
      ...contactData, 
      id,
      service: contactData.service || '' 
    };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Subscriber methods
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email,
    );
  }
  
  async addSubscriber(subscriberData: InsertSubscriber & { createdAt: string }): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const subscriber: Subscriber = { ...subscriberData, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();
