import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BACKGROUND_COLORS } from '../constants';

const BackgroundSelector = ({ selectedBackground, lineThickness, onBackgroundChange, onLineThicknessChange, mode }) => {
  return (
    <Card className="border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300 bg-gray-800 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#60A5FA]">Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-300 mb-2">Background Color</Label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {BACKGROUND_COLORS.map((bg) => (
              <button
                key={bg.value}
                onClick={() => onBackgroundChange(bg.value)}
                className={`w-full h-8 rounded-md transition-all duration-300 ${
                  selectedBackground === bg.value ? 'border-2 border-white' : 'border-2 border-transparent hover:border-white'
                }`}
                style={{ backgroundColor: bg.value }}
                aria-label={`Select ${bg.name} background`}
              />
            ))}
          </div>
        </div>
        
        {/* Line thickness (for Pure Pencil mode only) */}
        {mode === 'pencil' && (
          <div>
            <Label className="block text-sm font-medium text-gray-300 mb-2">Line Thickness</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[lineThickness]}
              onValueChange={(value) => onLineThicknessChange(value[0])}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Thin</span>
              <span>Medium</span>
              <span>Thick</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BackgroundSelector;
