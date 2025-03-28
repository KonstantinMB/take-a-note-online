import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, CheckSquare, LayoutList, CheckCircle } from "lucide-react";
import TodoItem from "@/components/TodoItem";
import EmptyState from "@/components/EmptyState";
import ConfettiEffect from "@/components/ConfettiEffect";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        
        if (!user) return;

        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setTodos(data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTodos();
    }
  }, [user]);

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert({
          text: newTodoText.trim(),
          completed: false,
          user_id: user.id
        })
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setTodos(prev => [data[0], ...prev]);
        setShowConfetti(true);
      }
      
      setNewTodoText("");
      toast.success("Task added", {
        icon: "🎉",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const { error } = await supabase
        .from("todos")
        .update({
          completed: !todoToUpdate.completed,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );
      
      if (!todoToUpdate.completed) {
        setShowConfetti(true);
        toast.success("Task completed", {
          icon: "✅",
        });
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success("Task deleted", {
        icon: "🗑️",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleEditTodo = async (id: string, text: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          text,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id
            ? { ...todo, text }
            : todo
        )
      );
      toast.success("Task updated");
    } catch (error) {
      console.error("Error editing todo:", error);
      toast.error("Failed to update task");
    }
  };

  const handleClearCompleted = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
    
    if (completedTodoIds.length === 0) return;
    
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .in("id", completedTodoIds);

      if (error) {
        throw error;
      }

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      toast.success("Completed tasks cleared");
    } catch (error) {
      console.error("Error clearing completed todos:", error);
      toast.error("Failed to clear completed tasks");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="page-container">
      <ConfettiEffect trigger={showConfetti} duration={2500} />
      
      <motion.div 
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCompleted}
            disabled={!todos.some(todo => todo.completed)}
          >
            Clear completed
          </Button>
        </motion.div>
      </motion.div>
      
      <motion.form 
        onSubmit={handleAddTodo} 
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="input-focused"
        />
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" disabled={!newTodoText.trim() || !user}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </motion.div>
      </motion.form>
      
      <motion.div 
        className="flex gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </motion.div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Loading tasks...</div>
        </div>
      ) : filteredTodos.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <motion.div 
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTodos.map((todo) => (
              <motion.div key={todo.id} variants={itemVariants}>
                <TodoItem
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-4 text-sm text-gray-500 text-center py-2">
            {todos.filter(t => !t.completed).length} tasks left
          </div>
        </ScrollArea>
      ) : (
        <EmptyState
          icon={filter === "completed" ? <CheckCircle className="h-8 w-8" /> : <LayoutList className="h-8 w-8" />}
          title={
            filter === "all"
              ? "No tasks yet"
              : filter === "active"
              ? "No active tasks"
              : "No completed tasks"
          }
          description={
            filter === "all"
              ? "Add your first task to get started."
              : filter === "active"
              ? "You've completed all your tasks! 🎉"
              : "Complete a task to see it here."
          }
          action={
            filter === "all" && (
              <div className="w-full max-w-sm">
                <motion.form 
                  onSubmit={handleAddTodo} 
                  className="flex gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    className="input-focused"
                  />
                  <Button type="submit" disabled={!newTodoText.trim() || !user}>
                    Add
                  </Button>
                </motion.form>
              </div>
            )
          }
          className="py-20"
        />
      )}
    </div>
  );
};

export default TodoPage;
