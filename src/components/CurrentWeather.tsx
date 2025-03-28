
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sun, Moon, Droplets, Wind, 
  Thermometer, Cloud, Eye, 
  ArrowUpRight, CalendarDays
} from "lucide-react";
import { CurrentWeather as CurrentWeatherType, Location, getWeatherIcon } from "@/services/weatherApi";

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  location: Location;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ current, location }) => {
  const isDay = current.is_day === 1;
  const weatherIcon = getWeatherIcon(current.condition, isDay);
  
  // Get the corresponding icon component
  const getIconComponent = () => {
    switch (weatherIcon) {
      case "sun": return <Sun className="h-16 w-16 text-yellow-400" />;
      case "moon": return <Moon className="h-16 w-16 text-gray-300" />;
      case "cloud": return <Cloud className="h-16 w-16 text-gray-400" />;
      default: return <Sun className="h-16 w-16 text-yellow-400" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">{location.name}</h2>
              <p className="text-muted-foreground">{location.region}, {location.country}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {getIconComponent()}
              <div>
                <div className="text-5xl font-bold">{Math.round(current.temp_c)}°C</div>
                <div className="text-muted-foreground">Feels like {Math.round(current.feelslike_c)}°C</div>
              </div>
            </div>
            
            <div>
              <p className="text-xl font-medium">{current.condition.text}</p>
              <p className="text-sm text-muted-foreground">Last updated: {new Date(current.last_updated).toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">UV Index</p>
                <p className="text-lg">{current.uv}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Wind</p>
                <p className="text-lg">{current.wind_kph} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-lg">{current.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ArrowUpRight className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Pressure</p>
                <p className="text-lg">{current.pressure_mb} mb</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Cloud Cover</p>
                <p className="text-lg">{current.cloud}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Visibility</p>
                <p className="text-lg">{current.vis_km} km</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
