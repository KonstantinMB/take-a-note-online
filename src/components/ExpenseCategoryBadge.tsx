
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface ExpenseCategoryBadgeProps {
  name: string;
  color: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

const ExpenseCategoryBadge = ({ name, color, icon, className, onClick }: ExpenseCategoryBadgeProps) => {
  // Use type assertion to access icons by name
  const IconComponent = icon 
    ? (LucideIcons as Record<string, React.ComponentType<LucideProps>>)[icon] 
    : undefined;
    
  // Create a softer background color by adding transparency
  const bgColor = `${color}15`; // 15% opacity

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-all",
        onClick ? "cursor-pointer hover:opacity-90 hover:shadow-sm" : "",
        className
      )}
      style={{ backgroundColor: bgColor, color: color }}
      onClick={onClick}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />}
      <span className="truncate max-w-[120px]">{name}</span>
    </div>
  );
};

export default ExpenseCategoryBadge;
