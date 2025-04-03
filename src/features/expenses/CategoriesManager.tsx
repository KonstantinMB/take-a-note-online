
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
    <div className="mb-6 bg-card rounded-lg border shadow-sm overflow-hidden">
      <motion.div 
        className="flex items-center px-4 py-3 cursor-pointer bg-muted/20 border-b" 
        onClick={() => setShowCategories(!showCategories)}
        whileHover={{ backgroundColor: "#F3F4F6" }}
      >
        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Categories</span>
        <motion.div
          animate={{ rotate: showCategories ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
            <div className="flex flex-wrap gap-2 p-4 items-center">
              {categories.map(category => (
                <div key={category.id} className="relative group">
                  <ExpenseCategoryBadge
                    name={category.name}
                    color={category.color}
                    icon={category.icon || undefined}
                    className={cn(
                      selectedCategory === category.id ? "ring-2 ring-primary/10" : "",
                      "shadow-sm"
                    )}
                    onClick={() => handleCategoryClick(category)}
                  />
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute -right-1 -top-1 h-4 w-4 rounded-full 
                              bg-background shadow-sm opacity-0 group-hover:opacity-100 
                              transition-opacity z-10 p-0"
                    onClick={(e) => handleEditClick(e, category)}
                  >
                    <Pencil className="h-2 w-2" />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2.5 rounded-full flex items-center shadow-sm bg-background"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
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
