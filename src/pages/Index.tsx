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
import { Battery, Wifi, WifiOff, CloudRain, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import WeatherAnimation from "@/components/WeatherAnimation";
import MobileHeader from "@/components/MobileHeader";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import GeolocationPrompt from "@/components/GeolocationPrompt";
import NetworkError from "@/components/NetworkError";

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("New York"); // Default location
  const [backgroundClass, setBackgroundClass] = useState("bg-gradient-clear");
  const [activeTab, setActiveTab] = useState("current");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { toast: toastUi } = useToast();
  const { 
    saveWeatherData, 
    getWeatherData: getStoredWeatherData, 
    isDataFresh, 
    isOnline,
    lastUpdated 
  } = useOfflineStorage();

  useEffect(() => {
    if (isOnline && weatherData) {
      toast.success("You're back online", {
        description: "Weather data will be updated automatically.",
      });
      fetchWeatherData(location);
    } else if (!isOnline) {
      setNetworkError("You're currently offline. Using cached weather data.");
    } else {
      setNetworkError(null);
    }
  }, [isOnline]);

  useEffect(() => {
    if (navigator.geolocation && !weatherData) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          fetchWeatherData(locationString);
          setGeoError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          
          let errorMessage = "Unable to access your location.";
          if (error.code === 1) {
            errorMessage = "Location access was denied. Please enable location services in your browser settings.";
          } else if (error.code === 2) {
            errorMessage = "Your location information is unavailable.";
          } else if (error.code === 3) {
            errorMessage = "The request to get your location timed out.";
          }
          
          setGeoError(errorMessage);
          toast.error("Location access error", {
            description: errorMessage,
          });
          
          setIsLoading(false);
        }
      );
    } else if (!navigator.geolocation && !weatherData) {
      setGeoError("Your browser doesn't support geolocation.");
      fetchWeatherData(location);
    } else if (!weatherData) {
      fetchWeatherData(location);
    }
  }, []);

  const retryGeolocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          fetchWeatherData(locationString);
          setGeoError(null);
        },
        (error) => {
          console.error("Geolocation error on retry:", error);
          setGeoError("Still unable to access your location. Please try manual search.");
          setIsLoading(false);
        }
      );
    }
  };

  const fetchWeatherData = async (locationQuery: string) => {
    if (!isOnline) {
      const cachedData = getStoredWeatherData(locationQuery);
      if (cachedData) {
        toast.info("You're offline", {
          description: "Using cached weather data from " + new Date(cachedData.timestamp).toLocaleString(),
        });
        
        setWeatherData(cachedData.data);
        setLocation(`${cachedData.data.location.name}, ${cachedData.data.location.country}`);
        setBackgroundClass(getWeatherConditionClass(cachedData.data.current.condition));
      } else {
        toast.error("Offline mode", {
          description: "No cached data available for this location.",
        });
      }
      return;
    }
    
    const cachedData = getStoredWeatherData(locationQuery);
    if (cachedData && isDataFresh(cachedData.timestamp)) {
      setWeatherData(cachedData.data);
      setLocation(`${cachedData.data.location.name}, ${cachedData.data.location.country}`);
      setBackgroundClass(getWeatherConditionClass(cachedData.data.current.condition));
      
      toast.info("Using cached data", {
        description: "Last updated " + new Date(cachedData.timestamp).toLocaleTimeString(),
      });
      
      return;
    }
    
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      const data = await getWeatherData(locationQuery, 21);
      setWeatherData(data);
      setLocation(`${data.location.name}, ${data.location.country}`);
      
      const bgClass = getWeatherConditionClass(data.current.condition);
      setBackgroundClass(bgClass);
      
      saveWeatherData(locationQuery, data);
      
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase.from('recent_searches').upsert({
          user_id: session.session.user.id,
          location: `${data.location.name}, ${data.location.country}`,
          location_key: locationQuery,
          searched_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      
      if (!navigator.onLine) {
        setNetworkError("You're offline. Please check your internet connection.");
      } else {
        setNetworkError("Failed to fetch weather data. The server might be down or the location might not exist.");
      }
      
      const cachedData = getStoredWeatherData(locationQuery);
      if (cachedData) {
        setWeatherData(cachedData.data);
        setLocation(`${cachedData.data.location.name}, ${cachedData.data.location.country}`);
        setBackgroundClass(getWeatherConditionClass(cachedData.data.current.condition));
        
        toast.info("Using cached data", {
          description: "Showing last saved weather information.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (locationQuery: string) => {
    fetchWeatherData(locationQuery);
  };

  const handleManualSearch = () => {
    setGeoError(null);
  };

  const retryFetchWeather = () => {
    if (weatherData) {
      fetchWeatherData(`${weatherData.location.lat},${weatherData.location.lon}`);
    } else {
      fetchWeatherData(location);
    }
  };

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

  if (geoError && !weatherData && !isLoading) {
    return (
      <div className={`min-h-screen py-8 transition-all duration-500 bg-gradient-clear relative`}>
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
              Weather Application
            </h1>
            <SearchBar onLocationSelect={handleLocationSelect} />
          </header>
          
          <div className="flex flex-col items-center justify-center py-12">
            <GeolocationPrompt 
              onManualSearch={handleManualSearch}
              onRetryGeolocation={retryGeolocation}
              error={geoError}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 transition-all duration-500 ${backgroundClass} relative`}>
      {weatherData && (
        <WeatherAnimation 
          condition={weatherData.current.condition.text} 
          className="absolute inset-0 pointer-events-none z-0"
          isDay={weatherData.current.is_day === 1}
        />
      )}
      
      {isMobile && <MobileHeader />}
      
      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-foreground">
            Weather Application
          </h1>
          <SearchBar onLocationSelect={handleLocationSelect} />
          
          {!isOnline && (
            <Alert className="mt-4">
              <WifiOff className="h-4 w-4" />
              <AlertTitle>Offline Mode</AlertTitle>
              <AlertDescription>
                You're currently offline. Showing cached weather data from the last update.
              </AlertDescription>
            </Alert>
          )}
          
          {networkError && (
            <NetworkError 
              message={networkError} 
              onRetry={retryFetchWeather} 
            />
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
                  isDay={weatherData.current.is_day === 1}
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
            <p className="text-lg text-muted-foreground">Enter a location to see weather information</p>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Data powered by WeatherAPI.com</p>
          <p className="mt-1">© {new Date().getFullYear()} Weather Application</p>
          {lastUpdated && (
            <p className="mt-1 text-xs">Last updated: {lastUpdated.toLocaleString()}</p>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Index;
