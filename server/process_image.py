#!/usr/bin/env python3
import os
from dotenv import load_dotenv

load_dotenv()  # Loads from the .env file


import sys
import cv2
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import base64
import json
import requests
from io import BytesIO

# Access HuggingFace API key from environment variables
HUGGINGFACE_API_KEY = os.environ.get("HUGGINGFACE_API_KEY")

def process_image_pure_pencil(image_path, output_path, thickness=3):
    """
    Process an image using Pure Pencil mode - clean, diagram-focused for educational purposes.
    
    Parameters:
    - image_path: Path to the input image
    - output_path: Path to save the processed image
    - thickness: Line thickness (1-5)
    """
    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image at {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Invert the grayscale image
    inverted = 255 - gray
    
    # Apply Gaussian blur
    blur_amount = 7 + (thickness * 2)
    blurred = cv2.GaussianBlur(inverted, (blur_amount, blur_amount), 0)
    
    # Invert the blurred image
    inverted_blurred = 255 - blurred
    
    # Create the pencil sketch effect
    sketch = cv2.divide(gray, inverted_blurred, scale=256.0)
    
    # Enhance contrast and apply sharpening based on thickness
    if thickness > 3:
        # Apply contrast enhancement
        alpha = 1.0 + (thickness - 3) * 0.2  # 1.0 to 1.4
        sketch = cv2.convertScaleAbs(sketch, alpha=alpha, beta=0)
        
        # Apply sharpening kernel
        kernel = np.array([[-1, -1, -1],
                          [-1, 9 + (thickness - 3), -1],
                          [-1, -1, -1]])
        sketch = cv2.filter2D(sketch, -1, kernel)
    
    # Save the output
    cv2.imwrite(output_path, sketch)
    return output_path

def process_image_artistic_pencil(image_path, output_path, mood="neutral"):
    """
    Process an image using Artistic Pencil mode - stylized art with shading.
    
    Parameters:
    - image_path: Path to the input image
    - output_path: Path to save the processed image
    - mood: Emotional mood to adjust parameters
    """
    # Open image with PIL
    img = Image.open(image_path).convert("L")  # Convert to grayscale
    
    # Apply different filters based on mood
    contrast_factor = 1.5
    brightness_factor = 1.0
    detail_factor = 1.0
    
    if mood.lower() == "excited":
        contrast_factor = 1.8
        brightness_factor = 1.2
        detail_factor = 1.3
    elif mood.lower() == "curious":
        contrast_factor = 1.6
        brightness_factor = 1.1
        detail_factor = 1.5
    elif mood.lower() == "stressed":
        contrast_factor = 2.0
        brightness_factor = 0.8
        detail_factor = 1.4
    elif mood.lower() == "frustrated":
        contrast_factor = 2.1
        brightness_factor = 0.7
        detail_factor = 1.2
    
    # Apply contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(contrast_factor)
    
    # Apply brightness
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness_factor)
    
    # Apply details enhancement
    if detail_factor > 1.0:
        img = img.filter(ImageFilter.DETAIL)
        if detail_factor > 1.3:
            img = img.filter(ImageFilter.EDGE_ENHANCE)
    
    # Apply artistic effect with dodge blend
    img_inverted = ImageOps.invert(img)
    img_blurred = img_inverted.filter(ImageFilter.GaussianBlur(radius=10))
    
    def dodge(a, b, alpha=1.0):
        # Dodge blend function - lightens based on inverted second image
        a = np.asarray(a).astype('float')
        b = np.asarray(b).astype('float')
        
        # Avoid division by zero by adding a small epsilon and clipping
        denominator = 255.0 - b * alpha
        # Prevent division by zero by setting small values to a minimum value
        denominator = np.maximum(denominator, 0.1)  # Increased minimum to avoid NaN values
        
        # Calculate output with safe division
        out = a / denominator * 255.0
        
        # Handle any possible NaN or infinite values
        out = np.nan_to_num(out, nan=0.0, posinf=255.0, neginf=0.0)
        
        # Final clipping to ensure valid image values
        out = np.clip(out, 0, 255).astype('uint8')
        
        return Image.fromarray(out)
    
    result = dodge(img, img_blurred, alpha=1.0)
    result.save(output_path)
    return output_path

def apply_ai_enhancement(image_path, output_path, mode="pencil"):
    """
    Apply AI enhancement using HuggingFace models
    
    Parameters:
    - image_path: Path to the input image
    - output_path: Path to save the processed image
    - mode: Processing mode ('pencil' or 'art')
    """
    if not HUGGINGFACE_API_KEY:
        print("HUGGINGFACE_API_KEY not found, skipping AI enhancement")
        return False
    
    try:
        # For now, we'll skip HuggingFace processing due to potential issues
        # and just use our local processing methods
        print("Skipping HuggingFace API call for now to ensure reliability")
        return False
        
        # Note: The below code is kept but bypassed for reliability
        # Select appropriate model based on mode
        if mode == "pencil":
            # Using a sketch generation model
            model_url = "https://api-inference.huggingface.co/models/Gustavosta/MagicPrompt-Stable-Diffusion"
            prompt = "Convert this image to a detailed pencil sketch with clear lines"
        else:  # art mode
            # Using an artistic stylization model
            model_url = "https://api-inference.huggingface.co/models/Gustavosta/MagicPrompt-Stable-Diffusion"
            prompt = "Transform this image into an artistic pencil drawing with shading and texture"
        
        # Load image
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        
        # Send request to HuggingFace API
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        response = requests.post(
            model_url,
            headers=headers,
            json={
                "inputs": {
                    "image": base64.b64encode(image_bytes).decode("utf-8"),
                    "prompt": prompt
                }
            }
        )
        
        if response.status_code == 200:
            # Save the response as image
            img = Image.open(BytesIO(response.content))
            img.save(output_path)
            return True
        else:
            print(f"Error from HuggingFace API: {response.status_code}, {response.text}")
            return False
            
    except Exception as e:
        print(f"Error in AI enhancement: {str(e)}")
        return False

def main():
    """
    Command-line interface for image processing
    
    Usage:
      python process_image.py <input_path> <output_path> <mode> [thickness] [mood]
    
    Arguments:
      input_path: Path to the input image
      output_path: Path to save the processed image
      mode: Processing mode ('pencil' or 'art')
      thickness: Line thickness for pencil mode (1-5, default=3)
      mood: Emotional mood for art mode (e.g., 'neutral', 'excited', default='neutral')
    """
    if len(sys.argv) < 4:
        print("Usage: python process_image.py <input_path> <output_path> <mode> [thickness] [mood]")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    mode = sys.argv[3].lower()
    
    # Try AI enhancement first
    ai_success = apply_ai_enhancement(input_path, output_path, mode)
    
    # If AI enhancement failed or is not available, use traditional methods
    if not ai_success:
        if mode == "pencil":
            thickness = int(sys.argv[4]) if len(sys.argv) > 4 else 3
            process_image_pure_pencil(input_path, output_path, thickness)
        elif mode == "art":
            mood = sys.argv[5] if len(sys.argv) > 5 else "neutral"
            process_image_artistic_pencil(input_path, output_path, mood)
        else:
            print(f"Unknown mode: {mode}")
            sys.exit(1)
    
    print(f"Processed image saved to {output_path}")

if __name__ == "__main__":
    main()