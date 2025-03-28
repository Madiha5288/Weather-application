
import React, { useState, useEffect } from "react";
import { Map, ListChecks, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherIcon from "./WeatherIcon";
import { getWeatherData, getWeatherIcon, searchLocations } from "@/services/weatherApi";
import { useToast } from "@/components/ui/use-toast";

interface SavedCity {
  id: string;
  name: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
}

const MultiCityComparison = () => {
  const [cities, setCities] = useState<SavedCity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Load saved cities from localStorage on component mount
  useEffect(() => {
    const savedCities = localStorage.getItem("weatherCities");
    if (savedCities) {
      try {
        setCities(JSON.parse(savedCities));
      } catch (e) {
        console.error("Error loading saved cities:", e);
      }
    }
  }, []);

  // Save cities to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("weatherCities", JSON.stringify(cities));
  }, [cities]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await searchLocations(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching locations:", error);
      toast({
        title: "Error",
        description: "Failed to search for locations",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addCity = async (city: any) => {
    // Check if city is already in the list
    if (cities.some(c => c.name === `${city.name}, ${city.country}`)) {
      toast({
        title: "City already added",
        description: `${city.name}, ${city.country} is already in your comparison list`,
      });
      return;
    }

    try {
      const weatherData = await getWeatherData(`${city.lat},${city.lon}`);
      const newCity: SavedCity = {
        id: Date.now().toString(),
        name: `${city.name}, ${city.country}`,
        temp: weatherData.current.temp_c,
        condition: weatherData.current.condition.text,
        icon: getWeatherIcon(weatherData.current.condition, weatherData.current.is_day === 1),
        humidity: weatherData.current.humidity,
        wind: weatherData.current.wind_kph
      };
      
      setCities(prev => [...prev, newCity]);
      setSearchQuery("");
      setSearchResults([]);
      
      toast({
        title: "City added",
        description: `${city.name}, ${city.country} has been added to your comparison list`,
      });
    } catch (error) {
      console.error("Error adding city:", error);
      toast({
        title: "Error",
        description: "Failed to add city",
        variant: "destructive",
      });
    }
  };

  const removeCity = (id: string) => {
    setCities(prev => prev.filter(city => city.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Map className="mr-2 h-5 w-5" />
          Multi-City Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-2 border rounded-md overflow-hidden">
              {searchResults.map((result) => (
                <div 
                  key={`${result.id}-${result.name}`}
                  className="p-2 hover:bg-accent flex justify-between items-center cursor-pointer border-b last:border-b-0"
                  onClick={() => addCity(result)}
                >
                  <span>{result.name}, {result.country}</span>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <ListChecks className="mx-auto h-8 w-8 mb-2" />
            <p>No cities added for comparison yet. Search and add cities above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Card key={city.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm truncate" title={city.name}>
                        {city.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <WeatherIcon iconName={city.icon} className="h-8 w-8 mr-2" />
                        <span className="text-2xl font-bold">{Math.round(city.temp)}°C</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{city.condition}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeCity(city.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                    <span>💧 {city.humidity}%</span>
                    <span>💨 {city.wind} km/h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiCityComparison;
