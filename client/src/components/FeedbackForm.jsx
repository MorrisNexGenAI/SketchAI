import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const StarRating = ({ value, onChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-2xl ${
            star <= (hoverRating || value) ? 'text-[#FBBF24]' : 'text-gray-500 hover:text-gray-300'
          } transition-colors duration-300`}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const FEEDBACK_OPTIONS = [
  { id: 'too-many-details', label: 'Too many details' },
  { id: 'not-clear', label: 'Not clear enough' },
  { id: 'loved-it', label: 'Loved it' },
  { id: 'thicker-lines', label: 'Try thicker lines' }
];

const FeedbackForm = ({ sketchId }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const toggleFeedbackOption = (option) => {
    setFeedback((prev) => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a star rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest('POST', '/api/feedback', {
        sketchId,
        rating,
        comments: feedback
      });
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve SketchSense.",
        variant: "default",
      });
      
      // Reset form after successful submission
      setRating(0);
      setFeedback([]);
    } catch (error) {
      toast({
        title: "Error submitting feedback",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300 bg-gray-800 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#60A5FA]">How was your experience?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="block text-sm font-medium text-gray-300">Rate your sketch</Label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        
        <div className="space-y-2">
          <Label className="block text-sm font-medium text-gray-300">What could be improved?</Label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={option.id}
                  checked={feedback.includes(option.id)}
                  onCheckedChange={() => toggleFeedbackOption(option.id)}
                  className="text-[#60A5FA]"
                />
                <Label htmlFor={option.id} className="text-gray-300 text-sm cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#FBBF24] bg-opacity-20 text-[#FBBF24] rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center border border-[#FBBF24] shadow-[0_0_5px_#FBBF24] hover:shadow-[0_0_10px_#FBBF24,0_0_15px_#FBBF24]"
          >
            <Check className="h-5 w-5 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
