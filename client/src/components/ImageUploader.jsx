import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Upload, FileUp, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Register FilePond plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType
);

const ImageUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const pondRef = useRef(null);
  const { toast } = useToast();

  // Handle file processing
  const handleProcessFile = (error, file) => {
    if (error) {
      toast({
        title: "Upload Error",
        description: error.message || "There was an error processing your file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileData = file.file;
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64Image = reader.result;
        onUpload(base64Image);
        toast({
          title: "Upload Complete",
          description: "Your image is ready for processing.",
        });
        
        // Clear the pond after successful upload
        setTimeout(() => {
          if (pondRef.current) {
            pondRef.current.removeFiles();
          }
        }, 1000);
      };
      
      reader.onerror = () => {
        toast({
          title: "Reader Error",
          description: "Failed to read the uploaded file.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(fileData);
    } catch (err) {
      console.error('Error processing file:', err);
      toast({
        title: "Processing Error",
        description: "Something went wrong while processing your file.",
        variant: "destructive",
      });
    }
  };

  // Drag handler for custom styling
  const handleDragChange = (isDragging) => {
    setIsDragging(isDragging);
  };

  return (
    <Card 
      className={`overflow-hidden shadow-lg ${
        isDragging 
          ? 'border-2 border-indigo-400 shadow-indigo-300/40' 
          : 'border border-indigo-700 shadow-indigo-300/20 hover:shadow-indigo-300/30'
      } transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800`}
    >
      <CardHeader className="py-3">
        <CardTitle className="text-xl font-bold flex items-center gap-2 text-indigo-300">
          <Upload className="h-5 w-5" /> Image Upload
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <FilePond
          ref={pondRef}
          files={files}
          onupdatefiles={setFiles}
          onprocessfile={handleProcessFile}
          allowMultiple={false}
          maxFiles={1}
          instantUpload={false}
          allowFileSizeValidation={true}
          maxFileSize="50MB"
          allowFileTypeValidation={true}
          acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
          labelIdle={`
            <div class="filepond--label-action custom-filepond">
              <div class="flex flex-col items-center">
                <div class="mb-2 p-3 rounded-full bg-indigo-600/20 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-up"><path d="M15 8h.01"/><path d="m2 16 20 6-6-6"/><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M6 10h.01M2 16l5-5c.42-.42 1.1-.42 1.5 0l7 7M18 12l-2-2c-.42-.42-1.1-.42-1.5 0L9 16"/></svg>
                </div>
                <p class="text-sm font-medium text-indigo-300 mb-1">Drag & Drop your image here</p>
                <p class="text-xs text-gray-400">or click to browse (PNG, JPG, WEBP, up to 50MB)</p>
              </div>
            </div>
          `}
          credits={false}
          className="custom-filepond"
          onactivatefile={() => {
            if (files.length > 0) {
              handleProcessFile(null, files[0]);
            }
          }}
          // Custom styling hooks
          beforeDropFile={() => handleDragChange(true)}
          beforeDropFileValidation={() => handleDragChange(true)}
          onDragEnter={() => handleDragChange(true)}
          onDragLeave={() => handleDragChange(false)}
          onDrop={() => handleDragChange(false)}
        />
      </CardContent>
      
      <CardFooter className="flex justify-between gap-3 bg-gray-800/50 border-t border-gray-700/50">
        <Button 
          onClick={() => {
            if (pondRef.current) {
              // Trigger file browser
              pondRef.current.browse();
            }
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <FileUp className="h-4 w-4 mr-2" /> Browse Files
        </Button>
        
        <Button 
          onClick={() => {
            if (files.length > 0) {
              handleProcessFile(null, files[0]);
            } else {
              toast({
                title: "No Image Selected",
                description: "Please select an image to process.",
                variant: "destructive",
              });
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={files.length === 0}
        >
          <ImageIcon className="h-4 w-4 mr-2" /> Process Image
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUploader;