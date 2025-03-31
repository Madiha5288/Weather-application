
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOfflineStorage } from '@/hooks/use-offline-storage';

interface RecentLocationsProps {
  onLocationSelect: (location: string) => void;
}

const RecentLocations: React.FC<RecentLocationsProps> = ({ onLocationSelect }) => {
  const { getRecentLocations, getWeatherData } = useOfflineStorage();
  const recentLocations = getRecentLocations();

  if (recentLocations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2" />
          <h3 className="text-sm font-medium">Recent Locations</h3>
        </div>
        <ScrollArea className="h-[70px] w-full">
          <div className="flex flex-wrap gap-2 py-1">
            {recentLocations.map((locationKey) => {
              const savedData = getWeatherData(locationKey);
              if (!savedData) return null;
              
              return (
                <Button 
                  key={locationKey}
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => onLocationSelect(locationKey)}
                >
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{savedData.location}</span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentLocations;
