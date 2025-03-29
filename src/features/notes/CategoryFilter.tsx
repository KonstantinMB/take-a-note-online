
import { useState } from "react";
import { Tag, ChevronRight, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/CategoryBadge";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onCreateCategory: () => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
}: CategoryFilterProps) => {
  const [showCategories, setShowCategories] = useState(false);

  const clearCategoryFilter = () => {
    onSelectCategory(null);
  };

  return (
    <div className="mb-6">
      <motion.div 
        className="flex items-center mb-2 cursor-pointer bg-gray-50 p-2 rounded-lg" 
        onClick={() => setShowCategories(!showCategories)}
        whileHover={{ backgroundColor: "#F3F4F6" }}
      >
        <Tag className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Categories</span>
        <motion.div
          animate={{ rotate: showCategories ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4 ml-1 text-gray-500" />
        </motion.div>
        
        {selectedCategory && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              clearCategoryFilter();
            }} 
            className="ml-2 h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filter
          </Button>
        )}
      </motion.div>
      
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 ml-6 mt-2 mb-2">
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CategoryBadge
                    name={category.name}
                    color={category.color}
                    className={selectedCategory === category.id ? "ring-2 ring-black/20" : "opacity-80 hover:opacity-100"}
                    onClick={() => onSelectCategory(selectedCategory === category.id ? null : category.id)}
                  />
                </motion.div>
              ))}
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateCategory();
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryFilter;
