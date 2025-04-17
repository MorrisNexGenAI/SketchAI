import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share, Copy, Check, Image as ImageIcon, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';

const ImageResult = ({ originalImage, sketchImage, sketchId }) => {
  const [comparing, setComparing] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultRef = useRef(null);
  const imageRef = useRef(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Reset comparing state when sketch changes
    setComparing(false);
  }, [sketchImage]);
  
  // Toggle before/after comparison
  const toggleComparing = () => {
    setComparing(prev => !prev);
  };
  
  // Copy image to clipboard
  const copyToClipboard = async () => {
    if (!sketchImage) return;
    
    try {
      setIsCopying(true);
      
      // Create a temporary canvas to capture just the image
      const canvas = await html2canvas(imageRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      canvas.toBlob(async (blob) => {
        try {
          // Use Clipboard API to copy the image
          const data = [new ClipboardItem({ 'image/png': blob })];
          await navigator.clipboard.write(data);
          
          toast({
            title: "Copied to clipboard",
            description: "Image copied successfully",
          });
        } catch (err) {
          console.error('Clipboard API error:', err);
          // Fallback: provide direct download if clipboard fails
          toast({
            title: "Clipboard access denied",
            description: "Try downloading the image instead",
            variant: "destructive",
          });
        } finally {
          setIsCopying(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Copy error:', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy image to clipboard",
        variant: "destructive",
      });
      setIsCopying(false);
    }
  };
  
  // Download image
  const downloadImage = async () => {
    if (!sketchImage) return;
    
    try {
      setIsDownloading(true);
      
      // Create canvas with the image
      const canvas = await html2canvas(imageRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `sketchsense-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Download started",
        description: "Your image is being downloaded",
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: "Download failed",
        description: "Could not download the image",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Share image (if Web Share API is available)
  const shareImage = async () => {
    if (!sketchImage || !navigator.share) return;
    
    try {
      const canvas = await html2canvas(imageRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        // Create file from blob
        const file = new File([blob], "sketchsense-image.png", { type: "image/png" });
        
        try {
          await navigator.share({
            title: 'SketchSense Image',
            text: 'Check out this sketch created with SketchSense!',
            files: [file]
          });
          
          toast({
            title: "Shared successfully",
            description: "Your image has been shared",
          });
        } catch (error) {
          console.error('Error sharing:', error);
          if (error.name !== 'AbortError') {
            toast({
              title: "Sharing failed",
              description: "Could not share the image",
              variant: "destructive",
            });
          }
        }
      }, 'image/png');
    } catch (err) {
      console.error('Share preparation error:', err);
      toast({
        title: "Sharing error",
        description: "Could not prepare the image for sharing",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card 
      ref={resultRef}
      className="overflow-hidden shadow-lg border border-blue-700 shadow-blue-300/20 hover:shadow-blue-300/40 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-300">
          <Sparkles className="h-5 w-5" /> Transformed Image
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 relative">
        {sketchImage ? (
          <div className="relative rounded-lg overflow-hidden bg-white shadow-md">
            <div 
              ref={imageRef}
              className="w-full relative"
              style={{ aspectRatio: '4/3' }}
            >
              {comparing ? (
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full overflow-hidden border-r border-gray-300">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs py-1 px-2 rounded">
                      Original
                    </div>
                  </div>
                  <div className="w-1/2 h-full overflow-hidden">
                    <img 
                      src={sketchImage} 
                      alt="Transformed" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs py-1 px-2 rounded">
                      Transformed
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={sketchImage} 
                  alt="Transformed Image" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error("Image failed to load", e);
                    e.target.onerror = null; 
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='red' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E";
                  }}
                />
              )}
            </div>
            
            <div className="absolute top-3 right-3 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full"
                onClick={toggleComparing}
                title={comparing ? "Show result only" : "Compare with original"}
              >
                {comparing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-64 rounded-lg flex flex-col items-center justify-center bg-gray-800 text-gray-300 border border-gray-700">
            <ImageIcon className="h-12 w-12 mb-2 text-blue-400 opacity-50" />
            <p className="text-center">
              Processed image will appear here
            </p>
          </div>
        )}
      </CardContent>
      
      {sketchImage && (
        <CardFooter className="flex flex-col gap-3 bg-gray-800/50 border-t border-gray-700/50">
          <div className="w-full flex gap-2 justify-between">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 hover:text-blue-300 px-3"
              onClick={copyToClipboard}
              disabled={isCopying}
            >
              {isCopying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 hover:text-blue-300 px-3"
              onClick={downloadImage}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {navigator.share && (
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 hover:text-blue-300 px-3"
                onClick={shareImage}
              >
                <Share className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ImageResult;