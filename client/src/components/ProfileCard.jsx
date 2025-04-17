import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 border border-[#60A5FA] shadow-[0_0_5px_#60A5FA] hover:shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] px-4 py-2 rounded-full hover:bg-[#60A5FA] hover:bg-opacity-20 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-[#60A5FA] flex items-center justify-center">
            <span className="font-medium text-[#1F2937]">
              {userProfile?.username?.substring(0, 2).toUpperCase() || "JS"}
            </span>
          </div>
          <span className="hidden md:inline">My Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border border-[#60A5FA] shadow-[0_0_10px_#60A5FA,0_0_15px_#60A5FA] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#60A5FA]">Profile</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#60A5FA]"></div>
          </div>
        ) : userProfile ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-[#60A5FA] flex items-center justify-center">
                <span className="font-medium text-[#1F2937] text-2xl">
                  {userProfile.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{userProfile.username}</h3>
                <p className="text-gray-400">Member since {new Date(userProfile.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-[#60A5FA] mb-2">Recent Sketches</h4>
              {userProfile.sketches && userProfile.sketches.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userProfile.sketches.map((sketch) => (
                    <Card key={sketch.id} className="bg-gray-700 overflow-hidden">
                      <CardContent className="p-0">
                        <img src={sketch.image} alt="Sketch" className="w-full h-24 object-cover" />
                        <div className="p-2">
                          <p className="text-xs text-gray-300 truncate">{sketch.subject} - {new Date(sketch.createdAt).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No sketches yet. Create your first one!</p>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-[#60A5FA] mb-2">Preferences</h4>
              <div className="bg-gray-700 p-3 rounded-md">
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Default Mode:</span> {' '}
                  {userProfile.preferences?.defaultMode === 'pencil' ? 'Pure Pencil' : 'Artistic Pencil'}
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-gray-400">Favorite Subject:</span> {' '}
                  {userProfile.preferences?.favoriteSubject || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Sign in to view your profile</p>
            <Button className="mt-4 bg-[#60A5FA] text-white hover:bg-[#3B82F6]">
              Sign In
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;
