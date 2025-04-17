import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Camera, RotateCcw, CameraOff, Expand, ZoomIn, SunMedium, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureTaken, setIsPictureTaken] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(null);
  
  const webcamRef = useRef(null);
  const cameraContainerRef = useRef(null);
  const { toast } = useToast();
  
  // Get list of available cameras
  const handleDevices = useCallback(mediaDevices => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
    setDevices(videoDevices);
    
    // Select the first device by default if available
    if (videoDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  }, [selectedDeviceId]);
  
  // Check camera permissions and get available devices
  useEffect(() => {
    async function checkCameraPermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setIsCameraPermissionGranted(true);
        
        // Stop the stream immediately after permission check
        stream.getTracks().forEach(track => track.stop());
        
        // Get available devices
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        handleDevices(mediaDevices);
      } catch (err) {
        console.error('Camera error:', err);
        setIsCameraPermissionGranted(false);
        setIsCameraActive(false);
        toast({
          title: "Camera Access Denied",
          description: "Please enable camera access in your browser settings to use this feature.",
          variant: "destructive",
        });
      }
    }
    
    checkCameraPermission();
    
    // Listen for device changes (e.g., plugging in a new webcam)
    navigator.mediaDevices.addEventListener('devicechange', async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      handleDevices(devices);
    });
    
    // Clean up event listener
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDevices);
    };
  }, [handleDevices, toast]);
  
  // Toggle camera on/off
  const toggleCamera = () => {
    if (!isCameraPermissionGranted) {
      // Attempt to request permission again
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Stop the stream immediately
          stream.getTracks().forEach(track => track.stop());
          setIsCameraPermissionGranted(true);
          setIsCameraActive(true);
          setIsPictureTaken(false);
          setCapturedImage(null);
        })
        .catch((err) => {
          console.error('Camera error:', err);
          toast({
            title: "Camera Access Denied",
            description: "Please enable camera access in your browser settings.",
            variant: "destructive",
          });
        });
      return;
    }
    
    setIsCameraActive(prev => !prev);
    if (isPictureTaken) {
      setIsPictureTaken(false);
      setCapturedImage(null);
    }
  };
  
  // Take a picture
  const capture = () => {
    if (!webcamRef.current) return;
    
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (!imageSrc) {
        toast({
          title: "Capture Failed",
          description: "Unable to capture image from camera. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      setCapturedImage(imageSrc);
      setIsPictureTaken(true);
      onCapture(imageSrc);
      
      toast({
        title: "Image Captured",
        description: "Your image is ready for processing.",
      });
    } catch (err) {
      console.error('Capture error:', err);
      toast({
        title: "Capture Error",
        description: "An error occurred while capturing the image.",
        variant: "destructive",
      });
    }
  };
  
  // Retake the picture
  const retake = () => {
    setIsPictureTaken(false);
    setCapturedImage(null);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!cameraContainerRef.current) return;
    
    if (!isFullscreen) {
      if (cameraContainerRef.current.requestFullscreen) {
        cameraContainerRef.current.requestFullscreen();
      } else if (cameraContainerRef.current.mozRequestFullScreen) {
        cameraContainerRef.current.mozRequestFullScreen();
      } else if (cameraContainerRef.current.webkitRequestFullscreen) {
        cameraContainerRef.current.webkitRequestFullscreen();
      } else if (cameraContainerRef.current.msRequestFullscreen) {
        cameraContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  // Update fullscreen state based on fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.mozFullScreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Video constraints
  const videoConstraints = {
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
    facingMode: "environment",
    width: 1280,
    height: 720,
  };
  
  return (
    <Card 
      className="overflow-hidden shadow-lg border border-purple-700 shadow-purple-300/20 hover:shadow-purple-300/40 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-purple-300">
          <Camera className="h-5 w-5" /> Camera Capture
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4" ref={cameraContainerRef}>
        <div className="relative rounded-lg overflow-hidden bg-black">
          {isCameraPermissionGranted === false ? (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-800 text-gray-300">
              <CameraOff className="h-12 w-12 mb-2 text-red-400 opacity-50" />
              <p className="text-center mb-4">
                Camera access denied or not available
              </p>
              <Button 
                onClick={toggleCamera}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Request Access
              </Button>
            </div>
          ) : isCameraActive && !isPictureTaken ? (
            <div 
              style={{ 
                filter: `brightness(${brightness}%)`,
                transform: `scale(${zoom / 100})`, 
                transition: 'transform 0.3s ease, filter 0.3s ease'
              }}
              className="w-full relative bg-black overflow-hidden flex justify-center"
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full"
                style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                mirrored={false}
                onUserMediaError={(err) => {
                  console.error('Webcam error:', err);
                  toast({
                    title: "Camera Error",
                    description: "There was an error accessing your camera.",
                    variant: "destructive",
                  });
                  setIsCameraActive(false);
                }}
              />
            </div>
          ) : isPictureTaken ? (
            <div className="w-full relative">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full"
                style={{ aspectRatio: '4/3', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-800 text-gray-300">
              <CameraOff className="h-12 w-12 mb-2 text-purple-400 opacity-50" />
              <p className="text-center mb-4">
                Camera is currently turned off
              </p>
              <Button 
                onClick={toggleCamera}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Turn On Camera
              </Button>
            </div>
          )}
          
          {/* Camera Controls Overlay */}
          {isCameraActive && !isPictureTaken && (
            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 h-8 w-8 p-0 rounded-full"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                <Expand className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {/* Camera Settings */}
        {isCameraActive && !isPictureTaken && (
          <div className="mt-4 space-y-4">
            {devices.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Camera Source
                </label>
                <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label || `Camera ${devices.indexOf(device) + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <SunMedium className="h-4 w-4 mr-1" /> Brightness: {brightness}%
              </label>
              <Slider
                min={50}
                max={150}
                step={5}
                value={[brightness]}
                onValueChange={([value]) => setBrightness(value)}
                className="py-1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                <ZoomIn className="h-4 w-4 mr-1" /> Zoom: {zoom}%
              </label>
              <Slider
                min={100}
                max={200}
                step={5}
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                className="py-1"
              />
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between gap-3 bg-gray-800/50 border-t border-gray-700/50">
        {isCameraActive && !isPictureTaken ? (
          <>
            <Button 
              onClick={toggleCamera}
              variant="outline"
              className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-red-300"
            >
              <CameraOff className="h-4 w-4 mr-2" /> Turn Off
            </Button>
            <Button 
              onClick={capture}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" /> Capture
            </Button>
          </>
        ) : isPictureTaken ? (
          <>
            <Button 
              onClick={retake}
              variant="outline"
              className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-purple-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Retake
            </Button>
            <Button 
              onClick={() => {
                // Re-send the captured image to parent if needed
                onCapture(capturedImage);
                toast({
                  title: "Image Selected",
                  description: "Your captured image is ready for processing.",
                });
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Image className="h-4 w-4 mr-2" /> Use Image
            </Button>
          </>
        ) : (
          <Button 
            onClick={toggleCamera}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Camera className="h-4 w-4 mr-2" /> Turn On Camera
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CameraCapture;