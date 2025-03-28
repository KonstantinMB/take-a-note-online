
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
  color: string;
  className?: string;
  onClick?: () => void;
}

const CategoryBadge = ({ name, color, className, onClick }: CategoryBadgeProps) => {
  return (
    <Badge 
      className={cn(
        "cursor-pointer transition-all hover:scale-105",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
      onClick={onClick}
      style={{ 
        backgroundColor: color,
        color: isLightColor(color) ? '#000' : '#fff'
      }}
    >
      {name}
    </Badge>
  );
};

// Helper function to determine if text should be dark or light based on background color
const isLightColor = (hexColor: string): boolean => {
  // Remove the # if it exists
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return true if the color is light, false if it's dark
  return brightness > 125;
};

export default CategoryBadge;
