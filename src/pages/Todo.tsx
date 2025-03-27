
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, CheckSquare, LayoutList } from "lucide-react";
import TodoItem from "@/components/TodoItem";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Fetch todos
  useEffect(() => {
    // Placeholder for Supabase integration
    const fetchTodos = async () => {
      try {
        // This would be replaced with Supabase query
        setTimeout(() => {
          // Sample data
          const sampleTodos = [
            {
              id: "1",
              text: "Welcome to your to-do list! Add your first task below.",
              completed: false,
              createdAt: new Date().toISOString(),
            }
          ];
          setTodos(sampleTodos);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching todos:", error);
        toast.error("Failed to load tasks");
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim()) return;
    
    try {
      // This would be replaced with Supabase insert
      const newTodo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      
      setTodos(prev => [newTodo, ...prev]);
      setNewTodoText("");
      toast.success("Task added");
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      // This would be replaced with Supabase update
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      // This would be replaced with Supabase delete
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleEditTodo = async (id: string, text: string) => {
    try {
      // This would be replaced with Supabase update
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

  const handleClearCompleted = () => {
    const hasCompleted = todos.some(todo => todo.completed);
    
    if (hasCompleted) {
      // This would be replaced with Supabase delete
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      toast.success("Completed tasks cleared");
    }
  };

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">To-Do List</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearCompleted}
          disabled={!todos.some(todo => todo.completed)}
        >
          Clear completed
        </Button>
      </div>
      
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new task..."
          className="input-focused"
        />
        <Button type="submit" disabled={!newTodoText.trim()}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </form>
      
      <div className="flex gap-2 mb-4">
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
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-gray-400">Loading tasks...</div>
        </div>
      ) : filteredTodos.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
              />
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center py-2">
            {todos.filter(t => !t.completed).length} tasks left
          </div>
        </ScrollArea>
      ) : (
        <EmptyState
          icon={filter === "completed" ? <CheckSquare className="h-8 w-8" /> : <LayoutList className="h-8 w-8" />}
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
              ? "You've completed all your tasks!"
              : "Complete a task to see it here."
          }
          action={
            filter === "all" && (
              <div className="w-full max-w-sm">
                <form onSubmit={handleAddTodo} className="flex gap-2">
                  <Input
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    placeholder="Add a new task..."
                    className="input-focused"
                  />
                  <Button type="submit" disabled={!newTodoText.trim()}>
                    Add
                  </Button>
                </form>
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
