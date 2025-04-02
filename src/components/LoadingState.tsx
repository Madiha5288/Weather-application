
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <LoaderCircle className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Loading weather data...</p>
        <p className="text-sm text-muted-foreground">Please wait while we fetch the latest information</p>
      </div>
      
      {/* Current Weather Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-32 mt-2" />
                </div>
              </div>
              
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-10 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Hourly Forecast Skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 min-w-[80px]">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Forecast Skeleton */}
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <Skeleton className="h-5 w-20" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24 hidden md:inline-block" />
                </div>
                <div className="flex items-center space-x-3 ml-auto">
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingState;
