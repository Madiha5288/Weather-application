
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface HistoricalWeatherProps {
  location: {
    name: string;
    country: string;
  };
}

// Generate location-based historical temperatures
const generateHistoricalData = (daysAgo: number, location: { name: string; country: string }) => {
  const data = [];
  const today = new Date();
  
  // Use location name and country to create a unique seed for this location
  const locationString = `${location.name}${location.country}`;
  let locationSeed = 0;
  for (let i = 0; i < locationString.length; i++) {
    locationSeed += locationString.charCodeAt(i);
  }
  
  // Different base temps based on region/country (more detailed climate zones)
  let baseTemp = 22; // Default base temperature
  let rainProbability = 0.3; // Default rain probability
  let tempVariability = 5; // How much temp varies day to day
  
  // Adjust base temperature based on country/region (more detailed climate zones)
  const country = location.country.toLowerCase();
  
  // Arctic/Very Cold regions
  if (['antarctica', 'greenland'].some(c => country.includes(c))) {
    baseTemp = -15;
    rainProbability = 0.2;
    tempVariability = 3;
  }
  // Northern cold countries
  else if (['norway', 'sweden', 'finland', 'iceland', 'canada', 'russia'].some(c => country.includes(c))) {
    baseTemp = 5;
    rainProbability = 0.4;
    tempVariability = 4;
  } 
  // Continental cold climates
  else if (['mongolia', 'kazakhstan', 'kyrgyzstan'].some(c => country.includes(c))) {
    baseTemp = 8;
    rainProbability = 0.2;
    tempVariability = 8; // High variability
  }
  // Hot desert countries
  else if (['egypt', 'saudi', 'qatar', 'uae', 'libya', 'iraq'].some(c => country.includes(c))) {
    baseTemp = 35;
    rainProbability = 0.05;
    tempVariability = 6;
  }
  // Hot but not desert
  else if (['australia', 'india', 'pakistan', 'nigeria', 'sudan'].some(c => country.includes(c))) {
    baseTemp = 30;
    rainProbability = 0.15;
    tempVariability = 4;
  }
  // Tropical humid countries
  else if (['brazil', 'indonesia', 'malaysia', 'thailand', 'philippines', 'vietnam', 'colombia'].some(c => country.includes(c))) {
    baseTemp = 28;
    rainProbability = 0.7;
    tempVariability = 2; // Less variability in tropics
  }
  // Mediterranean
  else if (['greece', 'turkey', 'italy', 'spain', 'portugal', 'cyprus'].some(c => country.includes(c))) {
    baseTemp = 24;
    rainProbability = 0.2;
    tempVariability = 3;
  }
  // Temperate maritime
  else if (['uk', 'ireland', 'netherlands', 'belgium', 'denmark'].some(c => country.includes(c))) {
    baseTemp = 15;
    rainProbability = 0.5;
    tempVariability = 3;
  }
  // Continental temperate
  else if (['france', 'germany', 'poland', 'austria', 'switzerland', 'united states', 'japan'].some(c => country.includes(c))) {
    baseTemp = 18;
    rainProbability = 0.35;
    tempVariability = 5;
  }
  
  // Make adjustments for specific locations within countries
  // Desert areas
  if (location.name.toLowerCase().match(/desert|sahara|gobi|mojave|kalahari/)) {
    baseTemp += 5;
    rainProbability = 0.05;
    tempVariability += 2;
  }
  // Mountain areas
  else if (location.name.toLowerCase().match(/mount|mountain|hill|alps|andes|himalaya/)) {
    baseTemp -= 8;
    rainProbability += 0.1;
    tempVariability += 1;
  }
  // Coastal areas
  else if (location.name.toLowerCase().match(/coast|beach|sea|ocean|bay|gulf/)) {
    tempVariability -= 1;
    rainProbability += 0.1;
  }
  
  // Add some randomness based on the location name
  const locationVariation = (locationSeed % 10) - 5;
  baseTemp += locationVariation;
  
  // Apply seasonal effects based on hemisphere
  const isNorthernHemisphere = !['australia', 'new zealand', 'argentina', 'chile', 'brazil', 'south africa', 'uruguay', 'paraguay'].some(c => country.includes(c));
  
  let previousTemp = baseTemp; // For creating more realistic day-to-day transitions
  
  for (let i = daysAgo; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create a deterministic but unique seed for this specific day and location
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
    const seedValue = (locationSeed + dayOfYear) / 100;
    
    // Pseudo-random function that will give the same result for the same inputs
    const pseudoRandom = (seed: number) => {
      return ((Math.sin(seed * 12345.6789) + 1) / 2);
    };
    
    // Calculate seasonal variation (opposite for southern hemisphere)
    let monthOffset = date.getMonth();
    if (!isNorthernHemisphere) {
      monthOffset = (monthOffset + 6) % 12;
    }
    
    const seasonalVariation = Math.sin((monthOffset + 1) / 12 * Math.PI * 2) * 10;
    
    // Calculate daily variation - use previous temperature to smooth transitions
    const randomFactor = pseudoRandom(seedValue);
    const dailyVariation = (randomFactor * 2 - 1) * tempVariability;
    
    // Progressive adjustment to create smoother temperature curves
    const tempWithVariation = previousTemp * 0.7 + (baseTemp + seasonalVariation + dailyVariation) * 0.3;
    previousTemp = tempWithVariation;
    
    // Calculate rainfall - more likely on colder days with some randomness
    const rainSeed = seedValue + 0.5; // Different seed for rain
    const rainModifier = pseudoRandom(rainSeed);
    const isRaining = rainModifier > (1 - rainProbability);
    
    // Rainfall amount depends on season and temperature
    let rainAmount = 0;
    if (isRaining) {
      const baseRain = Math.max(0, 20 - Math.abs(tempWithVariation - 15));
      rainAmount = Math.round(baseRain * rainModifier * 1.5);
    }
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: Math.round(tempWithVariation),
      rainfall: rainAmount,
    });
  }
  
  return data;
};

const HistoricalWeather: React.FC<HistoricalWeatherProps> = ({ location }) => {
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30">("7");
  const [dataType, setDataType] = useState<"temperature" | "rainfall">("temperature");
  
  const historicalData = generateHistoricalData(parseInt(timeRange), location);
  
  const exportData = () => {
    // Create CSV content
    const headers = ["Date", "Temperature (°C)", "Rainfall (mm)"];
    const csvContent = [
      headers.join(","),
      ...historicalData.map(item => 
        [item.date, item.temperature, item.rainfall].join(",")
      )
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `weather_history_${location.name}_${timeRange}days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          Historical Weather Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Historical data for {location.name}, {location.country}
          </p>
          <div className="flex space-x-2">
            <Select
              value={dataType}
              onValueChange={(value) => setDataType(value as "temperature" | "rainfall")}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Data Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="rainfall">Rainfall</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as "7" | "14" | "30")}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={historicalData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                unit={dataType === "temperature" ? "°C" : "mm"}
                width={40}
              />
              <Tooltip
                formatter={(value) => [
                  `${value} ${dataType === "temperature" ? "°C" : "mm"}`,
                  dataType === "temperature" ? "Temperature" : "Rainfall"
                ]}
              />
              <Area 
                type="monotone" 
                dataKey={dataType}
                stroke={dataType === "temperature" ? "#ff7c43" : "#0088fe"} 
                fill={dataType === "temperature" ? "#ff7c430f" : "#0088fe0f"} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center mt-4 gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            View Full History
          </Button>
          <Button variant="outline" size="sm" className="flex items-center" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalWeather;
