import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUBJECTS } from '../constants';

const SubjectSelector = ({ subject, context, onSubjectChange, onContextChange }) => {
  return (
    <Card className="border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] transition-shadow duration-300 bg-gray-800 bg-opacity-50">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#60A5FA]">Subject & Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject-select" className="text-sm font-medium text-gray-300">
            Subject Area
          </Label>
          <Select value={subject} onValueChange={onSubjectChange}>
            <SelectTrigger
              id="subject-select"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent transition-all duration-300"
            >
              <SelectValue placeholder="Select subject area" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subjectItem) => (
                <SelectItem key={subjectItem} value={subjectItem.toLowerCase()}>
                  {subjectItem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="context-input" className="text-sm font-medium text-gray-300">
            Additional Context
          </Label>
          <Input
            id="context-input"
            placeholder="E.g., 'human digestive system'"
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent transition-all duration-300"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectSelector;
