
import React from 'react';
import { 
  Utensils, Car, ShoppingCart, Home, Smile, Wifi, 
  Gift, Heart, Shirt, Activity, Landmark, Folder,
  Briefcase, TrendingUp, Award, LucideIcon, Flower, SoapDispenserDroplet,
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  car: Car,
  'shopping-cart': ShoppingCart,
  home: Home,
  smile: Smile,
  wifi: Wifi,
  gift: Gift,
  heart: Heart,
  shirt: Shirt,
  'activity': Activity, // Changed from 'first-aid' to 'activity'
  landmark: Landmark,
  folder: Folder,
  briefcase: Briefcase,
  'trending-up': TrendingUp,
  award: Award,
  flower: Flower,
  'soap-dispenser-droplet': SoapDispenserDroplet,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className, size = 20 }) => {
  const Icon = iconMap[iconName] || Folder;
  return <Icon className={className} size={size} />;
};

export default CategoryIcon;
