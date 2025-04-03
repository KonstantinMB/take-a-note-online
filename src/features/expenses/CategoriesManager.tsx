import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tag, ChevronRight, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExpenseCategoryBadge from "@/components/ExpenseCategoryBadge";
import { motion, AnimatePresence } from "framer-motion";
import CreateCategoryDialog from "./CreateCategoryDialog";
import EditCategoryDialog from "./EditCategoryDialog";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

interface CategoriesManagerProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  refreshTrigger: number;
  onCategoryUpdated: () => void;
}

const CategoriesManager = ({ 
  selectedCategory, 
  onSelectCategory, 
  refreshTrigger,
  onCategoryUpdated
}: CategoriesManagerProps) => {
  const [showCategories, setShowCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("expense_categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, [user, refreshTrigger]);

  const handleCreateCategory = async (name: string, color: string, icon: string) => {
    if (!user) {
      toast.error("You must be logged in to create categories");
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("expense_categories")
        .insert({
          name: name.trim(),
          color: color,
          icon: icon,
          user_id: user.id
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(prev => [...prev, data[0]]);
        toast.success("Category created");
        onCategoryUpdated();
        setIsCreateDialogOpen(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      return false;
    }
  };

  const handleEditCategory = async (id: string, name: string, color: string, icon: string) => {
    if (!user) {
      toast.error("You must be logged in to edit categories");
      return false;
    }

    try {
      const { error } = await supabase
        .from("expense_categories")
        .update({
          name: name.trim(),
          color: color,
          icon: icon
        })
        .eq("id", id);

      if (error) throw error;

      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, name, color, icon } : cat
      ));
      
      toast.success("Category updated");
      onCategoryUpdated();
      setIsEditDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
      return false;
    }
  };

  const clearCategoryFilter = () => {
    onSelectCategory(null);
  };

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(selectedCategory === category.id ? null : category.id);
  };

  const handleEditClick = (e: React.MouseEvent, category: Category) => {
    e.stopPropagation();
    setCategoryToEdit(category);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="mb-6">
      <motion.div 
        className="flex items-center mb-3 cursor-pointer bg-gray-50 p-3 rounded-lg" 
        onClick={() => setShowCategories(!showCategories)}
        whileHover={{ backgroundColor: "#F3F4F6" }}
      >
        <Tag className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Categories</span>
        <motion.div
          animate={{ rotate: showCategories ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronRight className="h-4 w-4 text-gray-500" />
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
            <div className="flex flex-wrap gap-3 ml-6 my-3 items-center">
              {categories.map(category => (
                <div key={category.id} className="relative group py-1 px-1">
                  <ExpenseCategoryBadge
                    name={category.name}
                    color={category.color}
                    icon={category.icon || undefined}
                    className={cn(
                      selectedCategory === category.id ? "ring-2 ring-black/20" : "",
                    )}
                    onClick={() => handleCategoryClick(category)}
                  />
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -right-2 -top-2 h-5 w-5 rounded-full 
                              bg-white shadow-sm opacity-0 group-hover:opacity-100 
                              transition-opacity z-10 border p-0"
                    onClick={(e) => handleEditClick(e, category)}
                  >
                    <Pencil className="h-2.5 w-2.5" />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 rounded-full flex items-center"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateCategoryDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateCategory}
      />

      <EditCategoryDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditCategory}
        category={categoryToEdit}
      />
    </div>
  );
};

export default CategoriesManager;
