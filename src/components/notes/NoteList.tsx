
import { ScrollArea } from "@/components/ui/scroll-area";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  category: string | null;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  getCategoryInfo: (categoryId: string | null) => { name: string; color: string };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNote: () => void;
}

const NoteList = ({
  notes,
  isLoading,
  searchQuery,
  selectedCategory,
  getCategoryInfo,
  onEdit,
  onDelete,
  onCreateNote
}: NoteListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-gray-400">Loading notes...</div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-8 w-8" />}
        title={searchQuery || selectedCategory ? "No matching notes found" : "No notes yet"}
        description={
          searchQuery || selectedCategory
            ? "Try adjusting your search query or category filter."
            : "Create your first note to get started."
        }
        action={
          <Button onClick={onCreateNote} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        }
        className="py-20"
      />
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => {
          const { name, color } = getCategoryInfo(note.category);
          return (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              createdAt={note.created_at}
              category={note.category}
              categoryName={name}
              categoryColor={color}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default NoteList;
