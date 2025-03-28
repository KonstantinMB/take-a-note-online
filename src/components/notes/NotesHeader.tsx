
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotesHeaderProps {
  onCreateNote: () => void;
}

const NotesHeader = ({ onCreateNote }: NotesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Notes</h1>
      <Button onClick={onCreateNote} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        New Note
      </Button>
    </div>
  );
};

export default NotesHeader;
