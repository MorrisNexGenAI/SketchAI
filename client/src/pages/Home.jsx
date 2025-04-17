import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CameraCapture from '../components/CameraCapture';
import ImageUploader from '../components/ImageUploader';
import ProcessingControls from '../components/ProcessingControls';
import ImageResult from '../components/ImageResult';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Camera, Upload, CircleDollarSign, Users, Brain, GraduationCap } from 'lucide-react';

const Home = () => {
  const [inputImage, setInputImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [sketchId, setSketchId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Handle image capture from camera
  const handleCapture = (imageSrc) => {
    setInputImage(imageSrc);
    // Reset result when a new image is captured
    setResultImage(null);
    setSketchId(null);
  };

  // Handle image upload
  const handleUpload = (imageSrc) => {
    setInputImage(imageSrc);
    // Reset result when a new image is uploaded
    setResultImage(null);
    setSketchId(null);
  };

  // Process the image
  const processImage = async (options) => {
    if (!inputImage) {
      toast({
        title: "No image selected",
        description: "Please capture or upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log("Sending image for processing with options:", options);
      
      const response = await apiRequest('POST', '/api/process', {
        image: inputImage,
        ...options
      });
      
      if (!response || !response.sketch) {
        throw new Error("No sketch returned from the server");
      }
      
      console.log("Received processed image, length:", response.sketch.length);
      
      // Add a small delay to ensure state updates properly
      setTimeout(() => {
        setResultImage(response.sketch);
        setSketchId(response.id);
      }, 100);
      
      toast({
        title: "Processing complete",
        description: "Your image has been transformed successfully",
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: error.message || "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 mb-2">
          SketchSense
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Transform your photos into beautiful pencil sketches with advanced AI processing
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <Tabs defaultValue="camera" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="camera" className="data-[state=active]:text-purple-300 data-[state=active]:bg-gray-800">
                <Camera className="h-4 w-4 mr-2" /> Camera
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:text-indigo-300 data-[state=active]:bg-gray-800">
                <Upload className="h-4 w-4 mr-2" /> Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="camera" className="mt-0">
              <CameraCapture onCapture={handleCapture} />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-0">
              <ImageUploader onUpload={handleUpload} />
            </TabsContent>
          </Tabs>
          
          <ProcessingControls onProcess={processImage} isProcessing={isProcessing} />
        </div>
        
        <div>
          <ImageResult 
            originalImage={inputImage} 
            sketchImage={resultImage} 
            sketchId={sketchId}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
        <div className="bg-gray-800 rounded-lg p-5 border border-purple-800/30 shadow-lg hover:shadow-purple-800/10 transition-shadow">
          <div className="mb-3 bg-purple-900/20 w-12 h-12 flex items-center justify-center rounded-full">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Transformation</h3>
          <p className="text-gray-300 text-sm">
            Our advanced algorithms use OpenCV and HuggingFace AI to turn your photos into stunning pencil sketches with precision and detail.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-5 border border-indigo-800/30 shadow-lg hover:shadow-indigo-800/10 transition-shadow">
          <div className="mb-3 bg-indigo-900/20 w-12 h-12 flex items-center justify-center rounded-full">
            <GraduationCap className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Educational Focus</h3>
          <p className="text-gray-300 text-sm">
            Optimized for educational diagrams and illustrations, helping students and teachers create clear, precise sketches for better learning.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-5 border border-blue-800/30 shadow-lg hover:shadow-blue-800/10 transition-shadow">
          <div className="mb-3 bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-full">
            <Camera className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Enhanced Camera Controls</h3>
          <p className="text-gray-300 text-sm">
            Take advantage of our advanced camera controls with zoom, brightness adjustment, and multiple camera selection for the perfect capture.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;