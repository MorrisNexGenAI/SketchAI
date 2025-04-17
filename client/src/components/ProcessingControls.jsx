import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Wand2, Pencil, Palette, Sparkles, Layers, Droplet } from 'lucide-react';
import { SUBJECTS, MOODS } from '../constants';

const ProcessingControls = ({ onProcess, isProcessing }) => {
  // Processing parameters
  const [mode, setMode] = useState('pencil');
  const [thickness, setThickness] = useState(3);
  const [subject, setSubject] = useState('none');
  const [mood, setMood] = useState('neutral');
  const [background, setBackground] = useState('#FFFFFF');
  const [enhancementLevel, setEnhancementLevel] = useState(5);
  const [detailLevel, setDetailLevel] = useState(5);
  
  // Background color options
  const backgroundColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Light Gray', value: '#F3F4F6' },
    { name: 'Cream', value: '#FFF8E1' },
    { name: 'Light Blue', value: '#E6F0FA' },
    { name: 'Light Green', value: '#E8F5E9' },
    { name: 'Black', value: '#121212' },
  ];
  
  // Handle processing
  const handleProcess = () => {
    onProcess({
      mode,
      thickness,
      subject,
      mood,
      background,
      enhancementLevel,
      detailLevel
    });
  };
  
  return (
    <Card className="overflow-hidden shadow-lg border border-emerald-700 shadow-emerald-300/20 hover:shadow-emerald-300/40 transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800">
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-emerald-300">
          <Wand2 className="h-5 w-5" /> Processing Options
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="style" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-300">
              <Pencil className="h-4 w-4 mr-2" /> Style
            </TabsTrigger>
            <TabsTrigger value="educational" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-300">
              <Layers className="h-4 w-4 mr-2" /> Content
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-emerald-600/20 data-[state=active]:text-emerald-300">
              <Sparkles className="h-4 w-4 mr-2" /> Advanced
            </TabsTrigger>
          </TabsList>
          
          {/* Style Tab */}
          <TabsContent value="style" className="mt-0">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Processing Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={mode === 'pencil' ? 'default' : 'outline'}
                    className={mode === 'pencil' ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:bg-gray-800 hover:text-emerald-300 border-gray-700'}
                    onClick={() => setMode('pencil')}
                  >
                    <Pencil className="h-4 w-4 mr-2" /> 
                    Pure Pencil
                  </Button>
                  <Button
                    type="button"
                    variant={mode === 'art' ? 'default' : 'outline'}
                    className={mode === 'art' ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:bg-gray-800 hover:text-emerald-300 border-gray-700'}
                    onClick={() => setMode('art')}
                  >
                    <Palette className="h-4 w-4 mr-2" /> 
                    Artistic Style
                  </Button>
                </div>
              </div>
              
              {mode === 'pencil' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Line Thickness: {thickness}
                  </label>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[thickness]}
                    onValueChange={([value]) => setThickness(value)}
                    className="py-1"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Fine</span>
                    <span>Medium</span>
                    <span>Bold</span>
                  </div>
                </div>
              )}
              
              {mode === 'art' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Artistic Mood
                  </label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((m) => (
                        <SelectItem key={m.toLowerCase()} value={m.toLowerCase()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <Droplet className="h-4 w-4 inline mr-1" /> Background Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {backgroundColors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-full aspect-square rounded-md border-2 transition-all ${
                        background === color.value 
                          ? 'border-emerald-400 ring-2 ring-emerald-400/50' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setBackground(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Educational Tab */}
          <TabsContent value="educational" className="mt-0">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Educational Subject
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific subject</SelectItem>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s.toLowerCase()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  Selecting a subject helps optimize the sketch for educational purposes
                </p>
              </div>
              
              {subject && subject !== 'none' && (
                <div className="p-3 rounded-md bg-gray-800 border border-gray-700">
                  <h4 className="text-sm font-medium text-emerald-300 mb-1">
                    Subject-specific tips:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                    {subject.toLowerCase() === 'biology' && (
                      <>
                        <li>Organ outlines will be enhanced for clarity</li>
                        <li>Cell structures will be clearly delineated</li>
                      </>
                    )}
                    {subject.toLowerCase() === 'physics' && (
                      <>
                        <li>Forces and vectors will be emphasized</li>
                        <li>Motion paths will be clearly represented</li>
                      </>
                    )}
                    {subject.toLowerCase() === 'chemistry' && (
                      <>
                        <li>Bond lines and molecular structures optimized</li>
                        <li>Clearer atom representations</li>
                      </>
                    )}
                    {subject.toLowerCase() === 'math' && (
                      <>
                        <li>Graph axes will be emphasized</li>
                        <li>Curve and function representations enhanced</li>
                      </>
                    )}
                    {subject.toLowerCase() === 'geography' && (
                      <>
                        <li>Boundary lines and terrain features will be clearly defined</li>
                        <li>Topographic elements highlighted</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="mt-0">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  <Sparkles className="h-4 w-4 inline mr-1" /> AI Enhancement Level: {enhancementLevel}
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[enhancementLevel]}
                  onValueChange={([value]) => setEnhancementLevel(value)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Subtle</span>
                  <span>Balanced</span>
                  <span>Strong</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Detail Preservation: {detailLevel}
                </label>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[detailLevel]}
                  onValueChange={([value]) => setDetailLevel(value)}
                  className="py-1"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Less detail</span>
                  <span>Balanced</span>
                  <span>More detail</span>
                </div>
              </div>
              
              <div className="p-3 rounded-md bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-emerald-300 mb-1">
                  Advanced processing notes:
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                  <li>Higher AI enhancement uses more HuggingFace processing</li>
                  <li>Higher detail preservation maintains more of the original image structure</li>
                  <li>Processing time increases with higher settings</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-800/50 border-t border-gray-700/50">
        <Button 
          onClick={handleProcess}
          disabled={isProcessing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Image...
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 mr-2" /> Transform Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProcessingControls;