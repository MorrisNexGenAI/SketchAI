import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  preferences: json("preferences").$type<{
    defaultMode?: string;
    favoriteSubject?: string;
    favoriteBackgrounds?: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  sketches: many(sketches),
  feedback: many(feedback),
  annotations: many(annotations),
}));

// Sketch schema
export const sketches = pgTable("sketches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  image: text("image").notNull(), // base64 encoded original image
  sketch: text("sketch").notNull(), // base64 encoded processed sketch
  mode: text("mode").notNull(), // pencil or art
  subject: text("subject"),
  context: text("context"),
  mood: text("mood").default("neutral"),
  background: text("background").default("#FFFFFF"),
  thickness: integer("thickness").default(3),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sketch relations
export const sketchesRelations = relations(sketches, ({ one, many }) => ({
  user: one(users, {
    fields: [sketches.userId],
    references: [users.id],
  }),
  feedback: many(feedback),
  annotations: many(annotations),
}));

// Feedback schema
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sketchId: integer("sketch_id").references(() => sketches.id),
  rating: integer("rating").notNull(),
  comments: json("comments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feedback relations
export const feedbackRelations = relations(feedback, ({ one }) => ({
  user: one(users, {
    fields: [feedback.userId],
    references: [users.id],
  }),
  sketch: one(sketches, {
    fields: [feedback.sketchId],
    references: [sketches.id],
  }),
}));

// Annotations schema
export const annotations = pgTable("annotations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sketchId: integer("sketch_id").references(() => sketches.id),
  data: text("data").notNull(), // JSON string of Fabric.js canvas data
  createdAt: timestamp("created_at").defaultNow(),
});

// Annotations relations
export const annotationsRelations = relations(annotations, ({ one }) => ({
  user: one(users, {
    fields: [annotations.userId],
    references: [users.id],
  }),
  sketch: one(sketches, {
    fields: [annotations.sketchId],
    references: [sketches.id],
  }),
}));

// Insert schemas for Zod validation
export const insertUserSchema = createInsertSchema(users, {
  preferences: z.object({
    defaultMode: z.string().optional(),
    favoriteSubject: z.string().optional(),
    favoriteBackgrounds: z.array(z.string()).optional(),
  }).optional(),
});

export const insertSketchSchema = createInsertSchema(sketches, {
  userId: z.number().optional(),
}).omit({ id: true, createdAt: true });

export const insertFeedbackSchema = createInsertSchema(feedback, {
  userId: z.number().optional(),
  comments: z.array(z.string()).optional(),
}).omit({ id: true, createdAt: true });

export const insertAnnotationSchema = createInsertSchema(annotations, {
  userId: z.number().optional(),
}).omit({ id: true, createdAt: true });

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Sketch = typeof sketches.$inferSelect;
export type InsertSketch = z.infer<typeof insertSketchSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type Annotation = typeof annotations.$inferSelect;
export type InsertAnnotation = z.infer<typeof insertAnnotationSchema>;
