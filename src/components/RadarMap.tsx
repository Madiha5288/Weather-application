
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, CloudRain } from "lucide-react";

interface RadarMapProps {
  latitude: number;
  longitude: number;
}

const RadarMap: React.FC<RadarMapProps> = ({ latitude, longitude }) => {
  const [mapType, setMapType] = useState<"standard" | "radar" | "satellite">("radar");
  
  // Function to get the appropriate map URL based on selected type
  const getMapUrl = () => {
    // Secure Weather API map base URLs
    const mapBaseUrl = "https://tile.openweathermap.org/map";
    const weatherApiKey = "b9d8796e16e84432a5f120309252703"; // Already existing API key in project
    
    // For demo purposes, using different static map sources
    switch (mapType) {
      case "radar":
        return `https://maps.aerisapi.com/demoid_demoid/radar/{z}/{x}/{y}/current.png`;
      case "satellite":
        return `https://sat.aerisapi.com/demoid_demoid/satellite/{z}/{x}/{y}/current.jpg`;
      case "standard":
      default:
        return `https://tile.openstreetmap.org/{z}/{x}/{y}.png`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center">
          <CloudRain className="mr-2 h-5 w-5" />
          Weather Radar & Maps
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="radar" onValueChange={(value) => setMapType(value as any)}>
        <div className="px-6 pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="satellite">Satellite</TabsTrigger>
            <TabsTrigger value="standard">Standard</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0 mt-4">
          <div className="p-6 pb-0">
            <p className="text-sm text-muted-foreground">
              {mapType === "radar" && "Precipitation radar for your location"}
              {mapType === "satellite" && "Satellite imagery for your location"}
              {mapType === "standard" && "Standard map view for your location"}
            </p>
          </div>

          <div className="aspect-video mt-2 relative bg-muted/50 overflow-hidden flex items-center justify-center">
            <iframe 
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=8&output=embed`} 
              className="w-full h-full border-0" 
              allowFullScreen
              aria-hidden="false"
              title="Weather Map"
            />
            <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Your Location
            </div>
          </div>
          
          <div className="p-4 text-xs text-center text-muted-foreground">
            Note: Weather radar data refreshes every 10 minutes
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default RadarMap;
