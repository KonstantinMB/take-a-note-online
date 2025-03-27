
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoteCard from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notes
  useEffect(() => {
    // Placeholder for Supabase integration
    const fetchNotes = async () => {
      try {
        // This would be replaced with Supabase query
        setTimeout(() => {
          // Sample data
          const sampleNotes = [
            {
              id: "1",
              title: "Welcome to Notely",
              content: "This is a sample note to get you started. Create your first note by clicking the + button in the top right corner.",
              createdAt: new Date().toISOString(),
            }
          ];
          setNotes(sampleNotes);
          setFilteredNotes(sampleNotes);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(
        note => 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

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

  const handleDeleteNote = async (id: string) => {
    try {
      // This would be replaced with Supabase delete
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSaveNote = async (note: { id?: string; title: string; content: string }) => {
    // This would be replaced with Supabase create/update
    if (note.id) {
      // Update existing note
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === note.id
            ? { ...n, title: note.title, content: note.content }
            : n
        )
      );
    } else {
      // Create new note
      const newNote = {
        id: Date.now().toString(),
        title: note.title,
        content: note.content,
        createdAt: new Date().toISOString(),
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button onClick={handleCreateNote} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-100 input-focused"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Loading notes...</div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                createdAt={note.createdAt}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title={searchQuery ? "No matching notes found" : "No notes yet"}
          description={
            searchQuery
              ? "Try adjusting your search query or create a new note."
              : "Create your first note to get started."
          }
          action={
            <Button onClick={handleCreateNote} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          }
          className="py-20"
        />
      )}

      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        note={currentNote}
      />
    </div>
  );
};

export default Notes;
