import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PenLine, Eraser, SquareIcon, Circle, Type, Redo2, Undo2, 
  Save, Trash2, ZoomIn, ZoomOut, MousePointer, Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
// Import fabric properly
import { fabric } from 'fabric';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const AnnotationTool = ({ imageUrl, sketchId }) => {
  const [canvas, setCanvas] = useState(null);
  const [activeObj, setActiveObj] = useState(null);
  const [drawingMode, setDrawingMode] = useState('select');
  const [color, setColor] = useState('#FF5733');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const { toast } = useToast();
  
  // Available colors for annotation
  const colors = [
    '#FF5733', '#FFC300', '#36D7B7', '#3498DB', '#9B59B6', 
    '#2ECC71', '#F1C40F', '#E74C3C', '#1ABC9C', '#FFFFFF',
    '#000000', '#95A5A6'
  ];
  
  // Initialize the canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      // Initialize fabric canvas
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true,
      });
      
      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
      
      // Set canvas size based on container
      updateCanvasSize(fabricCanvas);
      
      // Load background image
      if (imageUrl) {
        fabric.Image.fromURL(imageUrl, (img) => {
          // Scale image to fit the canvas while maintaining aspect ratio
          const canvasWidth = fabricCanvas.getWidth();
          const canvasHeight = fabricCanvas.getHeight();
          
          const scale = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
          );
          
          img.scale(scale);
          img.set({
            left: (canvasWidth - img.width * scale) / 2,
            top: (canvasHeight - img.height * scale) / 2,
            selectable: false,
            evented: false,
          });
          
          fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
        });
      }
      
      // Add event listeners
      fabricCanvas.on('selection:created', handleSelectionChange);
      fabricCanvas.on('selection:updated', handleSelectionChange);
      fabricCanvas.on('selection:cleared', () => setActiveObj(null));
      
      // Handle window resize
      const handleResize = () => updateCanvasSize(fabricCanvas);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
          fabricCanvasRef.current = null;
        }
      };
    }
  }, [imageUrl]);
  
  // Update canvas size based on container
  const updateCanvasSize = (fabricCanvas) => {
    if (!canvasContainerRef.current || !fabricCanvas) return;
    
    const containerWidth = canvasContainerRef.current.clientWidth;
    const containerHeight = canvasContainerRef.current.clientHeight || 400;
    
    fabricCanvas.setDimensions({
      width: containerWidth,
      height: containerHeight,
    });
    
    // Re-position background image if needed
    if (fabricCanvas.backgroundImage) {
      const img = fabricCanvas.backgroundImage;
      const scale = Math.min(
        containerWidth / img.width,
        containerHeight / img.height
      );
      
      img.scale(scale);
      img.set({
        left: (containerWidth - img.width * scale) / 2,
        top: (containerHeight - img.height * scale) / 2,
      });
    }
    
    fabricCanvas.renderAll();
  };
  
  // Handle selection change
  const handleSelectionChange = (e) => {
    setActiveObj(e.selected[0]);
  };
  
  // Set drawing mode
  const setMode = (mode) => {
    if (!canvas) return;
    
    canvas.isDrawingMode = mode === 'draw';
    canvas.selection = mode === 'select';
    
    if (mode === 'draw') {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = brushSize;
    }
    
    setDrawingMode(mode);
  };
  
  // Change brush color
  const changeColor = (newColor) => {
    setColor(newColor);
    
    if (canvas && canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = newColor;
    }
    
    if (activeObj) {
      if (activeObj.type === 'textbox') {
        activeObj.set('fill', newColor);
      } else {
        activeObj.set('stroke', newColor);
        if (activeObj.type === 'rect' || activeObj.type === 'circle') {
          activeObj.set('fill', newColor + '20'); // Add transparency
        }
      }
      canvas.renderAll();
    }
  };
  
  // Change brush size
  const changeBrushSize = (size) => {
    setBrushSize(size);
    
    if (canvas && canvas.isDrawingMode) {
      canvas.freeDrawingBrush.width = size;
    }
    
    if (activeObj && (activeObj.type !== 'textbox' || activeObj.type !== 'i-text')) {
      activeObj.set('strokeWidth', size / 2);
      canvas.renderAll();
    }
  };
  
  // Add a rectangle
  const addRectangle = () => {
    if (!canvas) return;
    
    const rect = new fabric.Rect({
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      width: 100,
      height: 100,
      fill: color + '20', // Add transparency
      stroke: color,
      strokeWidth: brushSize / 2,
      cornerSize: 8,
      transparentCorners: false,
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    setActiveObj(rect);
    setMode('select');
  };
  
  // Add a circle
  const addCircle = () => {
    if (!canvas) return;
    
    const circle = new fabric.Circle({
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2 - 50,
      radius: 50,
      fill: color + '20', // Add transparency
      stroke: color,
      strokeWidth: brushSize / 2,
      cornerSize: 8,
      transparentCorners: false,
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    setActiveObj(circle);
    setMode('select');
  };
  
  // Add text
  const addText = () => {
    if (!canvas) return;
    
    const text = new fabric.Textbox('Type here', {
      left: canvas.getWidth() / 2 - 50,
      top: canvas.getHeight() / 2,
      fontSize: 20,
      fill: color,
      width: 150,
      fontFamily: 'Arial',
      editable: true,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    setActiveObj(text);
    setMode('select');
  };
  
  // Undo last action
  const undo = () => {
    if (!canvas) return;
    
    if (canvas._objects.length > 0) {
      const lastObject = canvas._objects.pop();
      canvas.remove(lastObject);
      canvas.renderAll();
      setActiveObj(null);
    }
  };
  
  // Clear all annotations
  const clearAll = () => {
    if (!canvas) return;
    
    canvas.clear();
    
    // Re-add background image
    if (imageUrl) {
      fabric.Image.fromURL(imageUrl, (img) => {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        
        const scale = Math.min(
          canvasWidth / img.width,
          canvasHeight / img.height
        );
        
        img.scale(scale);
        img.set({
          left: (canvasWidth - img.width * scale) / 2,
          top: (canvasHeight - img.height * scale) / 2,
          selectable: false,
          evented: false,
        });
        
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    }
    
    setActiveObj(null);
  };
  
  // Zoom in
  const zoomIn = () => {
    if (!canvas) return;
    
    if (canvasZoom < 3) {
      const newZoom = canvasZoom + 0.1;
      canvas.setZoom(newZoom);
      setCanvasZoom(newZoom);
    }
  };
  
  // Zoom out
  const zoomOut = () => {
    if (!canvas) return;
    
    if (canvasZoom > 0.5) {
      const newZoom = canvasZoom - 0.1;
      canvas.setZoom(newZoom);
      setCanvasZoom(newZoom);
    }
  };
  
  // Save annotations
  const saveAnnotations = async () => {
    if (!canvas || !sketchId) return;
    
    try {
      setIsSaving(true);
      
      // Convert canvas to JSON
      const annotationsData = JSON.stringify(canvas.toJSON(['id']));
      
      // Create a preview of the annotations
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
      });
      
      // Save to backend
      await apiRequest('POST', `/api/annotations`, {
        sketchId,
        annotationsData,
        preview: dataURL,
      });
      
      toast({
        title: "Annotations Saved",
        description: "Your annotations have been saved successfully",
      });
    } catch (error) {
      console.error('Error saving annotations:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save annotations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-lg border border-amber-700 shadow-amber-300/20 hover:shadow-amber-300/40 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 mb-6">
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-amber-300">
          <PenLine className="h-5 w-5" /> Annotation Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={drawingMode === 'select' ? 'default' : 'outline'}
            className={drawingMode === 'select' ? 'bg-amber-600 hover:bg-amber-700' : 'border-gray-700 hover:bg-gray-800 hover:text-amber-300'}
            onClick={() => setMode('select')}
            title="Select"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant={drawingMode === 'draw' ? 'default' : 'outline'}
            className={drawingMode === 'draw' ? 'bg-amber-600 hover:bg-amber-700' : 'border-gray-700 hover:bg-gray-800 hover:text-amber-300'}
            onClick={() => setMode('draw')}
            title="Draw"
          >
            <PenLine className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={addRectangle}
            title="Add Rectangle"
          >
            <SquareIcon className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={addCircle}
            title="Add Circle"
          >
            <Circle className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={addText}
            title="Add Text"
          >
            <Type className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
                title="Color"
                style={{ 
                  backgroundColor: color === '#FFFFFF' ? '#333' : color,
                  borderColor: color === '#FFFFFF' ? '#FFF' : color
                }}
              >
                <Palette className="h-4 w-4" style={{ color: color === '#FFFFFF' ? '#FFF' : '#FFF' }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-6 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`w-full aspect-square rounded-md border-2 transition-all ${
                      color === c 
                        ? 'border-amber-400 ring-2 ring-amber-400/50' 
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => changeColor(c)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
                title="Brush Size"
              >
                <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {brushSize}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Brush Size: {brushSize}px</h4>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => changeBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between">
                  <div 
                    className="w-4 h-4 rounded-full bg-current"
                    style={{ width: '4px', height: '4px' }}
                  />
                  <div 
                    className="rounded-full bg-current"
                    style={{ width: '25px', height: '25px' }}
                  />
                  <div 
                    className="rounded-full bg-current"
                    style={{ width: '40px', height: '40px' }}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={zoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={zoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-amber-300"
            onClick={undo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 hover:text-red-300"
            onClick={clearAll}
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div 
          ref={canvasContainerRef}
          className="w-full bg-white rounded-md overflow-hidden"
          style={{ height: '400px' }}
        >
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between gap-3 bg-gray-800/50 border-t border-gray-700/50">
        <Button 
          onClick={saveAnnotations}
          disabled={isSaving}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Annotations...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" /> Save Annotations
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AnnotationTool;