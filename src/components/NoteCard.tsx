
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit, Trash, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CategoryBadge from "./CategoryBadge";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category?: string | null;
  categoryColor?: string;
  categoryName?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({ 
  id, 
  title, 
  content, 
  createdAt, 
  category, 
  categoryColor = "#9b87f5", 
  categoryName = "General",
  onEdit, 
  onDelete 
}: NoteCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const truncatedContent = content.length > 180
    ? content.substring(0, 180) + "..."
    : content;
    
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(id);
    } else {
      setShowDeleteConfirm(true);
    }
  };
  
  return (
    <div 
      className={cn(
        "note-card hover-effect",
        isHovering ? "ring-1 ring-black/10" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowDeleteConfirm(false);
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-1">{title}</h3>
          
          <div className={cn(
            "flex space-x-1 transition-opacity duration-200",
            isHovering ? "opacity-100" : "opacity-0"
          )}>
            {showDeleteConfirm ? (
              <button 
                onClick={handleDelete}
                className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              >
                <Check className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onEdit(id)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Category badge */}
        {categoryName && (
          <div className="mb-1">
            <CategoryBadge 
              name={categoryName} 
              color={categoryColor} 
            />
          </div>
        )}
        
        <div className="text-sm text-gray-600 whitespace-pre-line">
          {truncatedContent}
        </div>
        
        <div className="mt-auto pt-2 text-xs text-gray-400">
          {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
