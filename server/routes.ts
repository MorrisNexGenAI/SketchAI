import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { insertSketchSchema, insertFeedbackSchema, insertAnnotationSchema } from "@shared/schema";

const execAsync = promisify(exec);

// Temporary directory for image processing
const tempDir = path.join(import.meta.dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Process image
  app.post('/api/process', async (req, res) => {
    try {
      // Validate request body
      const schema = z.object({
        image: z.string().startsWith("data:image/"),
        mode: z.enum(["pencil", "art"]),
        subject: z.string().optional(),
        context: z.string().optional(),
        mood: z.string().optional(),
        background: z.string().optional(),
        thickness: z.number().min(1).max(5).optional()
      });

      const data = schema.parse(req.body);
      
      // Save base64 image to temp file
      const matches = data.image.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ message: "Invalid image format" });
      }
      
      const imageBuffer = Buffer.from(matches[2], 'base64');
      const imageType = matches[1];
      const imageExt = imageType === 'jpeg' ? 'jpg' : imageType;
      
      const inputFilename = `input_${Date.now()}.${imageExt}`;
      const outputFilename = `output_${Date.now()}.${imageExt}`;
      
      const inputPath = path.join(tempDir, inputFilename);
      const outputPath = path.join(tempDir, outputFilename);
      
      fs.writeFileSync(inputPath, imageBuffer);
      
      // Process image with Python and OpenCV
      const cmd = `python ${path.join(import.meta.dirname, "process_image.py")} ${inputPath} ${outputPath} ${data.mode} ${data.thickness || 3} ${data.mood || 'neutral'}`;
      
      console.log('Executing command:', cmd);
      try {
        const { stdout, stderr } = await execAsync(cmd);
        if (stdout) console.log('Python process output:', stdout);
        if (stderr) console.error('Python process error:', stderr);
      } catch (execError) {
        console.error('Error executing Python script:', execError);
        throw new Error(`Failed to process image: ${(execError as Error).message}`);
      }
      
      // Verify the output file exists
      if (!fs.existsSync(outputPath)) {
        throw new Error('Processing failed: Output file not created');
      }
      
      // Read processed image
      const processedImage = fs.readFileSync(outputPath);
      const processedBase64 = `data:image/${imageType};base64,${processedImage.toString('base64')}`;
      
      // Save to database
      const sketch = await storage.createSketch({
        image: data.image,
        sketch: processedBase64,
        mode: data.mode,
        subject: data.subject || null,
        context: data.context || null,
        mood: data.mood || 'neutral',
        background: data.background || '#FFFFFF',
        thickness: data.thickness || 3
      });
      
      try {
        // Clean up temp files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
        // Continue even if cleanup fails
      }
      
      console.log("Sending processed image back to client, length:", processedBase64.length);
      res.json({ 
        id: sketch.id,
        sketch: processedBase64
      });
    } catch (error) {
      console.error('Processing error:', error);
      res.status(500).json({ message: `Image processing failed: ${(error as Error).message}` });
    }
  });
  
  // Save feedback
  app.post('/api/feedback', async (req, res) => {
    try {
      const data = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(data);
      res.json(feedback);
    } catch (error) {
      console.error('Feedback error:', error);
      res.status(400).json({ message: `Invalid feedback data: ${(error as Error).message}` });
    }
  });
  
  // Save annotations
  app.post('/api/annotations', async (req, res) => {
    try {
      const data = insertAnnotationSchema.parse(req.body);
      const annotation = await storage.createAnnotation(data);
      res.json(annotation);
    } catch (error) {
      console.error('Annotation error:', error);
      res.status(400).json({ message: `Invalid annotation data: ${(error as Error).message}` });
    }
  });
  
  // Get user profile
  app.get('/api/profile', async (req, res) => {
    try {
      // This would typically use authentication, but for demo purposes
      // we'll return the first user or a default profile
      const user = await storage.getFirstUser();
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user's sketches
      const sketches = await storage.getSketchesByUserId(user.id);
      
      res.json({
        ...user,
        sketches: sketches.slice(0, 4) // Return only the most recent sketches
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: `Error fetching profile: ${(error as Error).message}` });
    }
  });
  
  // Get sketch by ID
  app.get('/api/sketches/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid sketch ID" });
      }
      
      const sketch = await storage.getSketch(id);
      
      if (!sketch) {
        return res.status(404).json({ message: "Sketch not found" });
      }
      
      res.json(sketch);
    } catch (error) {
      console.error('Sketch error:', error);
      res.status(500).json({ message: `Error fetching sketch: ${(error as Error).message}` });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
