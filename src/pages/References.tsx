
import { useState, useEffect } from "react";
import { Plus, Book, Search, Tag, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReferenceCard from "@/components/ReferenceCard";
import ReferenceEditor from "@/components/ReferenceEditor";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";

interface Reference {
  id: string;
  title: string;
  url: string;
  description: string | null;
  tags: string[] | null;
  created_at: string;
}

const References = () => {
  const [references, setReferences] = useState<Reference[]>([]);
  const [filteredReferences, setFilteredReferences] = useState<Reference[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentReference, setCurrentReference] = useState<Reference | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;

        const { data, error } = await supabase
          .from("reading_references")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setReferences(data || []);
      } catch (error) {
        console.error("Error fetching references:", error);
        toast.error("Failed to load reading references");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchReferences();
    }
  }, [user]);

  // Extract all unique tags when references change
  useEffect(() => {
    const tags = references.reduce((acc: string[], reference) => {
      if (reference.tags && reference.tags.length > 0) {
        reference.tags.forEach(tag => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
      }
      return acc;
    }, []);
    
    setAllTags(tags.sort());
  }, [references]);

  useEffect(() => {
    let filtered = [...references];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ref => 
          ref.title.toLowerCase().includes(query) ||
          (ref.description && ref.description.toLowerCase().includes(query)) ||
          ref.url.toLowerCase().includes(query) ||
          (ref.tags && ref.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(
        ref => ref.tags && ref.tags.includes(selectedTag)
      );
    }
    
    setFilteredReferences(filtered);
  }, [searchQuery, selectedTag, references]);

  const handleCreateReference = () => {
    setCurrentReference(undefined);
    setIsEditorOpen(true);
  };

  const handleEditReference = (id: string) => {
    const referenceToEdit = references.find(ref => ref.id === id);
    if (referenceToEdit) {
      setCurrentReference(referenceToEdit);
      setIsEditorOpen(true);
    }
  };

  const handleDeleteReference = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reading_references")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setReferences(prev => prev.filter(ref => ref.id !== id));
      toast.success("Reference deleted");
    } catch (error) {
      console.error("Error deleting reference:", error);
      toast.error("Failed to delete reference");
    }
  };

  const handleSaveReference = async (reference: { 
    id?: string; 
    title: string; 
    url: string; 
    description?: string;
    tags?: string[];
  }) => {
    try {
      if (!user) {
        toast.error("You must be logged in to save references");
        return;
      }

      if (reference.id) {
        const { error } = await supabase
          .from("reading_references")
          .update({
            title: reference.title,
            url: reference.url,
            description: reference.description || null,
            tags: reference.tags || null,
            updated_at: new Date().toISOString()
          })
          .eq("id", reference.id);

        if (error) {
          throw error;
        }

        setReferences(prevRefs =>
          prevRefs.map(ref =>
            ref.id === reference.id
              ? { 
                  ...ref, 
                  title: reference.title, 
                  url: reference.url,
                  description: reference.description || null,
                  tags: reference.tags || null
                }
              : ref
          )
        );
        
        toast.success("Reference updated");
      } else {
        const { data, error } = await supabase
          .from("reading_references")
          .insert({
            title: reference.title,
            url: reference.url,
            description: reference.description || null,
            tags: reference.tags || null,
            user_id: user.id
          })
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setReferences(prevRefs => [data[0], ...prevRefs]);
        }
        
        toast.success("Reference saved");
      }
    } catch (error) {
      console.error("Error saving reference:", error);
      toast.error("Failed to save reference");
    }
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-container max-w-[1400px] mx-auto px-4 sm:px-6 py-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-bold"
        >
          Reading References
        </motion.h1>
        <motion.div
          initial={{ x: 20 }}
          animate={{ x: 0 }}
        >
          <Button onClick={handleCreateReference} size="sm" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            New Reference
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {allTags.length > 0 && (
          <div className="mb-6">
            <motion.div 
              className="flex items-center mb-2 cursor-pointer bg-gray-50 p-2 rounded-lg" 
              onClick={() => setShowTags(!showTags)}
              whileHover={{ backgroundColor: "#F3F4F6" }}
            >
              <Tag className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
              <motion.div
                animate={{ rotate: showTags ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4 ml-1 text-gray-500" />
              </motion.div>
              
              {selectedTag && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearTagFilter();
                  }} 
                  className="ml-2 h-6 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear filter
                </Button>
              )}
            </motion.div>
            
            <AnimatePresence>
              {showTags && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 ml-6 mt-2 mb-2">
                    {allTags.map(tag => (
                      <motion.span
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTag(prev => prev === tag ? null : tag)}
                        className={`cursor-pointer text-xs px-2 py-1 rounded-full transition-colors ${
                          selectedTag === tag 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400"
          >
            Loading references...
          </motion.div>
        </div>
      ) : filteredReferences.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
            <AnimatePresence>
              {filteredReferences.map((reference, index) => (
                <ReferenceCard
                  key={reference.id}
                  id={reference.id}
                  title={reference.title}
                  url={reference.url}
                  description={reference.description || undefined}
                  tags={reference.tags || undefined}
                  createdAt={reference.created_at}
                  onEdit={handleEditReference}
                  onDelete={handleDeleteReference}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmptyState
            icon={<Book className="h-8 w-8" />}
            title={searchQuery || selectedTag ? "No matching references found" : "No references yet"}
            description={
              searchQuery || selectedTag
                ? "Try adjusting your search query or tag filter."
                : "Add your first reading reference to get started."
            }
            action={
              <Button onClick={handleCreateReference} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Reference
              </Button>
            }
            className="py-20"
          />
        </motion.div>
      )}

      <ReferenceEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveReference}
        reference={currentReference}
      />
    </motion.div>
  );
};

export default References;
