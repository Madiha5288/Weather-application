
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
      <div className={`weather-animation rain ${className} relative overflow-hidden w-full h-full`}>
        {Array.from({ length: isMobile ? 30 : 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-blue-400/40 rounded-full"
            initial={{ 
              top: -20, 
              left: `${Math.random() * 100}%`,
              width: size === 'small' ? 1 : 2,
              height: size === 'small' ? 15 : 25
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
      <div className={`weather-animation snow ${className} relative overflow-hidden w-full h-full`}>
        {Array.from({ length: isMobile ? 20 : 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            initial={{ 
              top: -10, 
              left: `${Math.random() * 100}%`,
              width: size === 'small' ? 3 : 6,
              height: size === 'small' ? 3 : 6,
              opacity: 0.8
            }}
            animate={{ 
              top: '110%',
              x: Math.random() > 0.5 ? 30 : -30,
            }}
            transition={{ 
              duration: 3 + Math.random() * 5,
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
      <div className={`weather-animation sunny ${className} relative overflow-hidden w-full h-full`}>
        <motion.div 
          className="absolute top-[5%] right-[5%] sm:top-10 sm:right-10 md:top-20 md:right-20 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-yellow-300 rounded-full z-0"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.9, 0.7]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute bg-yellow-300 opacity-60"
              style={{ 
                top: '50%',
                left: '50%',
                width: size === 'small' ? '150%' : '200%',
                height: 2,
                transformOrigin: 'left center',
                transform: `rotate(${i * 45}deg) translateX(${size === 'small' ? 12 : 16}px)`,
              }}
              animate={{ 
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
        
        {/* Light rays */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute bg-yellow-100/20 origin-center"
            style={{
              width: '200%',
              height: 100 + i * 30,
              top: `${10 + i * 15}%`,
              left: '-50%',
              transform: `rotate(${i * 7}deg)`
            }}
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Animation for cloudy
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return (
      <div className={`weather-animation cloudy ${className} relative overflow-hidden w-full h-full`}>
        {[
          { x: '10%', y: '10%', size: size === 'small' ? 50 : 80, delay: 0 }, 
          { x: '30%', y: '25%', size: size === 'small' ? 70 : 100, delay: 1 }, 
          { x: '60%', y: '15%', size: size === 'small' ? 60 : 90, delay: 0.5 },
          { x: '80%', y: '30%', size: size === 'small' ? 40 : 70, delay: 1.5 },
          { x: '40%', y: '40%', size: size === 'small' ? 55 : 85, delay: 2 }
        ].map((cloud, i) => (
          <motion.div 
            key={i}
            className="absolute bg-gray-200/70 dark:bg-gray-600/70 rounded-full"
            style={{ 
              left: cloud.x, 
              top: cloud.y, 
              width: cloud.size, 
              height: cloud.size / 2,
              borderRadius: '50%'
            }}
            animate={{ 
              x: [0, 10, 0, -10, 0],
              y: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: cloud.delay,
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
      <div className={`weather-animation storm ${className} relative overflow-hidden w-full h-full`}>
        {/* Dark clouds */}
        {[
          { x: '20%', y: '15%', size: size === 'small' ? 60 : 100, delay: 0 }, 
          { x: '50%', y: '10%', size: size === 'small' ? 80 : 120, delay: 0.5 }, 
          { x: '70%', y: '20%', size: size === 'small' ? 70 : 110, delay: 1 }
        ].map((cloud, i) => (
          <motion.div 
            key={i}
            className="absolute bg-gray-700/80 rounded-full"
            style={{ 
              left: cloud.x, 
              top: cloud.y, 
              width: cloud.size, 
              height: cloud.size / 2,
              zIndex: 5
            }}
            animate={{ 
              x: [0, 10, 0, -10, 0],
            }}
            transition={{ 
              duration: 8 + i,
              repeat: Infinity,
              delay: cloud.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
        
        {/* Lightning bolts */}
        {[
          { x: '30%', y: '30%', delay: 2, duration: 0.3 },
          { x: '60%', y: '25%', delay: 4, duration: 0.4 },
          { x: '40%', y: '20%', delay: 7, duration: 0.5 }
        ].map((bolt, i) => (
          <motion.div
            key={`bolt-${i}`}
            className="absolute bg-yellow-300 z-10"
            style={{
              left: bolt.x,
              top: bolt.y,
              width: size === 'small' ? 2 : 3,
              height: size === 'small' ? 70 : 100,
              clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 50%, 0 100%, 40% 50%, 0 50%)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: bolt.duration,
              repeat: Infinity,
              repeatDelay: bolt.delay,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Rain drops under the storm */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`rain-${i}`}
            className="absolute bg-blue-400/40 rounded-full z-0"
            initial={{ 
              top: '35%', 
              left: `${Math.random() * 100}%`,
              width: 1,
              height: 15,
              opacity: 0.7
            }}
            animate={{ 
              top: '110%',
              opacity: [0.7, 0.5]
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
  
  // Animation for foggy or misty
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return (
      <div className={`weather-animation foggy ${className} relative overflow-hidden w-full h-full`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gray-300/30 dark:bg-gray-400/20 rounded-full"
            style={{
              width: '100%',
              height: 40 + i * 10,
              left: 0,
              top: `${10 + i * 12}%`,
              borderRadius: '50%'
            }}
            animate={{
              x: [0, 30, 0, -30, 0],
              opacity: [0.4, 0.3, 0.4, 0.3, 0.4]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut'
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
