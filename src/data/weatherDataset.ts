import { WeatherData, SearchResult } from "@/services/weatherApi";

// Sample locations for search
export const locationDataset: Record<string, SearchResult[]> = {
  "new york": [
    {
      id: 1,
      name: "New York",
      region: "New York",
      country: "United States of America",
      lat: 40.71,
      lon: -74.01,
      url: "new-york-united-states-of-america"
    },
    {
      id: 2,
      name: "New York",
      region: "Iowa",
      country: "United States of America",
      lat: 41.7,
      lon: -93.61,
      url: "new-york-iowa-united-states-of-america"
    }
  ],
  "london": [
    {
      id: 3,
      name: "London",
      region: "City of London, Greater London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11,
      url: "london-united-kingdom"
    },
    {
      id: 4,
      name: "London",
      region: "Ontario",
      country: "Canada",
      lat: 42.98,
      lon: -81.25,
      url: "london-ontario-canada"
    }
  ],
  "tokyo": [
    {
      id: 5,
      name: "Tokyo",
      region: "Tokyo",
      country: "Japan",
      lat: 35.69,
      lon: 139.69,
      url: "tokyo-japan"
    }
  ],
  "paris": [
    {
      id: 6,
      name: "Paris",
      region: "Ile-de-France",
      country: "France",
      lat: 48.87,
      lon: 2.33,
      url: "paris-france"
    },
    {
      id: 7,
      name: "Paris",
      region: "Texas",
      country: "United States of America",
      lat: 33.66,
      lon: -95.56,
      url: "paris-texas-united-states-of-america"
    }
  ],
  "sydney": [
    {
      id: 8,
      name: "Sydney",
      region: "New South Wales",
      country: "Australia",
      lat: -33.87,
      lon: 151.21,
      url: "sydney-australia"
    }
  ]
};

// Sample weather data for common locations
export const weatherDataset: Record<string, WeatherData> = {
  // New York
  "40.71,-74.01": {
    location: {
      name: "New York",
      region: "New York",
      country: "United States of America",
      lat: 40.71,
      lon: -74.01
    },
    current: {
      last_updated: new Date().toISOString(),
      temp_c: 22,
      temp_f: 71.6,
      is_day: 1,
      condition: {
        text: "Partly cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
      },
      wind_kph: 11.9,
      wind_mph: 7.4,
      wind_dir: "NE",
      pressure_mb: 1012,
      precip_mm: 0,
      humidity: 65,
      cloud: 25,
      feelslike_c: 22,
      feelslike_f: 71.6,
      vis_km: 10,
      uv: 4
    },
    forecast: {
      forecastday: Array(21).fill(null).map((_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60,
        day: {
          maxtemp_c: 24 + Math.sin(i * 0.5) * 3,
          maxtemp_f: (24 + Math.sin(i * 0.5) * 3) * 9/5 + 32,
          mintemp_c: 18 + Math.sin(i * 0.5) * 2,
          mintemp_f: (18 + Math.sin(i * 0.5) * 2) * 9/5 + 32,
          avgtemp_c: 21 + Math.sin(i * 0.5) * 2.5,
          avgtemp_f: (21 + Math.sin(i * 0.5) * 2.5) * 9/5 + 32,
          maxwind_mph: 9 + Math.random() * 3,
          maxwind_kph: (9 + Math.random() * 3) * 1.6,
          totalprecip_mm: i % 3 === 0 ? 1.2 : 0,
          totalsnow_cm: 0,
          avgvis_km: 10,
          avghumidity: 68 + Math.random() * 10,
          daily_will_it_rain: i % 3 === 0 ? 1 : 0,
          daily_chance_of_rain: i % 3 === 0 ? 70 : 0,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: {
            text: i % 3 === 0 ? "Light rain shower" : "Partly cloudy",
            icon: i % 3 === 0 ? "//cdn.weatherapi.com/weather/64x64/day/353.png" : "//cdn.weatherapi.com/weather/64x64/day/116.png",
            code: i % 3 === 0 ? 1180 : 1003
          },
          uv: 4
        },
        astro: {
          sunrise: "06:30 AM",
          sunset: "07:45 PM",
          moonrise: "09:15 PM",
          moonset: "06:45 AM",
          moon_phase: "Waxing Crescent",
          moon_illumination: "45"
        },
        hour: Array(24).fill(null).map((_, h) => ({
          time_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60 + h * 60 * 60,
          time: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString(),
          temp_c: 18 + 6 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 2,
          temp_f: (18 + 6 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 2) * 9/5 + 32,
          condition: {
            text: (i % 3 === 0 && h >= 14 && h <= 20) ? "Light rain shower" : "Partly cloudy",
            icon: (i % 3 === 0 && h >= 14 && h <= 20) ? "//cdn.weatherapi.com/weather/64x64/day/353.png" : h >= 6 && h <= 18 ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : "//cdn.weatherapi.com/weather/64x64/night/116.png",
            code: (i % 3 === 0 && h >= 14 && h <= 20) ? 1180 : 1003
          },
          wind_mph: 6 + Math.random() * 6,
          wind_kph: (6 + Math.random() * 6) * 1.6,
          wind_dir: "NE",
          pressure_mb: 1012,
          precip_mm: (i % 3 === 0 && h >= 14 && h <= 20) ? 0.3 : 0,
          humidity: 65 + Math.random() * 15,
          cloud: (i % 3 === 0 && h >= 12 && h <= 20) ? 70 : 25,
          feelslike_c: 18 + 6 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 2,
          feelslike_f: (18 + 6 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 2) * 9/5 + 32,
          chance_of_rain: (i % 3 === 0 && h >= 14 && h <= 20) ? 70 : 0,
          chance_of_snow: 0,
          vis_km: 10,
          uv: h >= 8 && h <= 16 ? 4 : 1
        }))
      }))
    }
  },
  
  // London
  "51.52,-0.11": {
    location: {
      name: "London",
      region: "City of London, Greater London",
      country: "United Kingdom",
      lat: 51.52,
      lon: -0.11
    },
    current: {
      last_updated: new Date().toISOString(),
      temp_c: 17,
      temp_f: 62.6,
      is_day: 1,
      condition: {
        text: "Overcast",
        icon: "//cdn.weatherapi.com/weather/64x64/day/122.png",
        code: 1009
      },
      wind_kph: 14.8,
      wind_mph: 9.2,
      wind_dir: "WSW",
      pressure_mb: 1008,
      precip_mm: 0.1,
      humidity: 77,
      cloud: 100,
      feelslike_c: 17,
      feelslike_f: 62.6,
      vis_km: 10,
      uv: 3
    },
    forecast: {
      forecastday: Array(21).fill(null).map((_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60,
        day: {
          maxtemp_c: 18 + Math.sin(i * 0.5) * 2,
          maxtemp_f: (18 + Math.sin(i * 0.5) * 2) * 9/5 + 32,
          mintemp_c: 13 + Math.sin(i * 0.5) * 1,
          mintemp_f: (13 + Math.sin(i * 0.5) * 1) * 9/5 + 32,
          avgtemp_c: 15.5 + Math.sin(i * 0.5) * 1.5,
          avgtemp_f: (15.5 + Math.sin(i * 0.5) * 1.5) * 9/5 + 32,
          maxwind_mph: 10 + Math.random() * 5,
          maxwind_kph: (10 + Math.random() * 5) * 1.6,
          totalprecip_mm: i % 2 === 0 ? 2.5 : 0.5,
          totalsnow_cm: 0,
          avgvis_km: 9,
          avghumidity: 78 + Math.random() * 10,
          daily_will_it_rain: 1,
          daily_chance_of_rain: i % 2 === 0 ? 80 : 40,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          condition: {
            text: i % 2 === 0 ? "Light rain" : "Overcast",
            icon: i % 2 === 0 ? "//cdn.weatherapi.com/weather/64x64/day/296.png" : "//cdn.weatherapi.com/weather/64x64/day/122.png",
            code: i % 2 === 0 ? 1183 : 1009
          },
          uv: 3
        },
        astro: {
          sunrise: "06:15 AM",
          sunset: "08:00 PM",
          moonrise: "10:30 PM",
          moonset: "07:15 AM",
          moon_phase: "Waxing Gibbous",
          moon_illumination: "78"
        },
        hour: Array(24).fill(null).map((_, h) => ({
          time_epoch: Math.floor(Date.now() / 1000) + i * 24 * 60 * 60 + h * 60 * 60,
          time: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString(),
          temp_c: 13 + 5 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 1.5,
          temp_f: (13 + 5 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 1.5) * 9/5 + 32,
          condition: {
            text: (i % 2 === 0 && h >= 12 && h <= 18) ? "Light rain" : "Overcast",
            icon: (i % 2 === 0 && h >= 12 && h <= 18) ? "//cdn.weatherapi.com/weather/64x64/day/296.png" : h >= 6 && h <= 18 ? "//cdn.weatherapi.com/weather/64x64/day/122.png" : "//cdn.weatherapi.com/weather/64x64/night/122.png",
            code: (i % 2 === 0 && h >= 12 && h <= 18) ? 1183 : 1009
          },
          wind_mph: 8 + Math.random() * 5,
          wind_kph: (8 + Math.random() * 5) * 1.6,
          wind_dir: "WSW",
          pressure_mb: 1008,
          precip_mm: (i % 2 === 0 && h >= 12 && h <= 18) ? 0.5 : 0.1,
          humidity: 77 + Math.random() * 10,
          cloud: (i % 2 === 0 && h >= 10 && h <= 20) ? 90 : 100,
          feelslike_c: 13 + 5 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 1.5,
          feelslike_f: (13 + 5 * Math.sin(h / 24 * Math.PI * 2 - Math.PI / 2) + Math.sin(i * 0.5) * 1.5) * 9/5 + 32,
          chance_of_rain: (i % 2 === 0 && h >= 12 && h <= 18) ? 80 : 40,
          chance_of_snow: 0,
          vis_km: 9,
          uv: h >= 8 && h <= 16 ? 3 : 1
        }))
      }))
    }
  }
};

// Function to find a location in the dataset by partial match
export const findLocationInDataset = (query: string): SearchResult[] => {
  const normalizedQuery = query.toLowerCase();
  
  for (const [key, locations] of Object.entries(locationDataset)) {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      return locations;
    }
  }
  
  // Look through all location objects for partial matches
  const allLocations = Object.values(locationDataset).flat();
  return allLocations.filter(location => 
    location.name.toLowerCase().includes(normalizedQuery) || 
    location.country.toLowerCase().includes(normalizedQuery) ||
    location.region.toLowerCase().includes(normalizedQuery)
  );
};

// Function to get weather data for coordinates
export const getWeatherForCoordinates = (lat: number, lon: number): WeatherData | null => {
  // Check for exact match
  const key = `${lat},${lon}`;
  if (weatherDataset[key]) {
    return weatherDataset[key];
  }
  
  // Check for approximate match (within reasonable distance)
  for (const [coordKey, data] of Object.entries(weatherDataset)) {
    const [dataLat, dataLon] = coordKey.split(',').map(Number);
    
    // Simple distance calculation (not accounting for Earth's curvature)
    const distance = Math.sqrt(Math.pow(dataLat - lat, 2) + Math.pow(dataLon - lon, 2));
    
    // If within ~50km (rough approximation)
    if (distance < 0.5) {
      return data;
    }
  }
  
  // Default to New York if no match found
  return weatherDataset["40.71,-74.01"];
};
