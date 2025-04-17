import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const DownloadButtons = ({ sketchRef, mode }) => {
  const downloadImage = async (format) => {
    if (!sketchRef.current) return;
    
    try {
      const canvas = await html2canvas(sketchRef.current);
      
      // For SVG we would need the actual vector data from the backend
      // This is just a placeholder that would download a PNG
      if (format === 'svg' && mode !== 'pencil') {
        format = 'png';
      }
      
      let url;
      let filename;
      
      switch (format) {
        case 'png':
          url = canvas.toDataURL('image/png');
          filename = 'sketchsense-sketch.png';
          break;
        case 'jpg':
          url = canvas.toDataURL('image/jpeg', 0.9);
          filename = 'sketchsense-sketch.jpg';
          break;
        case 'svg':
          // In a real implementation, we would get SVG data from the backend
          // For Pure Pencil mode
          url = canvas.toDataURL('image/png'); // Fallback to PNG
          filename = 'sketchsense-sketch.svg';
          break;
        default:
          url = canvas.toDataURL('image/png');
          filename = 'sketchsense-sketch.png';
      }
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={() => downloadImage('png')}
        className="px-4 py-2 bg-[#34D399] bg-opacity-20 text-[#34D399] rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center border border-[#34D399] shadow-[0_0_5px_#34D399] hover:shadow-[0_0_10px_#34D399,0_0_15px_#34D399]"
      >
        <Download className="h-5 w-5 mr-2" />
        Download PNG
      </Button>
      
      <Button 
        onClick={() => downloadImage('jpg')}
        className="px-4 py-2 bg-[#34D399] bg-opacity-20 text-[#34D399] rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center border border-[#34D399] shadow-[0_0_5px_#34D399] hover:shadow-[0_0_10px_#34D399,0_0_15px_#34D399]"
      >
        <Download className="h-5 w-5 mr-2" />
        Download JPG
      </Button>
      
      {/* SVG download button is only fully functional in Pure Pencil mode */}
      <Button 
        onClick={() => downloadImage('svg')}
        className="px-4 py-2 bg-[#34D399] bg-opacity-20 text-[#34D399] rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center border border-[#34D399] shadow-[0_0_5px_#34D399] hover:shadow-[0_0_10px_#34D399,0_0_15px_#34D399]"
      >
        <Download className="h-5 w-5 mr-2" />
        Download SVG
      </Button>
    </div>
  );
};

export default DownloadButtons;
