
import React from "react";
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudHail 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  iconName: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className }) => {
  const iconClassName = cn("text-foreground", className);
  
  switch (iconName) {
    case "sun":
      return <Sun className={iconClassName} />;
    case "moon":
      return <Moon className={iconClassName} />;
    case "cloud":
      return <Cloud className={iconClassName} />;
    case "cloud-sun":
      return <CloudSun className={iconClassName} />;
    case "cloud-moon":
      return <CloudMoon className={iconClassName} />;
    case "cloud-fog":
      return <CloudFog className={iconClassName} />;
    case "cloud-drizzle":
      return <CloudDrizzle className={iconClassName} />;
    case "cloud-rain":
      return <CloudRain className={iconClassName} />;
    case "cloud-snow":
      return <CloudSnow className={iconClassName} />;
    case "cloud-lightning":
      return <CloudLightning className={iconClassName} />;
    case "cloud-hail":
      return <CloudHail className={iconClassName} />;
    default:
      return <Sun className={iconClassName} />;
  }
};

export default WeatherIcon;
