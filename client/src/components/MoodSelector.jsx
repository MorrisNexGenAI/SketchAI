import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOODS } from '../constants';

// Emoji mapping for moods
const moodEmojis = {
  'excited': '😀',
  'curious': '🧐',
  'stressed': '😰',
  'neutral': '😐',
  'frustrated': '😤'
};

const MoodSelector = ({ selectedMood, onChange }) => {
  return (
    <Card className="border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300 bg-gray-800 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#60A5FA]">Mood Adjustment</CardTitle>
      </CardHeader>
      <CardContent>
        <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => onChange(mood.toLowerCase())}
              className={`mood-button px-3 py-2 bg-gray-700 bg-opacity-50 border ${
                selectedMood === mood.toLowerCase()
                  ? 'border-[#60A5FA] bg-[#60A5FA] bg-opacity-20 shadow-[0_0_8px_#60A5FA]'
                  : 'border-gray-600'
              } rounded-lg text-sm transition-all duration-300 hover:border-[#60A5FA] flex items-center`}
            >
              <span className="mr-1">{moodEmojis[mood.toLowerCase()]}</span> {mood}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSelector;
