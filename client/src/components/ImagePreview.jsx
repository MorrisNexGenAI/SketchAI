import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImagePreview = ({ imageData, onRemove, alt = "Preview image" }) => {
  if (!imageData) return null;

  return (
    <Card className="w-full bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300">
      <CardContent className="p-0 relative">
        <img 
          src={imageData}
          alt={alt}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
        {onRemove && (
          <Button 
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition-colors duration-300"
            size="icon"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
