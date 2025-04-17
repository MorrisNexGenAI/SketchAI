import { users, type User, type InsertUser, sketches, feedback, annotations, type InsertSketch, type InsertFeedback, type InsertAnnotation, type Sketch, type Feedback, type Annotation } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFirstUser(): Promise<User | undefined>;
  
  // Sketch methods
  getSketch(id: number): Promise<Sketch | undefined>;
  getSketchesByUserId(userId: number): Promise<Sketch[]>;
  createSketch(sketch: InsertSketch): Promise<Sketch>;
  
  // Feedback methods
  getFeedback(id: number): Promise<Feedback | undefined>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // Annotation methods
  getAnnotation(id: number): Promise<Annotation | undefined>;
  getAnnotationsBySketchId(sketchId: number): Promise<Annotation[]>;
  createAnnotation(annotation: InsertAnnotation): Promise<Annotation>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getFirstUser(): Promise<User | undefined> {
    const [user] = await db.select().from(users).limit(1);
    return user || undefined;
  }
  
  // Sketch methods
  async getSketch(id: number): Promise<Sketch | undefined> {
    const [sketch] = await db.select().from(sketches).where(eq(sketches.id, id));
    return sketch || undefined;
  }
  
  async getSketchesByUserId(userId: number): Promise<Sketch[]> {
    return await db.select().from(sketches).where(eq(sketches.userId, userId));
  }
  
  async createSketch(insertSketch: InsertSketch): Promise<Sketch> {
    const [sketch] = await db
      .insert(sketches)
      .values(insertSketch)
      .returning();
    return sketch;
  }
  
  // Feedback methods
  async getFeedback(id: number): Promise<Feedback | undefined> {
    const [feedbackItem] = await db.select().from(feedback).where(eq(feedback.id, id));
    return feedbackItem || undefined;
  }
  
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [feedbackItem] = await db
      .insert(feedback)
      .values(insertFeedback)
      .returning();
    return feedbackItem;
  }
  
  // Annotation methods
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    const [annotation] = await db.select().from(annotations).where(eq(annotations.id, id));
    return annotation || undefined;
  }
  
  async getAnnotationsBySketchId(sketchId: number): Promise<Annotation[]> {
    return await db.select().from(annotations).where(eq(annotations.sketchId, sketchId));
  }
  
  async createAnnotation(insertAnnotation: InsertAnnotation): Promise<Annotation> {
    const [annotation] = await db
      .insert(annotations)
      .values(insertAnnotation)
      .returning();
    return annotation;
  }
}

// Fallback to MemStorage if database connection fails
class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sketches: Map<number, Sketch>;
  private feedbackItems: Map<number, Feedback>;
  private annotationItems: Map<number, Annotation>;
  
  currentUserId: number;
  currentSketchId: number;
  currentFeedbackId: number;
  currentAnnotationId: number;

  constructor() {
    this.users = new Map();
    this.sketches = new Map();
    this.feedbackItems = new Map();
    this.annotationItems = new Map();
    
    this.currentUserId = 1;
    this.currentSketchId = 1;
    this.currentFeedbackId = 1;
    this.currentAnnotationId = 1;
    
    // Create a default user
    this.createUser({
      username: "demouser",
      password: "password",
      preferences: {
        defaultMode: "pencil",
        favoriteSubject: "Biology"
      }
    });
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
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      preferences: insertUser.preferences || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async getFirstUser(): Promise<User | undefined> {
    if (this.users.size === 0) return undefined;
    return this.users.get(1);
  }
  
  // Sketch methods
  async getSketch(id: number): Promise<Sketch | undefined> {
    return this.sketches.get(id);
  }
  
  async getSketchesByUserId(userId: number): Promise<Sketch[]> {
    return Array.from(this.sketches.values()).filter(
      (sketch) => sketch.userId === userId
    );
  }
  
  async createSketch(insertSketch: InsertSketch): Promise<Sketch> {
    const id = this.currentSketchId++;
    const createdAt = new Date();
    // For memory storage, we'll use user ID 1 as default if not provided
    const userId = insertSketch.userId || 1;
    
    const sketch: Sketch = { 
      ...insertSketch, 
      id, 
      createdAt,
      userId,
      subject: insertSketch.subject || null,
      context: insertSketch.context || null,
      mood: insertSketch.mood || null,
      background: insertSketch.background || null,
      thickness: insertSketch.thickness || null
    };
    
    this.sketches.set(id, sketch);
    return sketch;
  }
  
  // Feedback methods
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedbackItems.get(id);
  }
  
  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const createdAt = new Date();
    // For memory storage, we'll use user ID 1 as default if not provided
    const userId = insertFeedback.userId || 1;
    
    const feedbackItem: Feedback = { 
      ...insertFeedback, 
      id, 
      createdAt,
      userId,
      sketchId: insertFeedback.sketchId || null,
      comments: insertFeedback.comments || null
    };
    
    this.feedbackItems.set(id, feedbackItem);
    return feedbackItem;
  }
  
  // Annotation methods
  async getAnnotation(id: number): Promise<Annotation | undefined> {
    return this.annotationItems.get(id);
  }
  
  async getAnnotationsBySketchId(sketchId: number): Promise<Annotation[]> {
    return Array.from(this.annotationItems.values()).filter(
      (annotation) => annotation.sketchId === sketchId
    );
  }
  
  async createAnnotation(insertAnnotation: InsertAnnotation): Promise<Annotation> {
    const id = this.currentAnnotationId++;
    const createdAt = new Date();
    // For memory storage, we'll use user ID 1 as default if not provided
    const userId = insertAnnotation.userId || 1;
    
    const annotation: Annotation = { 
      ...insertAnnotation, 
      id, 
      createdAt,
      userId,
      sketchId: insertAnnotation.sketchId || null
    };
    
    this.annotationItems.set(id, annotation);
    return annotation;
  }
}

// Try to use database storage, but fall back to memory storage if it fails
let storage: IStorage;

try {
  storage = new DatabaseStorage();
  console.log("Using database storage");
} catch (error) {
  console.error("Database connection failed, falling back to memory storage:", error);
  storage = new MemStorage();
}

export { storage };
