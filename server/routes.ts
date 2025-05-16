import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertSubscriberSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate request data
      const contactData = insertContactSchema.parse(req.body);
      
      // Add timestamps
      const contactWithTimestamp = {
        ...contactData,
        createdAt: new Date().toISOString(),
      };
      
      // Store contact form submission
      const result = await storage.addContact(contactWithTimestamp);
      
      res.status(200).json({ 
        message: "Contact form submitted successfully", 
        id: result.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.message 
        });
      } else {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ 
          message: "An error occurred while submitting the form" 
        });
      }
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      // Validate request data
      const subscriberData = insertSubscriberSchema.parse(req.body);
      
      // Add timestamps
      const subscriberWithTimestamp = {
        ...subscriberData,
        createdAt: new Date().toISOString(),
      };
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(subscriberData.email);
      
      if (existingSubscriber) {
        return res.status(409).json({ 
          message: "This email is already subscribed to our newsletter" 
        });
      }
      
      // Store new subscriber
      const result = await storage.addSubscriber(subscriberWithTimestamp);
      
      res.status(200).json({ 
        message: "Successfully subscribed to newsletter", 
        id: result.id 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.message 
        });
      } else {
        console.error("Error subscribing to newsletter:", error);
        res.status(500).json({ 
          message: "An error occurred while processing your subscription" 
        });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
