
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

const useNotesData = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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

  useEffect(() => {
    let filtered = [...notes];
    
    if (searchQuery) {
      filtered = filtered.filter(
        note => 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(note => note.category === selectedCategory);
    }
    
    setFilteredNotes(filtered);
  }, [searchQuery, selectedCategory, notes]);

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
        return false; // Not a new note
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
        return true; // Is a new note
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
      return false;
    }
  };

  const handleCreateCategory = async (name: string, color: string) => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create categories");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("note_categories")
        .insert({
          name: name.trim(),
          color: color,
          user_id: user.id
        })
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setCategories(prev => [...prev, data[0]]);
        toast.success("Category created");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      return false;
    }
  };

  return {
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
  };
};

export default useNotesData;
