
import React from "react";
import { Brain } from "lucide-react";
import { CurrentWeather } from "@/services/weatherApi";

interface WeatherInsightsProps {
  current: CurrentWeather;
  condition: string;
}

const WeatherInsights: React.FC<WeatherInsightsProps> = ({ current, condition }) => {
  const getInsight = () => {
    const tempC = current.temp_c;
    const conditionLower = condition.toLowerCase();
    const feelsLikeC = current.feelslike_c;
    const uvIndex = current.uv;
    const humidity = current.humidity;
    
    if (conditionLower.includes("rain") || conditionLower.includes("drizzle") || conditionLower.includes("shower")) {
      return "Take an umbrella with you today and consider waterproof footwear.";
    }
    
    if (conditionLower.includes("snow") || conditionLower.includes("sleet") || conditionLower.includes("ice")) {
      return "Wear warm layers, gloves, and a hat. Drive carefully on potentially icy roads.";
    }
    
    if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
      return "Stay indoors if possible. Avoid open areas and tall trees if outside.";
    }
    
    if (tempC < 5) {
      return "It's very cold today! Wear a warm coat, hat, and gloves.";
    }
    
    if (tempC < 12) {
      return "It's quite cool today. A jacket or sweater would be comfortable.";
    }
    
    if (tempC > 28) {
      return "It's hot today! Stay hydrated and seek shade when possible.";
    }
    
    if (uvIndex > 7) {
      return "Very high UV levels today. Apply sunscreen and wear protective clothing.";
    }
    
    if (uvIndex > 5) {
      return "Moderate to high UV levels. Consider sunscreen when outdoors.";
    }

    if (humidity > 80 && tempC > 22) {
      return "Hot and humid conditions. Stay hydrated and take breaks in cool areas.";
    }
    
    if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
      return "Reduced visibility due to fog. Drive carefully and use fog lights.";
    }
    
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      if (current.is_day === 1) {
        return "Perfect day to enjoy outdoor activities! Don't forget sunscreen.";
      } else {
        return "Clear night sky - great for stargazing if you're out late.";
      }
    }
    
    return "Enjoy your day and check back for weather updates!";
  };

  return (
    <div className="flex items-start space-x-2 bg-primary/10 p-3 rounded-md">
      <Brain className="h-5 w-5 text-primary mt-0.5" />
      <div>
        <p className="text-sm font-medium">Weather Insight</p>
        <p className="text-sm">{getInsight()}</p>
      </div>
    </div>
  );
};

export default WeatherInsights;
