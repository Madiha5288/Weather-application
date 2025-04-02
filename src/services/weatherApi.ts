
import { toast } from "@/components/ui/use-toast";

// Weather API base URL and key
const API_KEY = "b9d8796e16e84432a5f120309252703";
const BASE_URL = "https://api.weatherapi.com/v1";

// Type definitions
export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_mph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  uv: number;
}

export interface HourForecast {
  time: string;
  time_epoch: number;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  chance_of_rain: number;
  chance_of_snow: number;
  vis_km: number;
  uv: number;
}

export interface DayForecast {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: string;
  };
  hour: HourForecast[];
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: {
    forecastday: DayForecast[];
  };
}

export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("Weather API Error:", error);
  let errorMessage = "Failed to fetch weather data";
  
  if (error.response) {
    const { status, data } = error.response;
    errorMessage = data.error?.message || `Error ${status}: ${errorMessage}`;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
  
  throw error;
};

// Search for locations
export const searchLocations = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

// Get current weather and forecast data
export const getWeatherData = async (
  query: string,
  days: number = 7
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=${days}&aqi=no&alerts=no`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Function to get the weather condition class based on the condition code or text
export const getWeatherConditionClass = (condition: { code: number; text: string }): string => {
  const conditionText = condition.text.toLowerCase();
  
  if (conditionText.includes("sunny") || conditionText.includes("clear")) {
    return "bg-gradient-clear";
  } else if (conditionText.includes("cloud") || conditionText.includes("overcast")) {
    return "bg-gradient-cloudy";
  } else if (
    conditionText.includes("rain") || 
    conditionText.includes("drizzle") || 
    conditionText.includes("shower")
  ) {
    return "bg-gradient-rainy";
  } else if (
    conditionText.includes("thunder") || 
    conditionText.includes("storm")
  ) {
    return "bg-gradient-stormy";
  } else if (
    conditionText.includes("snow") || 
    conditionText.includes("sleet") || 
    conditionText.includes("ice")
  ) {
    return "bg-gradient-snowy";
  }
  
  // Default fallback based on condition code ranges
  if (condition.code >= 1000 && condition.code < 1003) {
    return "bg-gradient-clear"; // Sunny/Clear
  } else if (condition.code >= 1003 && condition.code < 1030) {
    return "bg-gradient-cloudy"; // Cloudy/Overcast
  } else if (
    (condition.code >= 1030 && condition.code < 1090) &&
    !(condition.code >= 1060 && condition.code < 1070) // Exclude snow range
  ) {
    return "bg-gradient-rainy"; // Rain/Drizzle/Fog
  } else if (condition.code >= 1087 && condition.code < 1117) {
    return "bg-gradient-stormy"; // Thunder/Storm
  } else if (
    (condition.code >= 1060 && condition.code < 1070) || 
    (condition.code >= 1114 && condition.code < 1180)
  ) {
    return "bg-gradient-snowy"; // Snow/Ice
  }
  
  return "bg-gradient-clear"; // Default
};

// Get weather icon based on condition and time of day
export const getWeatherIcon = (condition: { code: number; text: string }, isDay: boolean = true): string => {
  const conditionText = condition.text.toLowerCase();
  
  if (conditionText.includes("sunny") || conditionText.includes("clear")) {
    return isDay ? "sun" : "moon";
  } else if (conditionText.includes("partly cloudy")) {
    return isDay ? "cloud-sun" : "cloud-moon";
  } else if (conditionText.includes("cloudy") || conditionText.includes("overcast")) {
    return "cloud";
  } else if (conditionText.includes("mist") || conditionText.includes("fog")) {
    return "cloud-fog";
  } else if (conditionText.includes("drizzle")) {
    return "cloud-drizzle";
  } else if (conditionText.includes("rain") || conditionText.includes("shower")) {
    return "cloud-rain";
  } else if (conditionText.includes("sleet")) {
    return "cloud-hail";
  } else if (conditionText.includes("snow")) {
    return "cloud-snow";
  } else if (conditionText.includes("thunder") || conditionText.includes("storm")) {
    return "cloud-lightning";
  }
  
  // More specific condition code mappings
  const code = condition.code;
  
  // Clear/Sunny
  if (code === 1000) {
    return isDay ? "sun" : "moon";
  }
  // Partly cloudy
  else if (code === 1003) {
    return isDay ? "cloud-sun" : "cloud-moon";
  }
  // Cloudy/Overcast
  else if ([1006, 1009].includes(code)) {
    return "cloud";
  }
  // Mist/Fog
  else if ([1030, 1135, 1147].includes(code)) {
    return "cloud-fog";
  }
  // Drizzle
  else if ([1063, 1150, 1153, 1180, 1183, 1186, 1189].includes(code)) {
    return "cloud-drizzle";
  }
  // Rain
  else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) {
    return "cloud-rain";
  }
  // Sleet/Ice
  else if ([1066, 1072, 1168, 1171, 1201, 1204, 1207, 1249, 1252].includes(code)) {
    return "cloud-hail";
  }
  // Snow
  else if ([1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1261, 1264].includes(code)) {
    return "cloud-snow";
  }
  // Thunder/Lightning
  else if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return "cloud-lightning";
  }
  
  // Default fallback
  return "cloud";
};

// Format relative time (e.g., "3 hours ago", "2 days from now")
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (Math.abs(diffSec) < 60) {
    return "just now";
  } else if (diffMin < 0) {
    if (diffMin > -60) return `${Math.abs(diffMin)} minutes ago`;
    else if (diffHour > -24) return `${Math.abs(diffHour)} hours ago`;
    else return `${Math.abs(diffDay)} days ago`;
  } else {
    if (diffMin < 60) return `in ${diffMin} minutes`;
    else if (diffHour < 24) return `in ${diffHour} hours`;
    else return `in ${diffDay} days`;
  }
};

// Format time from a date string (e.g., "14:30")
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Format date from a date string (e.g., "Mon, 21 Jun")
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString([], { 
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};
