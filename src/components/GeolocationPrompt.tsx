
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface GeolocationPromptProps {
  onManualSearch: () => void;
  onRetryGeolocation: () => void;
  error?: string;
}

const GeolocationPrompt: React.FC<GeolocationPromptProps> = ({ 
  onManualSearch, 
  onRetryGeolocation,
  error 
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Location Access</CardTitle>
        </div>
        <CardDescription>
          We need location access to show you the most accurate weather information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {error || "Location services are not available or permission was denied."}
        </p>
        <p className="text-sm">
          You can either try again or manually search for your city.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onManualSearch}>
          Manual Search
        </Button>
        <Button onClick={onRetryGeolocation}>
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeolocationPrompt;
