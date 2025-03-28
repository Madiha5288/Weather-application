
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface HistoricalWeatherProps {
  location: {
    name: string;
    country: string;
  };
}

// Demo data for historical temperatures
const generateHistoricalData = (daysAgo: number) => {
  const data = [];
  const today = new Date();
  
  for (let i = daysAgo; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random but somewhat realistic temperature data
    const baseTemp = 22; // Base temperature
    const seasonalVariation = Math.sin((date.getMonth() + 1) / 12 * Math.PI * 2) * 10;
    const dailyVariation = Math.random() * 5 - 2.5;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: Math.round(baseTemp + seasonalVariation + dailyVariation),
      rainfall: Math.round(Math.random() * 15),
    });
  }
  
  return data;
};

const HistoricalWeather: React.FC<HistoricalWeatherProps> = ({ location }) => {
  const [timeRange, setTimeRange] = useState<"7" | "14" | "30">("7");
  const [dataType, setDataType] = useState<"temperature" | "rainfall">("temperature");
  
  const historicalData = generateHistoricalData(parseInt(timeRange));
  
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
        
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            View Full History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalWeather;
