
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getWeatherData, WeatherData, getWeatherConditionClass } from "@/services/weatherApi";
import { useToast } from "@/components/ui/use-toast";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import SearchBar from "@/components/SearchBar";
import LoadingState from "@/components/LoadingState";
import SmartWatchDisplay from "@/components/SmartWatchDisplay";
import WeatherAlerts from "@/components/WeatherAlerts";
import MultiCityComparison from "@/components/MultiCityComparison";
import RadarMap from "@/components/RadarMap";
import HistoricalWeather from "@/components/HistoricalWeather";
import { useIsMobile } from "@/hooks/use-mobile";
import { Battery, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("New York"); // Default location
  const [backgroundClass, setBackgroundClass] = useState("bg-gradient-clear");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeTab, setActiveTab] = useState("current");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    if (isOffline) {
      toast({
        title: "You're offline",
        description: "Using cached weather data. Some information may not be up to date.",
        variant: "default",
      });
      
      // Try to retrieve cached data from localStorage
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setWeatherData(parsedData);
          setLocation(`${parsedData.location.name}, ${parsedData.location.country}`);
          setBackgroundClass(getWeatherConditionClass(parsedData.current.condition));
        } catch (error) {
          console.error("Error parsing cached data:", error);
        }
      }
      
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getWeatherData(locationQuery, 21); // Get 21 days forecast
      setWeatherData(data);
      setLocation(`${data.location.name}, ${data.location.country}`);
      
      // Set background based on current weather condition
      const bgClass = getWeatherConditionClass(data.current.condition);
      setBackgroundClass(bgClass);
      
      // Cache the weather data in localStorage for offline access
      localStorage.setItem("weatherData", JSON.stringify(data));
      localStorage.setItem("lastWeatherUpdate", new Date().toISOString());
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
      
      // Try to retrieve cached data if network request fails
      const cachedData = localStorage.getItem("weatherData");
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setWeatherData(parsedData);
          setLocation(`${parsedData.location.name}, ${parsedData.location.country}`);
          setBackgroundClass(getWeatherConditionClass(parsedData.current.condition));
          
          toast({
            title: "Using cached data",
            description: "Showing last saved weather information.",
          });
        } catch (error) {
          console.error("Error parsing cached data:", error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (locationQuery: string) => {
    fetchWeatherData(locationQuery);
  };

  // Demo weather alerts - in a real app, these would come from the API
  const mockAlerts = weatherData?.current?.condition?.text?.toLowerCase().includes('rain') ? [
    {
      headline: "Flash Flood Warning",
      severity: "Moderate",
      event: "Flash Flood Warning",
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      desc: "The National Weather Service has issued a Flash Flood Warning for this area due to heavy rainfall. Be prepared for rapidly rising water levels in low-lying areas."
    }
  ] : [];

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${backgroundClass}`}>
      <div className="container max-w-5xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Breezy Weather
          </h1>
          <SearchBar onLocationSelect={handleLocationSelect} />
          
          {isOffline && (
            <Alert className="mt-4">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Offline Mode</AlertTitle>
              <AlertDescription>
                You're currently offline. Showing cached weather data from the last update.
              </AlertDescription>
            </Alert>
          )}
        </header>

        {isLoading ? (
          <LoadingState />
        ) : weatherData ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <CurrentWeather 
                  current={weatherData.current} 
                  location={weatherData.location}
                  alerts={mockAlerts}
                />
              </div>
              
              {!isMobile && (
                <div className="w-40 hidden lg:block">
                  <SmartWatchDisplay 
                    temperature={weatherData.current.temp_c}
                    condition={weatherData.current.condition.text}
                    location={weatherData.location.name}
                  />
                </div>
              )}
            </div>
            
            {mockAlerts?.length > 0 && (
              <WeatherAlerts alerts={mockAlerts} />
            )}
            
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="map">Radar Map</TabsTrigger>
                <TabsTrigger value="comparison">City Comparison</TabsTrigger>
                <TabsTrigger value="historical">Historical Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-0">
                <RadarMap 
                  latitude={weatherData.location.lat} 
                  longitude={weatherData.location.lon} 
                />
              </TabsContent>
              
              <TabsContent value="comparison" className="mt-0">
                <MultiCityComparison />
              </TabsContent>
              
              <TabsContent value="historical" className="mt-0">
                <HistoricalWeather location={weatherData.location} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-lg text-muted-foreground">Loading weather data...</p>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Data powered by WeatherAPI.com</p>
          <p className="mt-1">© {new Date().getFullYear()} Breezy Weather</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
