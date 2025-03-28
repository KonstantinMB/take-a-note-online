
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryBadge from "@/components/CategoryBadge";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, color: string) => Promise<void>;
  softColors: string[];
}

const CategoryDialog = ({
  isOpen,
  onClose,
  onCreateCategory,
  softColors
}: CategoryDialogProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#D3E4FD"); // Default soft blue

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    await onCreateCategory(newCategoryName, newCategoryColor);
    setNewCategoryName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name
            </label>
            <Input
              id="name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Select Color
            </label>
            <div className="flex flex-wrap gap-2">
              {softColors.map((color) => (
                <div 
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                    newCategoryColor === color ? "ring-2 ring-black/20 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full" 
                style={{ backgroundColor: newCategoryColor }} 
              />
              <span className="text-sm">Preview: </span>
              <CategoryBadge name={newCategoryName || "Category"} color={newCategoryColor} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateCategory}>
            Create Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
