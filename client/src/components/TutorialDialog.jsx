import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info, Camera, Upload, Wand2, Settings, Download, Share, Eye, X, HelpCircle } from 'lucide-react';

const TutorialDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="fixed bottom-4 right-4 z-50 rounded-full p-3 bg-indigo-600 hover:bg-indigo-700 border-0 shadow-lg"
          title="How to use SketchSense"
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-gray-900 border-gray-700">
        <DialogHeader className="pb-4 border-b border-gray-700">
          <DialogTitle className="text-2xl font-bold text-indigo-300 flex items-center gap-2">
            <Info className="h-5 w-5" /> SketchSense Tutorial
          </DialogTitle>
          <DialogClose className="absolute top-4 right-4 p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        <div className="overflow-y-auto py-4 px-1 flex-grow">
          <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="w-full grid grid-cols-5 mb-6">
              <TabsTrigger value="welcome" className="data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-300">
                Welcome
              </TabsTrigger>
              <TabsTrigger value="capture" className="data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-300">
                <Camera className="h-4 w-4 mr-1" /> Capture
              </TabsTrigger>
              <TabsTrigger value="process" className="data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-300">
                <Wand2 className="h-4 w-4 mr-1" /> Process
              </TabsTrigger>
              <TabsTrigger value="result" className="data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-300">
                <Eye className="h-4 w-4 mr-1" /> Result
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-300">
                <Settings className="h-4 w-4 mr-1" /> Tips
              </TabsTrigger>
            </TabsList>
            
            {/* Welcome Tab */}
            <TabsContent value="welcome" className="space-y-6">
              <div className="text-center py-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-blue-600 inline-block mb-4">
                  Welcome to SketchSense!
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                  Transform your photos into beautiful pencil sketches using advanced AI and image processing technology.
                </p>
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'%3E%3C/path%3E%3Cpath d='M12 17h.01'%3E%3C/path%3E%3C/svg%3E" 
                  alt="SketchSense Logo" 
                  className="mx-auto mb-4 w-24 h-24"
                />
                <p className="text-gray-400">
                  This tutorial will guide you through the features and usage of SketchSense.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <div className="bg-indigo-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <Camera className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Capture Images</h3>
                  <p className="text-gray-300 text-sm">
                    Use your device's camera to capture images or upload existing photos from your device.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <div className="bg-indigo-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <Wand2 className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Transform</h3>
                  <p className="text-gray-300 text-sm">
                    Process your images using advanced algorithms with various customization options.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <div className="bg-indigo-900/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                    <Download className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Save & Share</h3>
                  <p className="text-gray-300 text-sm">
                    Download your sketches, copy them to clipboard, or share them directly with others.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Capture Tab */}
            <TabsContent value="capture" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2 mb-2">
                    <Camera className="h-5 w-5" /> Camera Capture
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-300">
                    <li>Click the <span className="bg-gray-800 px-2 py-1 rounded text-purple-300">Camera</span> tab in the input panel</li>
                    <li>Grant camera permission when prompted by your browser</li>
                    <li>Position your subject in the frame</li>
                    <li>Click the <span className="bg-gray-800 px-2 py-1 rounded text-blue-300">Capture Image</span> button</li>
                    <li>Preview your image and click <span className="bg-gray-800 px-2 py-1 rounded text-green-300">Use This Image</span> if satisfied</li>
                  </ol>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-white mb-2">Tips:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Ensure good lighting for better results</li>
                      <li>Hold the camera steady for clearer images</li>
                      <li>You can switch between front and back cameras if your device supports it</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2 mb-2">
                    <Upload className="h-5 w-5" /> Image Upload
                  </h3>
                  <ol className="list-decimal list-inside space-y-3 text-gray-300">
                    <li>Click the <span className="bg-gray-800 px-2 py-1 rounded text-indigo-300">Upload</span> tab in the input panel</li>
                    <li>Drag and drop an image onto the upload area</li>
                    <li>Or click <span className="bg-gray-800 px-2 py-1 rounded text-indigo-300">Browse Files</span> to select from your device</li>
                    <li>Select an image file (PNG, JPG, or WEBP formats supported)</li>
                    <li>Your image will automatically load when selected</li>
                  </ol>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-white mb-2">Supported:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>File formats: PNG, JPEG, WEBP</li>
                      <li>File size: Up to 50MB</li>
                      <li>Images from your device's storage or downloads</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Process Tab */}
            <TabsContent value="process" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 mb-2">Style Options</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-emerald-300 mb-2">Processing Modes</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                      <li>
                        <span className="font-medium text-white">Pure Pencil:</span> Clean, precise lines ideal for diagrams and technical drawings
                      </li>
                      <li>
                        <span className="font-medium text-white">Artistic Style:</span> Stylized sketches with shading and texture effects
                      </li>
                    </ul>
                    
                    <h4 className="font-medium text-emerald-300 mt-4 mb-2">Line Thickness (1-5)</h4>
                    <p className="text-sm text-gray-300">
                      Adjust how thick or fine the sketch lines should be. Lower values create finer lines, higher values create bolder lines.
                    </p>
                    
                    <h4 className="font-medium text-emerald-300 mt-4 mb-2">Background Color</h4>
                    <p className="text-sm text-gray-300">
                      Choose the background color for your sketch from presets like white, cream, light blue, etc.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 mb-2">Content Options</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-emerald-300 mb-2">Educational Subjects</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Select a subject to optimize the sketch for educational purposes:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>
                        <span className="font-medium text-white">Biology:</span> Enhances organ outlines and cell structures
                      </li>
                      <li>
                        <span className="font-medium text-white">Physics:</span> Emphasizes forces, vectors, and motion paths
                      </li>
                      <li>
                        <span className="font-medium text-white">Chemistry:</span> Optimizes bond lines and molecular structures
                      </li>
                      <li>
                        <span className="font-medium text-white">Math:</span> Enhances graph axes and curve representations
                      </li>
                      <li>
                        <span className="font-medium text-white">Geography:</span> Clarifies boundary lines and terrain features
                      </li>
                    </ul>
                    
                    <p className="text-xs text-gray-400 mt-3">
                      Note: For general images where no specific subject applies, select "No specific subject"
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 mb-2">Advanced Options</h3>
                  <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="font-medium text-emerald-300 mb-2">AI Enhancement Level (1-10)</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Controls how much AI processing is applied to your sketch:
                    </p>
                    <ul className="space-y-1 text-xs text-gray-300">
                      <li><span className="font-medium">Lower values</span>: Subtle enhancement, more natural look</li>
                      <li><span className="font-medium">Higher values</span>: Stronger enhancement, more dramatic effect</li>
                    </ul>
                    
                    <h4 className="font-medium text-emerald-300 mt-4 mb-2">Detail Preservation (1-10)</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Controls how much detail from the original image is maintained:
                    </p>
                    <ul className="space-y-1 text-xs text-gray-300">
                      <li><span className="font-medium">Lower values</span>: Less detail, more simplified sketch</li>
                      <li><span className="font-medium">Higher values</span>: More detail, closer to the original image</li>
                    </ul>
                    
                    <p className="text-xs text-gray-400 mt-4">
                      Note: Higher settings may increase processing time
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mt-4">
                <h4 className="font-medium text-white mb-2">Processing Your Image</h4>
                <p className="text-sm text-gray-300">
                  After configuring your options, click the <span className="bg-emerald-600/20 px-2 py-1 rounded text-emerald-300">Transform Image</span> button at the bottom of the options panel.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  The app will process your image (this may take a few moments) and display the results in the right panel.
                </p>
              </div>
            </TabsContent>
            
            {/* Result Tab */}
            <TabsContent value="result" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5" /> Viewing Results
                  </h3>
                  <p className="text-gray-300">
                    After processing, your sketch will appear in the results panel. You can:
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-gray-300">
                    <li>View your transformed image in full size</li>
                    <li>
                      <span className="font-medium text-white">Compare with original:</span> Click the eye icon (<Eye className="h-4 w-4 inline" />) in the top-right corner to toggle between showing only the sketch or a side-by-side comparison with your original image
                    </li>
                    <li>
                      <span className="font-medium text-white">Evaluate the results:</span> Check if the sketch has the desired level of detail, style, and clarity
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-white mb-2">If you're not satisfied:</h4>
                    <p className="text-sm text-gray-300">
                      Return to the processing options and try different settings. Here are some adjustments to consider:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-xs text-gray-300">
                      <li>Switch between Pure Pencil and Artistic Style modes</li>
                      <li>Adjust the line thickness or mood</li>
                      <li>Try a different background color</li>
                      <li>Increase or decrease the AI enhancement level</li>
                      <li>Change the detail preservation setting</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5" /> Saving and Sharing
                  </h3>
                  <p className="text-gray-300">
                    Once you're happy with your sketch, you have several options:
                  </p>
                  <ul className="list-decimal list-inside space-y-3 text-gray-300">
                    <li>
                      <span className="font-medium text-white">Copy to clipboard:</span> Click the copy icon to copy the image to your clipboard for easy pasting into other applications
                    </li>
                    <li>
                      <span className="font-medium text-white">Download:</span> Click the download icon to save your sketch as a PNG file to your device
                    </li>
                    <li>
                      <span className="font-medium text-white">Share (if supported):</span> On devices that support the Web Share API, click the share icon to share your sketch directly to other apps
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <h4 className="text-sm font-medium text-white mb-2">Uses for your sketches:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      <li>Educational materials and diagrams</li>
                      <li>Art projects and creative inspiration</li>
                      <li>Notes and visual documentation</li>
                      <li>Social media content</li>
                      <li>Personal archives or digital scrapbooking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Tips Tab */}
            <TabsContent value="tips" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-bold text-indigo-300 mb-4">For Best Results</h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="bg-indigo-900/20 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-indigo-400 font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Good Lighting</h4>
                        <p className="text-sm text-gray-300">
                          Ensure your subject is well-lit with even lighting and minimal harsh shadows for clearer sketches.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-indigo-900/20 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-indigo-400 font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">High Contrast</h4>
                        <p className="text-sm text-gray-300">
                          Images with good contrast between elements typically produce the best sketches with clear definition.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-indigo-900/20 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-indigo-400 font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Sharp Focus</h4>
                        <p className="text-sm text-gray-300">
                          Ensure your original image is in focus. Blurry images will result in less defined sketches.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="bg-indigo-900/20 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-indigo-400 font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Simple Backgrounds</h4>
                        <p className="text-sm text-gray-300">
                          Images with clear separation between subject and background often produce more effective sketches.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-5">
                  <div className="p-5 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-indigo-300 mb-3">Mode Selection Guide</h3>
                    <div className="space-y-3">
                      <div className="pb-3 border-b border-gray-700">
                        <h4 className="font-medium text-white">When to use Pure Pencil mode:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-1">
                          <li>Educational diagrams and technical drawings</li>
                          <li>Scientific illustrations</li>
                          <li>Architectural sketches</li>
                          <li>When you need clear, defined lines</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">When to use Artistic Style mode:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-300 mt-1 space-y-1">
                          <li>Portraits and people</li>
                          <li>Landscapes and nature scenes</li>
                          <li>Creative or artistic projects</li>
                          <li>When you want more texture and shading</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-800 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-indigo-300 mb-3">Troubleshooting</h3>
                    <div className="space-y-3 text-sm">
                      <div className="pb-2 border-b border-gray-700">
                        <p className="font-medium text-white">If sketches appear too light:</p>
                        <p className="text-gray-300">Try increasing the line thickness or using the Artistic Style mode</p>
                      </div>
                      <div className="pb-2 border-b border-gray-700">
                        <p className="font-medium text-white">If sketches appear too dark or busy:</p>
                        <p className="text-gray-300">Reduce the line thickness or lower the AI enhancement level</p>
                      </div>
                      <div>
                        <p className="font-medium text-white">If processing takes too long:</p>
                        <p className="text-gray-300">Try uploading a smaller image or reducing the enhancement and detail levels</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="pt-4 border-t border-gray-700 flex justify-between">
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800 hover:text-indigo-300"
            onClick={() => setOpen(false)}
          >
            Close Tutorial
          </Button>
          
          <DialogClose asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Start Using SketchSense
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;