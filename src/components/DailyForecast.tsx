
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayForecast, formatDate, getWeatherIcon } from "@/services/weatherApi";
import { Droplets, ArrowUp, ArrowDown } from "lucide-react";
import WeatherIcon from "@/components/WeatherIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DailyForecastProps {
  days: DayForecast[];
}

const DailyForecast: React.FC<DailyForecastProps> = ({ days }) => {
  // Split forecasts into 7-day and full forecast views
  const shortTermForecast = days.slice(0, 7);
  const fullForecast = days; // Use all available days
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Daily Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="7day">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="7day">7-Day</TabsTrigger>
            <TabsTrigger value="21day">{fullForecast.length}-Day</TabsTrigger>
          </TabsList>
          
          <TabsContent value="7day" className="mt-0">
            <ForecastList days={shortTermForecast} detailed />
          </TabsContent>
          
          <TabsContent value="21day" className="mt-0">
            <ForecastList days={fullForecast} detailed={false} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ForecastListProps {
  days: DayForecast[];
  detailed: boolean;
}

const ForecastList: React.FC<ForecastListProps> = ({ days, detailed }) => {
  return (
    <div className="space-y-2">
      {days.map((day) => {
        const date = formatDate(day.date);
        const weatherIcon = getWeatherIcon(day.day.condition, true);
        const isToday = new Date(day.date).toDateString() === new Date().toDateString();
        
        return (
          <div
            key={day.date_epoch}
            className="flex items-center justify-between p-3 rounded-md hover:bg-accent transition-colors"
          >
            <div className="w-24 flex-shrink-0">
              <span className="text-sm font-medium">
                {isToday ? "Today" : date}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <WeatherIcon 
                iconName={weatherIcon} 
                className="h-6 w-6" 
              />
              <span className="text-sm hidden md:inline">{day.day.condition.text}</span>
            </div>
            
            {detailed && (
              <div className="flex items-center space-x-3 text-sm text-muted-foreground ml-auto mr-4">
                <div className="flex items-center">
                  <Droplets className="h-3 w-3 mr-1" />
                  <span>{day.day.daily_chance_of_rain}%</span>
                </div>
                <div className="hidden md:flex items-center">
                  <span>Humidity: {day.day.avghumidity}%</span>
                </div>
                <div className="hidden md:flex items-center">
                  <span>UV: {day.day.uv}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 text-sm font-medium ml-auto">
              <div className="flex items-center">
                <ArrowUp className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-orange-500">{Math.round(day.day.maxtemp_c)}°</span>
              </div>
              <div className="flex items-center">
                <ArrowDown className="h-3 w-3 mr-1 text-blue-500" />
                <span className="text-blue-500">{Math.round(day.day.mintemp_c)}°</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
