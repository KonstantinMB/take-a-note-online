
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { LucideProps } from "lucide-react";

interface ExpenseCategoryBadgeProps {
  name: string;
  color: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

const ExpenseCategoryBadge = ({ name, color, icon, className, onClick }: ExpenseCategoryBadgeProps) => {
  // Use the correct type for Lucide icons
  const IconComponent = icon ? 
    (Icons as Record<string, React.FC<LucideProps>>)[icon as string] : 
    undefined;

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        onClick ? "cursor-pointer hover:opacity-90" : "",
        className
      )}
      style={{ backgroundColor: `${color}30`, color: color }}
      onClick={onClick}
    >
      {IconComponent && <IconComponent className="h-4 w-4 flex-shrink-0" />}
      <span className="truncate max-w-[120px]">{name}</span>
    </div>
  );
};

export default ExpenseCategoryBadge;
