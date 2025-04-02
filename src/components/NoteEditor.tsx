
import { useState, useEffect, KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryBadge from "./CategoryBadge";
import { Plus } from "lucide-react";
import CreateCategoryDialog from "@/features/notes/CreateCategoryDialog";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id?: string;
  title: string;
  content: string;
  category?: string | null;
}

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  note?: Note;
  categories: Category[];
  onCreateCategory?: (name: string, color: string) => Promise<boolean>;
}

const NoteEditor = ({ isOpen, onClose, onSave, note, categories = [], onCreateCategory }: NoteEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedCategory(note.category || null);
    } else {
      setTitle("");
      setContent("");
      setSelectedCategory(null);
    }
  }, [note, isOpen, categories]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please add a title to your note");
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        id: note?.id,
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
      });
      
      toast.success(note?.id ? "Note updated" : "Note created");
      onClose();
    } catch (error) {
      toast.error("Failed to save note");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleCreateCategory = async (name: string, color: string) => {
    if (onCreateCategory) {
      const success = await onCreateCategory(name, color);
      if (success) {
        setIsNewCategoryOpen(false);
      }
    }
  };

  // Find the selected category object
  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-medium text-center">
              {note?.id ? "Edit Note" : "Create Note"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="text-lg font-medium px-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Category</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => setIsNewCategoryOpen(true)}
                >
                  <Plus className="h-3 w-3" /> New Category
                </Button>
              </div>
              <Select
                value={selectedCategory || undefined}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200">
                  <SelectValue>
                    {currentCategory ? (
                      <div className="flex items-center">
                        <CategoryBadge name={currentCategory.name} color={currentCategory.color} />
                      </div>
                    ) : (
                      "Select a category"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">
                    <div className="flex items-center">
                      <CategoryBadge name="General" color="#F1F0FB" />
                    </div>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <CategoryBadge name={category.name} color={category.color} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write your note here... (Cmd+Enter or Ctrl+Enter to save)"
                className="min-h-[200px] resize-none border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <DialogFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateCategoryDialog 
        isOpen={isNewCategoryOpen}
        onClose={() => setIsNewCategoryOpen(false)}
        onSave={handleCreateCategory}
      />
    </>
  );
};

export default NoteEditor;
