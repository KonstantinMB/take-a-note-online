
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
import ExpenseCategoryBadge from "@/components/ExpenseCategoryBadge";
import { Plus, Minus } from "lucide-react";
import * as Icons from "lucide-react";

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, icon: string) => Promise<void | boolean>;
}

const CreateCategoryDialog = ({ isOpen, onClose, onSave }: CreateCategoryDialogProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#4CAF50"); // Default green
  const [selectedIcon, setSelectedIcon] = useState("CreditCard");
  const [isSaving, setIsSaving] = useState(false);

  // Predefined colors
  const colors = [
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#FF9800", // Orange
    "#9C27B0", // Purple
    "#E91E63", // Pink
    "#F44336", // Red
    "#607D8B", // Blue Grey
  ];

  // Common icons for expenses
  const commonIcons = [
    "CreditCard", "ShoppingBag", "Utensils", "Car", 
    "Home", "Tv", "Heart", "PlusCircle", "Plane", 
    "GraduationCap", "Coffee", "Smartphone", "Gift"
  ];

  const handleSave = async () => {
    if (!newCategoryName.trim()) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(newCategoryName, newCategoryColor, selectedIcon);
      setNewCategoryName("");
    } finally {
      setIsSaving(false);
    }
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
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Color</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
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
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Icon</label>
            <div className="flex flex-wrap gap-2">
              {commonIcons.map((iconName) => {
                const IconComponent = (Icons as any)[iconName];
                return (
                  <div 
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                      selectedIcon === iconName 
                        ? "bg-gray-100 ring-2 ring-black/20" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm">Preview: </span>
            <ExpenseCategoryBadge 
              name={newCategoryName || "Category"} 
              color={newCategoryColor} 
              icon={selectedIcon} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !newCategoryName.trim()}>
            {isSaving ? "Creating..." : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
