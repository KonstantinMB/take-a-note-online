import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit, Trash, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import CategoryBadge from "./CategoryBadge";
import { motion } from "framer-motion";

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
  index: number;
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
  onDelete,
  index 
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "note-card bg-white rounded-lg shadow-sm p-4 border border-gray-100",
        "transform transition-all duration-200 ease-in-out",
        "hover:shadow-md hover:border-gray-200",
        isHovering ? "scale-[1.02]" : "scale-100"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowDeleteConfirm(false);
      }}
      layout
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium line-clamp-1 flex-1 mr-2">{title}</h3>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovering ? 1 : 0 }}
            className="flex space-x-1"
          >
            {showDeleteConfirm ? (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
              >
                <Check className="h-4 w-4" />
              </motion.button>
            ) : (
              <>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(id)}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <Trash className="h-4 w-4" />
                </motion.button>
              </>
            )}
          </motion.div>
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
        
        <div className="text-sm text-gray-600 whitespace-pre-line min-h-[60px]">
          {truncatedContent}
        </div>
        
        <div className="mt-auto pt-2 text-xs text-gray-400 border-t border-gray-50">
          {formattedDate}
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
