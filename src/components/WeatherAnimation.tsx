
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherAnimationProps {
  condition: string;
  className?: string;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ condition, className = '' }) => {
  const isMobile = useIsMobile();
  const conditionLower = condition.toLowerCase();
  const size = isMobile ? 'small' : 'normal';
  
  // Animation for rain
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return (
      <div className={`weather-animation rain ${className} relative overflow-hidden`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400/30 rounded-full"
            initial={{ 
              top: -10, 
              left: `${Math.random() * 100}%`,
              width: size === 'small' ? 1 : 2,
              height: size === 'small' ? 10 : 15
            }}
            animate={{ 
              top: '110%',
            }}
            transition={{ 
              duration: 1 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Animation for snow
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    return (
      <div className={`weather-animation snow ${className} relative overflow-hidden`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            initial={{ 
              top: -10, 
              left: `${Math.random() * 100}%`,
              width: size === 'small' ? 3 : 5,
              height: size === 'small' ? 3 : 5,
              opacity: 0.7
            }}
            animate={{ 
              top: '110%',
              x: Math.random() > 0.5 ? 20 : -20,
            }}
            transition={{ 
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Animation for sunny/clear
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return (
      <div className={`weather-animation sunny ${className} relative overflow-hidden`}>
        <motion.div 
          className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-12 h-1 bg-yellow-300"
              style={{ 
                top: '50%',
                left: '50%',
                transformOrigin: 'left center',
                transform: `rotate(${i * 45}deg) translateX(8px)`,
              }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }
  
  // Animation for cloudy
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return (
      <div className={`weather-animation cloudy ${className} relative overflow-hidden`}>
        {[{ x: '10%', y: '30%', size: size === 'small' ? 25 : 40 }, 
          { x: '30%', y: '20%', size: size === 'small' ? 35 : 60 }, 
          { x: '60%', y: '40%', size: size === 'small' ? 30 : 50 }].map((cloud, i) => (
          <motion.div 
            key={i}
            className="absolute bg-gray-200 dark:bg-gray-600 rounded-full"
            style={{ 
              left: cloud.x, 
              top: cloud.y, 
              width: cloud.size, 
              height: cloud.size / 2
            }}
            animate={{ 
              x: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Animation for thunderstorm
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return (
      <div className={`weather-animation storm ${className} relative overflow-hidden`}>
        {/* Cloud base */}
        <div className="absolute w-20 h-10 bg-gray-600 rounded-full left-[40%] top-[30%]" />
        
        {/* Lightning bolts */}
        {[1, 2].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-12 bg-yellow-300 origin-top"
            style={{
              left: `${40 + i * 15}%`,
              top: '40%',
              zIndex: 10,
              clipPath: 'polygon(0 0, 100% 0, 80% 50%, 100% 50%, 0 100%, 20% 50%, 0 50%)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2 + i * 1.5,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Rain drops under the storm */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute bg-blue-400/30 rounded-full"
            initial={{ 
              top: '50%', 
              left: `${30 + Math.random() * 40}%`,
              width: 2,
              height: 10
            }}
            animate={{ 
              top: '110%',
              opacity: [1, 0.7]
            }}
            transition={{ 
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Default: no animation
  return null;
};

export default WeatherAnimation;
