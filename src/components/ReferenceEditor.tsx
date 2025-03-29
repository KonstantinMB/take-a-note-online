
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Reference {
  id?: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}

interface ReferenceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reference: Reference) => void;
  reference?: Reference;
}

const ReferenceEditor = ({ isOpen, onClose, onSave, reference }: ReferenceEditorProps) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (reference) {
      setTitle(reference.title);
      setUrl(reference.url);
      setDescription(reference.description || "");
      setTags(reference.tags || []);
    } else {
      setTitle("");
      setUrl("");
      setDescription("");
      setTags([]);
    }
    setTagInput("");
  }, [reference, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (!url.trim()) {
      toast.error("Please add a URL");
      return;
    }

    try {
      // Simple URL validation
      new URL(url); // Will throw if invalid
      
      setIsSaving(true);
      await onSave({
        id: reference?.id,
        title: title.trim(),
        url: url.trim(),
        description: description.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
      
      onClose();
    } catch (error) {
      if (error instanceof TypeError) {
        toast.error("Please enter a valid URL (including http:// or https://)");
      } else {
        toast.error("Failed to save reference");
        console.error(error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-medium text-center">
            {reference?.id ? "Edit Reference" : "Add Reference"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 flex flex-col gap-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reference title"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL *
            </label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this reference important?"
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <div className="flex">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                className="ml-2"
                variant="outline"
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <AnimatePresence>
              {tags.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Reference"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferenceEditor;
