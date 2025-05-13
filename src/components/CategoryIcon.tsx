
import React, { Suspense, lazy } from 'react';
import { 
  Utensils, Car, ShoppingCart, Home, Smile, Wifi, 
  Gift, Heart, Shirt, Activity, Landmark, Folder,
  Briefcase, TrendingUp, Award, LucideIcon, Flower, SoapDispenserDroplet,
  Loader
} from 'lucide-react';
import { dynamicIconImports } from 'lucide-react/dynamicIconImports';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

// Static icons that we use frequently
const staticIconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  'shopping-cart': ShoppingCart,
  home: Home,
  smile: Smile,
  wifi: Wifi,
  gift: Gift,
  heart: Heart,
  shirt: Shirt,
  'activity': Activity,
  landmark: Landmark,
  folder: Folder,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  award: Award,
  flower: Flower,
  'soap-dispenser-droplet': SoapDispenserDroplet,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className, size = 20 }) => {
  // First check if we have this icon in our static map for faster loading
  if (staticIconMap[iconName]) {
    const Icon = staticIconMap[iconName];
    return <Icon className={className} size={size} />;
  }
  
  // If the icon name is in the dynamicIconImports, load it dynamically
  if (dynamicIconImports[iconName]) {
    const DynamicIcon = lazy(() => {
      return dynamicIconImports[iconName]().then((mod) => ({ 
        default: mod.default
      }));
    });
    
    return (
      <Suspense fallback={<Loader className={`animate-spin ${className}`} size={size} />}>
        <DynamicIcon className={className} size={size} />
      </Suspense>
    );
  }
  
  // Fallback to Folder icon if not found
  return <Folder className={className} size={size} />;
};

export default CategoryIcon;
