
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWeatherData, WeatherData, getWeatherConditionClass } from "@/services/weatherApi";
import { useToast } from "@/components/ui/use-toast";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("New York"); // Default location
  const [backgroundClass, setBackgroundClass] = useState("bg-gradient-clear");
  const { toast } = useToast();

  useEffect(() => {
    // Check if the browser supports geolocation
    if (navigator.geolocation && !weatherData) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          fetchWeatherData(locationString);
        },
        (error) => {
          console.error("Geolocation error:", error);
          fetchWeatherData(location); // Fallback to default location
        }
      );
    } else {
      // Fallback to default location or if weatherData already exists
      if (!weatherData) {
        fetchWeatherData(location);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWeatherData = async (locationQuery: string) => {
    setIsLoading(true);
    try {
      const data = await getWeatherData(locationQuery, 21); // Get 21 days forecast
      setWeatherData(data);
      setLocation(`${data.location.name}, ${data.location.country}`);
      
      // Set background based on current weather condition
      const bgClass = getWeatherConditionClass(data.current.condition);
      setBackgroundClass(bgClass);
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (locationQuery: string) => {
    fetchWeatherData(locationQuery);
  };

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${backgroundClass}`}>
      <div className="container max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            WeatherWise Wizard
          </h1>
          <SearchBar onLocationSelect={handleLocationSelect} />
        </header>

        {isLoading ? (
          <LoadingState />
        ) : weatherData ? (
          <div className="space-y-6">
            <CurrentWeather 
              current={weatherData.current} 
              location={weatherData.location} 
            />
            
            <Tabs defaultValue="hourly" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
                <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hourly" className="mt-0">
                <HourlyForecast 
                  hourlyData={weatherData.forecast.forecastday.flatMap(day => day.hour)} 
                />
              </TabsContent>
              
              <TabsContent value="daily" className="mt-0">
                <DailyForecast 
                  days={weatherData.forecast.forecastday} 
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-lg text-gray-600">Loading weather data...</p>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Data powered by WeatherAPI.com</p>
          <p className="mt-1">© {new Date().getFullYear()} WeatherWise Wizard</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
