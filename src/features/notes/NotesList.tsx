
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

interface NotesListProps {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  categories: Category[];
  onEditNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onCreateNote: () => void;
}

const NotesList = ({
  filteredNotes,
  isLoading,
  searchQuery,
  selectedCategory,
  onEditNote,
  onDeleteNote,
  onCreateNote,
}: NotesListProps) => {
  
  const getCategoryInfo = (categoryId: string | null, categories: Category[]) => {
    if (!categoryId) return { name: "General", color: "#9b87f5" };
    
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || "General",
      color: category?.color || "#9b87f5"
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400"
        >
          Loading notes...
        </motion.div>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
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
      </motion.div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
        <AnimatePresence>
          {filteredNotes.map((note, index) => {
            const { name, color } = getCategoryInfo(note.category, []);
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
                onEdit={onEditNote}
                onDelete={onDeleteNote}
                index={index}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
};

export default NotesList;
