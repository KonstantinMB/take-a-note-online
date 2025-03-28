
import { useState } from "react";
import { Tag, ChevronRight, ChevronDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryBadge from "@/components/CategoryBadge";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  onAddCategoryClick: () => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddCategoryClick
}: CategoryFilterProps) => {
  const [showCategories, setShowCategories] = useState(false);

  const clearCategoryFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(null);
  };

  return (
    <div className="mb-6">
      <div 
        className="flex items-center mb-2 cursor-pointer" 
        onClick={() => setShowCategories(!showCategories)}
      >
        <Tag className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Categories</span>
        {showCategories ? (
          <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 ml-1 text-gray-500" />
        )}
        
        {selectedCategory && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCategoryFilter} 
            className="ml-2 h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filter
          </Button>
        )}
      </div>
      
      {showCategories && (
        <div className="flex flex-wrap gap-2 ml-6 mt-2 mb-2">
          {categories.map(category => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              color={category.color}
              className={selectedCategory === category.id ? "ring-2 ring-black/20" : "opacity-80 hover:opacity-100"}
              onClick={() => setSelectedCategory(prev => prev === category.id ? null : category.id)}
            />
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 rounded-full"
            onClick={onAddCategoryClick}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
