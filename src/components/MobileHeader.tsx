
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkStatus } from '@/hooks/use-network';
import { WifiOff, Signal, Battery } from 'lucide-react';

const MobileHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const isOnline = useNetworkStatus();
  
  if (!isMobile) {
    return null;
  }
  
  return (
    <div className="mobile-header bg-background/80 backdrop-blur-md px-4 py-2 fixed top-0 left-0 right-0 z-10 border-b">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Weather Application</div>
        <div className="flex items-center space-x-2">
          {!isOnline && <WifiOff className="h-4 w-4 text-red-500" />}
          <Signal className="h-4 w-4" />
          <Battery className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
