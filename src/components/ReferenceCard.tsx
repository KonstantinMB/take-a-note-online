
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Edit, Trash, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReferenceCardProps {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ReferenceCard = ({
  id,
  title,
  url,
  description,
  createdAt,
  onEdit,
  onDelete,
  index
}: ReferenceCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  const truncatedDescription = description && description.length > 120
    ? description.substring(0, 120) + "..."
    : description;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (showDeleteConfirm) {
      onDelete(id);
    } else {
      setShowDeleteConfirm(true);
    }
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };
  
  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "bg-white rounded-lg shadow-sm p-4 border border-gray-100",
        "transform transition-all duration-200 ease-in-out",
        "hover:shadow-md hover:border-gray-200 cursor-pointer",
        isHovering ? "scale-[1.02]" : "scale-100"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setShowDeleteConfirm(false);
      }}
      onClick={() => onEdit(id)}
      layout
    >
      <div className="flex flex-col gap-2">
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
                  onClick={handleOpenLink}
                  className="p-1.5 rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
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
        
        <div className="text-xs text-blue-600 truncate hover:underline">
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {url}
          </a>
        </div>
        
        {truncatedDescription && (
          <div className="text-sm text-gray-600">
            {truncatedDescription}
          </div>
        )}
        
        <div className="mt-auto pt-2 text-xs text-gray-400 border-t border-gray-50">
          {formattedDate}
        </div>
      </div>
    </motion.div>
  );
};

export default ReferenceCard;
