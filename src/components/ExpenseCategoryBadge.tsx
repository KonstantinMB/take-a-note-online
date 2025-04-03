
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

interface ExpenseCategoryBadgeProps {
  name: string;
  color: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

const ExpenseCategoryBadge = ({ name, color, icon, className, onClick }: ExpenseCategoryBadgeProps) => {
  // Dynamically import icon from Lucide
  let IconComponent: LucideIcon | null = null;
  
  if (icon && typeof icon === 'string' && icon in Icons) {
    IconComponent = (Icons as Record<string, LucideIcon>)[icon];
  }

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-all",
        onClick ? "cursor-pointer hover:opacity-90" : "",
        className
      )}
      style={{ backgroundColor: `${color}40`, color: color }}
      onClick={onClick}
    >
      {IconComponent && <IconComponent className="h-3.5 w-3.5 flex-shrink-0" />}
      <span className="truncate max-w-[120px]">{name}</span>
    </div>
  );
};

export default ExpenseCategoryBadge;
