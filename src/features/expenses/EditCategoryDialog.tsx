
import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

interface EditCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, color: string, icon: string) => Promise<void | boolean>;
  category: Category | null;
}

const EditCategoryDialog = ({ isOpen, onClose, onSave, category }: EditCategoryDialogProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#4CAF50"); // Default green
  const [selectedIcon, setSelectedIcon] = useState("CreditCard");
  const [isSaving, setIsSaving] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);

  // Expanded predefined colors for more options
  const colors = [
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#FF9800", // Orange
    "#9C27B0", // Purple
    "#E91E63", // Pink
    "#F44336", // Red
    "#607D8B", // Blue Grey
    "#009688", // Teal
    "#673AB7", // Deep Purple
    "#3F51B5", // Indigo
    "#795548", // Brown
    "#FFC107", // Amber
    "#00BCD4", // Cyan
  ];

  // All available icons for expenses
  const allIcons = [
    "CreditCard", "ShoppingBag", "Utensils", "Car", 
    "Home", "Tv", "Heart", "PlusCircle", "Plane", 
    "GraduationCap", "Coffee", "Smartphone", "Gift",
    "Film", "Music", "Briefcase", "Book", "Wifi",
    "ShoppingCart", "DollarSign", "Droplet", "PiggyBank",
    "Zap", "Tag", "Bus", "Train", "Truck", "Key",
    "Gamepad2", "Package", "ShoppingBasket", "Scissors",
    "Wine", "Baby", "Dog", "Cat", "Shirt", "Syringe",
    "Pill", "FirstAid", "Building", "Building2", "Hotel",
    "Palm", "Backpack", "Wallet", "UtensilsCrossed"
  ];

  // Set initial state when category changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setCategoryColor(category.color);
      setSelectedIcon(category.icon || "CreditCard");
    }
  }, [category]);

  // Filter icons based on search term
  useEffect(() => {
    if (!iconSearchTerm) {
      setFilteredIcons(allIcons.slice(0, 24)); // Show first 24 icons by default
      return;
    }
    
    const filtered = allIcons.filter(icon => 
      icon.toLowerCase().includes(iconSearchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
  }, [iconSearchTerm]);

  const handleSave = async () => {
    if (!categoryName.trim() || !category) {
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(category.id, categoryName, categoryColor, selectedIcon);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name
            </label>
            <Input
              id="name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
                  onClick={() => setCategoryColor(color)}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                    categoryColor === color ? "ring-2 ring-black/20 scale-110" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Icon</label>
            <Input
              placeholder="Search icons..."
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
              className="mb-2"
            />
            <ScrollArea className="h-[180px]">
              <div className="flex flex-wrap gap-2">
                {filteredIcons.length > 0 ? (
                  filteredIcons.map((iconName) => {
                    const IconComponent = (Icons as any)[iconName];
                    return IconComponent ? (
                      <div 
                        key={iconName}
                        onClick={() => setSelectedIcon(iconName)}
                        title={iconName}
                        className={`w-10 h-10 rounded-md flex items-center justify-center cursor-pointer transition-all ${
                          selectedIcon === iconName 
                            ? "bg-gray-100 ring-2 ring-black/20" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="w-full text-center py-4 text-muted-foreground">
                    No icons match your search
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="mt-2">
            <span className="text-sm">Preview: </span>
            <ExpenseCategoryBadge 
              name={categoryName || "Category"} 
              color={categoryColor} 
              icon={selectedIcon} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !categoryName.trim()}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
