
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { WifiOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NetworkErrorProps {
  onRetry?: () => void;
  message?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({ 
  onRetry, 
  message = "There seems to be a network problem. Please check your internet connection and try again." 
}) => {
  return (
    <Alert className="mb-6">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Connection Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="self-end">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default NetworkError;
