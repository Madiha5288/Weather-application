
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileWrapperProps {
  children: React.ReactNode;
}

const MobileWrapper: React.FC<MobileWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Add mobile-specific initialization here
    if (isMobile) {
      document.body.classList.add('capacitor-app');
      
      // Apply safe area insets for notches and home indicators
      document.documentElement.style.setProperty(
        '--safe-area-inset-top', 
        'env(safe-area-inset-top)'
      );
      document.documentElement.style.setProperty(
        '--safe-area-inset-bottom', 
        'env(safe-area-inset-bottom)'
      );
    }
    
    return () => {
      document.body.classList.remove('capacitor-app');
    };
  }, [isMobile]);

  return (
    <div className={`app-container ${isMobile ? 'mobile-app' : ''}`}>
      {/* Mobile status bar spacer */}
      {isMobile && <div className="h-[var(--safe-area-inset-top)]" />}
      
      {children}
      
      {/* Mobile home indicator spacer */}
      {isMobile && <div className="h-[var(--safe-area-inset-bottom)]" />}
    </div>
  );
};

export default MobileWrapper;
