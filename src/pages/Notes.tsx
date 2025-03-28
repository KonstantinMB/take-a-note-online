
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import NoteCard from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import EmptyState from "@/components/EmptyState";
import ConfettiEffect from "@/components/ConfettiEffect";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import CategoryBadge from "@/components/CategoryBadge";

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

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("note_categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    if (user) {
      fetchCategories();
    }
  }, [user]);

  // Fetch notes from database
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;

        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setNotes(data || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchNotes();
    }
  }, [user]);

  // Filter notes based on search query and selected category
  useEffect(() => {
    let filtered = [...notes];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        note => 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    setFilteredNotes(filtered);
  }, [searchQuery, selectedCategory, notes]);

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
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSaveNote = async (note: { id?: string; title: string; content: string; category?: string | null }) => {
    try {
      if (!user) {
        toast.error("You must be logged in to save notes");
        return;
      }

      let isNewNote = false;
      if (note.id) {
        const { error } = await supabase
          .from("notes")
          .update({
            title: note.title,
            content: note.content,
            category: note.category,
            updated_at: new Date().toISOString()
          })
          .eq("id", note.id);

        if (error) {
          throw error;
        }

        setNotes(prevNotes =>
          prevNotes.map(n =>
            n.id === note.id
              ? { ...n, title: note.title, content: note.content, category: note.category }
              : n
          )
        );
        
        toast.success("Note updated");
      } else {
        isNewNote = true;
        const { data, error } = await supabase
          .from("notes")
          .insert({
            title: note.title,
            content: note.content,
            category: note.category,
            user_id: user.id
          })
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setNotes(prevNotes => [data[0], ...prevNotes]);
        }
        
        toast.success("Note created");
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  // Get category name and color for a note
  const getCategoryInfo = (categoryId: string | null) => {
    if (!categoryId) return { name: "General", color: "#9b87f5" };
    
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || "General",
      color: category?.color || "#9b87f5"
    };
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="page-container">
      <ConfettiEffect isActive={showConfetti} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button onClick={handleCreateNote} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-100 input-focused"
        />
      </div>

      {/* Categories filter */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Tag className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Categories</span>
          
          {selectedCategory && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCategoryFilter} 
              className="ml-2 h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear filter
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <CategoryBadge
              key={category.id}
              name={category.name}
              color={category.color}
              className={selectedCategory === category.id ? "ring-2 ring-black/20" : "opacity-80 hover:opacity-100"}
              onClick={() => setSelectedCategory(prev => prev === category.id ? null : category.id)}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Loading notes...</div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
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
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              );
            })}
          </div>
        </ScrollArea>
      ) : (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title={searchQuery || selectedCategory ? "No matching notes found" : "No notes yet"}
          description={
            searchQuery || selectedCategory
              ? "Try adjusting your search query or category filter."
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
        categories={categories}
      />
    </div>
  );
};

export default Notes;
