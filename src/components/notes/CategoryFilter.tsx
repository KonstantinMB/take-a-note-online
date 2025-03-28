
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  onAddCategory: () => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddCategory
}: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto hover:bg-transparent"
          onClick={toggleExpand}
        >
          <div className="flex items-center text-sm font-medium text-gray-700">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1" />
            )}
            Categories
          </div>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto hover:bg-gray-100 rounded-full"
          onClick={onAddCategory}
        >
          <Plus className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {isExpanded && (
        <ScrollArea className="max-h-36">
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={`cursor-pointer hover:bg-gray-100 ${
                selectedCategory === null ? "bg-gray-100 border-gray-300" : ""
              }`}
              style={{ backgroundColor: selectedCategory === null ? "#f3f4f6" : undefined }}
              onClick={() => handleCategoryClick(null)}
            >
              All
            </Badge>
            
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className={`cursor-pointer hover:opacity-90 ${
                  selectedCategory === category.id ? "border-gray-300" : ""
                }`}
                style={{
                  backgroundColor: category.color,
                  color: "#444",
                  borderColor: selectedCategory === category.id ? "#d1d5db" : "transparent"
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CategoryFilter;
