import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Image } from 'lucide-react';
import { MODES } from '../constants';

const ModeSelector = ({ mode, onChange }) => {
  return (
    <Card className="border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300 bg-gray-800 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#60A5FA]">Sketch Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          {/* Pure Pencil Option */}
          <div className="flex-1">
            <input 
              type="radio" 
              id="pure-pencil" 
              name="sketch-mode" 
              className="sr-only custom-radio" 
              checked={mode === MODES.PENCIL}
              onChange={() => onChange(MODES.PENCIL)}
            />
            <label 
              htmlFor="pure-pencil" 
              className={`block cursor-pointer border ${
                mode === MODES.PENCIL 
                  ? 'border-[#60A5FA] bg-[#60A5FA] bg-opacity-20 shadow-[0_0_8px_#60A5FA]' 
                  : 'border-gray-600'
              } rounded-lg p-4 text-center transition-all duration-300 hover:bg-[#60A5FA] hover:bg-opacity-10`}
            >
              <div className="flex justify-center mb-2">
                <Pencil className="h-8 w-8 text-[#60A5FA]" />
              </div>
              <h4 className="font-medium">Pure Pencil</h4>
              <p className="text-xs text-gray-400 mt-1">Clean, diagram-focused sketches</p>
            </label>
          </div>
          
          {/* Artistic Pencil Option */}
          <div className="flex-1">
            <input 
              type="radio" 
              id="artistic-pencil" 
              name="sketch-mode" 
              className="sr-only custom-radio" 
              checked={mode === MODES.ART}
              onChange={() => onChange(MODES.ART)}
            />
            <label 
              htmlFor="artistic-pencil" 
              className={`block cursor-pointer border ${
                mode === MODES.ART 
                  ? 'border-[#60A5FA] bg-[#60A5FA] bg-opacity-20 shadow-[0_0_8px_#60A5FA]' 
                  : 'border-gray-600'
              } rounded-lg p-4 text-center transition-all duration-300 hover:bg-[#60A5FA] hover:bg-opacity-10`}
            >
              <div className="flex justify-center mb-2">
                <Image className="h-8 w-8 text-[#60A5FA]" />
              </div>
              <h4 className="font-medium">Artistic Pencil</h4>
              <p className="text-xs text-gray-400 mt-1">Beautiful, stylized pencil art</p>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeSelector;
