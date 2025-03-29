
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Reference {
  id?: string;
  title: string;
  url: string;
  description?: string;
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (reference) {
      setTitle(reference.title);
      setUrl(reference.url);
      setDescription(reference.description || "");
    } else {
      setTitle("");
      setUrl("");
      setDescription("");
    }
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
