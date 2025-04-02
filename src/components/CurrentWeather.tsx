
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Droplets, Wind, 
  Thermometer, Cloud, Eye, 
  ArrowUpRight, CalendarDays,
  BellRing, AlertTriangle,
  Sun, Moon
} from "lucide-react";
import { CurrentWeather as CurrentWeatherType, Location, getWeatherIcon } from "@/services/weatherApi";
import WeatherIcon from "./WeatherIcon";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import WeatherInsights from "./WeatherInsights";
import { motion } from "framer-motion";

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  location: Location;
  alerts?: any[];
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ current, location, alerts = [] }) => {
  const isDay = current.is_day === 1;
  const weatherIconName = getWeatherIcon(current.condition, isDay);
  
  return (
    <Card className="overflow-hidden relative">
      {/* Day/Night Background */}
      <div 
        className={`absolute inset-0 ${isDay ? 'bg-gradient-to-b from-blue-400 to-blue-300' : 'bg-gradient-to-b from-indigo-900 to-purple-900'} opacity-30`}
      />
      
      {/* Clouds (only shown during day) */}
      {isDay && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i}
              className="absolute bg-white rounded-full opacity-70"
              style={{
                width: 60 + (i * 20),
                height: 30 + (i * 10),
                top: `${10 + (i * 15)}%`,
                left: `${(i * 20) % 100}%`,
              }}
              animate={{
                x: [0, 30, 0, -30, 0],
              }}
              transition={{
                duration: 40 + (i * 10),
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
      
      {/* Day/Night Indicator */}
      <div className="absolute top-4 right-4 z-10">
        {isDay ? 
          <Sun className="h-6 w-6 text-yellow-400" /> : 
          <Moon className="h-6 w-6 text-blue-100" />
        }
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">{location.name}</h2>
              <p className="text-muted-foreground">{location.region}, {location.country}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <WeatherIcon iconName={weatherIconName} className="h-16 w-16" />
              <div>
                <div className="text-5xl font-bold">{Math.round(current.temp_c)}°C</div>
                <div className="text-muted-foreground">Feels like {Math.round(current.feelslike_c)}°C</div>
              </div>
            </div>
            
            <div>
              <p className="text-xl font-medium">{current.condition.text}</p>
              <p className="text-sm text-muted-foreground">Last updated: {new Date(current.last_updated).toLocaleTimeString()}</p>
            </div>

            <WeatherInsights current={current} condition={current.condition.text} />
            
            {alerts && alerts.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Weather Alert</AlertTitle>
                <AlertDescription>
                  {alerts[0].headline || "Severe weather warning in your area"}
                </AlertDescription>
              </Alert>
            )}
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
