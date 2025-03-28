
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Droplets, 
  Cloud
} from "lucide-react";
import { HourForecast, formatTime, getWeatherIcon } from "@/services/weatherApi";
import WeatherIcon from "@/components/WeatherIcon";

interface HourlyForecastProps {
  hourlyData: HourForecast[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  // Show next 24 hours
  const next24Hours = hourlyData.slice(0, 24);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>24-Hour Forecast</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex py-2 px-4 space-x-4">
            {next24Hours.map((hour, index) => {
              const time = formatTime(hour.time);
              const isNow = index === 0;
              const weatherIcon = getWeatherIcon(hour.condition, true);
              
              return (
                <div 
                  key={hour.time_epoch} 
                  className="flex flex-col items-center justify-between min-w-[80px] rounded-md p-2 hover:bg-accent transition-colors"
                >
                  <span className="text-sm font-medium mb-1">{isNow ? 'Now' : time}</span>
                  
                  <WeatherIcon 
                    iconName={weatherIcon} 
                    className="h-8 w-8 my-2" 
                  />
                  
                  <span className="text-lg font-semibold my-1">{Math.round(hour.temp_c)}°</span>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                    <Droplets className="h-3 w-3" />
                    <span>{hour.chance_of_rain}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground text-xs mt-1">
                    <Cloud className="h-3 w-3" />
                    <span>{hour.cloud}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
