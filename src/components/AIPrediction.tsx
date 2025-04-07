
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Lightbulb, Brain, Thermometer, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Sun } from 'lucide-react';
import { WeatherPrediction, predictWeather, createModel } from '@/services/weatherModel';
import { CurrentWeather } from '@/services/weatherApi';
import { Skeleton } from '@/components/ui/skeleton';

interface AIPredictionProps {
  currentWeather: CurrentWeather;
}

const AIPrediction: React.FC<AIPredictionProps> = ({ currentWeather }) => {
  const [prediction, setPrediction] = useState<WeatherPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAndPredict = async () => {
      setIsLoading(true);
      
      // Initialize model
      await createModel();
      
      // Generate prediction if component is still mounted
      if (isMounted && currentWeather) {
        const weatherPrediction = await predictWeather(currentWeather);
        setPrediction(weatherPrediction);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };
    
    initializeAndPredict();
    
    // Clean up
    return () => {
      isMounted = false;
    };
  }, [currentWeather]);

  // Helper to get appropriate icon based on prediction
  const getPredictionIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rain':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'storm':
        return <CloudLightning className="h-5 w-5 text-purple-500" />;
      case 'snow':
        return <CloudSnow className="h-5 w-5 text-blue-300" />;
      case 'fog':
        return <CloudFog className="h-5 w-5 text-gray-400" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-primary" />
          <CardTitle>AI Weather Prediction</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : prediction ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium">24-Hour Forecast</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Confidence: {prediction.confidence}%
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Predicted Temperature:</span>
              <span>{prediction.predictedTemp}°C</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getPredictionIcon(prediction.predictedCondition)}
              <span className="font-medium">Predicted Condition:</span>
              <span className="capitalize">{prediction.predictedCondition}</span>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Prediction based on {prediction.basedOn}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>AI prediction model is not available.</p>
            <p className="text-sm">Using traditional forecasting instead.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPrediction;
