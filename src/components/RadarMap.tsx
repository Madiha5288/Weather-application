
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, CloudRain, Radar, Satellite, Map } from "lucide-react";

interface RadarMapProps {
  latitude: number;
  longitude: number;
}

const RadarMap: React.FC<RadarMapProps> = ({ latitude, longitude }) => {
  const [mapType, setMapType] = useState<"standard" | "radar" | "satellite">("radar");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Generate appropriate map URL based on selected type
  const getMapUrl = () => {
    switch (mapType) {
      case "radar":
        return `https://www.rainviewer.com/map.html?loc=${latitude},${longitude},6&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=0&rmt=1&c=1&o=83&lm=0&th=0&sm=0&sn=1`;
      case "satellite":
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1617547244789!5m2!1sen!2sus`;
      case "standard":
      default:
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1617547244789!5m2!1sen!2sus`;
    }
  };

  useEffect(() => {
    // Update iframe src when mapType changes
    if (iframeRef.current) {
      iframeRef.current.src = getMapUrl();
    }
  }, [mapType, latitude, longitude]);

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
            <TabsTrigger value="radar" className="flex items-center justify-center">
              <Radar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="satellite" className="flex items-center justify-center">
              <Satellite className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Satellite</span>
            </TabsTrigger>
            <TabsTrigger value="standard" className="flex items-center justify-center">
              <Map className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Standard</span>
            </TabsTrigger>
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
              ref={iframeRef}
              src={getMapUrl()}
              className="w-full h-full border-0" 
              allowFullScreen
              aria-hidden="false"
              title="Weather Map"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Your Location
            </div>
          </div>
          
          <div className="p-4 text-xs text-center text-muted-foreground">
            {mapType === "radar" 
              ? "Radar data refreshes every 10 minutes" 
              : "Map data provided by Google Maps"}
          </div>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default RadarMap;
