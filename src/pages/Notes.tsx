
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NoteEditor from "@/components/NoteEditor";
import ConfettiEffect from "@/components/ConfettiEffect";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/features/notes/SearchBar";
import CategoryFilter from "@/features/notes/CategoryFilter";
import NotesList from "@/features/notes/NotesList";
import CreateCategoryDialog from "@/features/notes/CreateCategoryDialog";
import useNotesData from "@/features/notes/useNotesData";

const Notes = () => {
  const {
    notes,
    filteredNotes,
    categories,
    isLoading,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    handleDeleteNote,
    handleSaveNote,
    handleCreateCategory,
  } = useNotesData();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<any | undefined>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const handleCreateNote = () => {
    setCurrentNote(undefined);
    setIsEditorOpen(true);
  };

  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit);
      setIsEditorOpen(true);
    }
  };

  const handleSaveNoteWithConfetti = async (note: any) => {
    const isNewNote = await handleSaveNote(note);
    if (isNewNote) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
  };

  const handleCreateCategorySubmit = async (name: string, color: string) => {
    const success = await handleCreateCategory(name, color);
    if (success) {
      setIsNewCategoryOpen(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container max-w-[1400px] mx-auto px-4 sm:px-6 py-8"
    >
      <ConfettiEffect isActive={showConfetti} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Notes
        </motion.h1>
        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <Button onClick={handleCreateNote} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />

        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={() => setIsNewCategoryOpen(true)}
        />
      </motion.div>

      <NotesList 
        notes={notes}
        filteredNotes={filteredNotes}
        isLoading={isLoading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        onCreateNote={handleCreateNote}
      />

      <CreateCategoryDialog 
        isOpen={isNewCategoryOpen}
        onClose={() => setIsNewCategoryOpen(false)}
        onSave={handleCreateCategorySubmit}
      />

      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNoteWithConfetti}
        note={currentNote}
        categories={categories}
      />
    </motion.div>
  );
};

export default Notes;
