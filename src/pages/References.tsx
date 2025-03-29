
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import ReferenceCard from "@/components/ReferenceCard";
import ReferenceEditor from "@/components/ReferenceEditor";
import EmptyState from "@/components/EmptyState";

interface Reference {
  id: string;
  title: string;
  url: string;
  description?: string;
  createdAt: string;
}

const References = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [references, setReferences] = useState<Reference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState<Reference | undefined>(undefined);

  // Fetch references when component mounts
  useEffect(() => {
    if (user) {
      fetchReferences();
    }
  }, [user]);

  const fetchReferences = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reading_references")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match our Reference interface
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title,
        url: item.url,
        description: item.description || undefined,
        createdAt: item.created_at
      }));

      setReferences(formattedData);
    } catch (error) {
      console.error("Error fetching references:", error);
      toast({
        title: "Failed to load references",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter references based on search query
  const filteredReferences = references.filter(ref => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    
    return (
      ref.title.toLowerCase().includes(query) ||
      ref.url.toLowerCase().includes(query) ||
      (ref.description && ref.description.toLowerCase().includes(query))
    );
  });

  const handleSaveReference = async (reference: {
    id?: string;
    title: string;
    url: string;
    description?: string;
  }) => {
    try {
      if (reference.id) {
        // Update existing reference
        const { error } = await supabase
          .from("reading_references")
          .update({
            title: reference.title,
            url: reference.url,
            description: reference.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", reference.id);

        if (error) throw error;

        // Update local state
        setReferences(prevRefs => 
          prevRefs.map(ref => 
            ref.id === reference.id
              ? {
                  ...ref,
                  title: reference.title,
                  url: reference.url,
                  description: reference.description,
                }
              : ref
          )
        );

        toast({
          title: "Reference updated",
          description: "Your reference has been successfully updated.",
        });
      } else {
        // Create new reference
        const { data, error } = await supabase
          .from("reading_references")
          .insert({
            title: reference.title,
            url: reference.url,
            description: reference.description,
            user_id: user?.id,
          })
          .select("*")
          .single();

        if (error) throw error;

        // Add to local state
        const newReference: Reference = {
          id: data.id,
          title: data.title,
          url: data.url,
          description: data.description || undefined,
          createdAt: data.created_at,
        };

        setReferences(prevRefs => [newReference, ...prevRefs]);

        toast({
          title: "Reference added",
          description: "Your reference has been successfully added.",
        });
      }
    } catch (error) {
      console.error("Error saving reference:", error);
      toast({
        title: "Failed to save reference",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReference = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reading_references")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Remove from local state
      setReferences(prevRefs => prevRefs.filter(ref => ref.id !== id));

      toast({
        title: "Reference deleted",
        description: "Your reference has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting reference:", error);
      toast({
        title: "Failed to delete reference",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleEditReference = (id: string) => {
    const reference = references.find(ref => ref.id === id);
    setCurrentReference(reference);
    setEditorOpen(true);
  };

  return (
    <div className="container max-w-6xl py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reading References</h1>
        <p className="text-muted-foreground mb-6">
          Save and organize links to articles, papers, and resources you want to read later.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search references..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={() => {
            setCurrentReference(undefined);
            setEditorOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-16 w-full mb-3" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </div>
          ))}
        </div>
      ) : filteredReferences.length === 0 ? (
        searchQuery ? (
          <EmptyState
            title="No matching references"
            description="Try adjusting your search query."
            icon={<Search className="h-12 w-12" />}
          />
        ) : (
          <EmptyState
            title="No references yet"
            description="Add your first reading reference to get started."
            icon={<Plus className="h-12 w-12" />}
            action={
              <Button onClick={() => {
                setCurrentReference(undefined);
                setEditorOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Reference
              </Button>
            }
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredReferences.map((reference, index) => (
              <ReferenceCard
                key={reference.id}
                id={reference.id}
                title={reference.title}
                url={reference.url}
                description={reference.description}
                createdAt={reference.createdAt}
                onEdit={handleEditReference}
                onDelete={handleDeleteReference}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ReferenceEditor 
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveReference}
        reference={currentReference}
      />
    </div>
  );
};

export default References;
