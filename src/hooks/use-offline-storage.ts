import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/use-network';
import { WeatherData } from '@/services/weatherApi';

export interface StoredWeatherData {
  data: WeatherData;
  timestamp: number;
  location: string;
}

export function useOfflineStorage() {
  const isOnline = useNetworkStatus();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Save weather data to local storage
  const saveWeatherData = (locationKey: string, data: WeatherData) => {
    try {
      const storedData: StoredWeatherData = {
        data,
        timestamp: Date.now(),
        location: `${data.location.name}, ${data.location.country}`
      };
      
      localStorage.setItem(`weather_${locationKey}`, JSON.stringify(storedData));
      
      // Also save to recent locations list
      const recentLocations = getRecentLocations();
      if (!recentLocations.includes(locationKey)) {
        recentLocations.unshift(locationKey);
        // Keep only the 5 most recent locations
        if (recentLocations.length > 5) {
          recentLocations.pop();
        }
        localStorage.setItem('recent_locations', JSON.stringify(recentLocations));
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error saving weather data:', error);
    }
  };

  // Get weather data from local storage
  const getWeatherData = (locationKey: string): StoredWeatherData | null => {
    try {
      const data = localStorage.getItem(`weather_${locationKey}`);
      if (data) {
        return JSON.parse(data) as StoredWeatherData;
      }
    } catch (error) {
      console.error('Error retrieving weather data:', error);
    }
    return null;
  };

  // Get list of recent locations
  const getRecentLocations = (): string[] => {
    try {
      const locations = localStorage.getItem('recent_locations');
      if (locations) {
        return JSON.parse(locations) as string[];
      }
    } catch (error) {
      console.error('Error retrieving recent locations:', error);
    }
    return [];
  };

  // Check if stored data is still fresh (less than 1 hour old)
  const isDataFresh = (timestamp: number): boolean => {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    return now - timestamp < hourMs;
  };

  // Initialize last updated date from storage
  useEffect(() => {
    const lastUpdate = localStorage.getItem('lastWeatherUpdate');
    if (lastUpdate) {
      setLastUpdated(new Date(lastUpdate));
    }
  }, []);

  return {
    saveWeatherData,
    getWeatherData,
    getRecentLocations,
    isDataFresh,
    isOnline,
    lastUpdated
  };
}
