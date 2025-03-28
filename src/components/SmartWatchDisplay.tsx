
import React from "react";
import { Smartwatch } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { getWeatherIcon } from "@/services/weatherApi";

interface SmartWatchDisplayProps {
  temperature?: number;
  condition?: string;
  location?: string;
}

const SmartWatchDisplay: React.FC<SmartWatchDisplayProps> = ({ 
  temperature = 0,
  condition = "clear",
  location = "Unknown"
}) => {
  const weatherIcon = getWeatherIcon(condition, true);
  
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Smartwatch className="h-4 w-4" />
        <span>Smartwatch Preview</span>
      </div>
      
      <div className="smartwatch-view flex flex-col items-center justify-center">
        <div className="text-xs mb-1 truncate w-full text-center">{location.split(',')[0]}</div>
        <WeatherIcon iconName={weatherIcon} className="h-8 w-8 my-1" />
        <div className="text-xl font-bold">{Math.round(temperature)}°</div>
      </div>
    </div>
  );
};

export default SmartWatchDisplay;
