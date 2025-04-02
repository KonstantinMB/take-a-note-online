import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, CheckSquare, LayoutList, MoveRight, Calendar } from "lucide-react";
import TodoItem from "@/components/TodoItem";
import EmptyState from "@/components/EmptyState";
import ConfettiEffect from "@/components/ConfettiEffect";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, isYesterday, addDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  due_date?: string;
}

interface GroupedTodos {
  [date: string]: Todo[];
}

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [showConfetti, setShowConfetti] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [draggedTodo, setDraggedTodo] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

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

  const getTodayDate = () => new Date();
  const getTomorrowDate = () => addDays(new Date(), 1);

  const groupedTodos = filteredTodos.reduce((groups: GroupedTodos, todo) => {
    let dateToUse = todo.due_date ? new Date(todo.due_date) : new Date(todo.created_at);
    let dateString: string;
    
    if (isToday(dateToUse)) {
      dateString = "Today";
    } else if (isTomorrow(dateToUse)) {
      dateString = "Tomorrow";
    } else if (isYesterday(dateToUse)) {
      dateString = "Yesterday";
    } else {
      dateString = format(dateToUse, "MMMM d, yyyy");
    }
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(todo);
    return groups;
  }, {});

  if (!groupedTodos["Today"]) {
    groupedTodos["Today"] = [];
  }
  
  if (!groupedTodos["Tomorrow"]) {
    groupedTodos["Tomorrow"] = [];
  }

  const sortedDates = Object.keys(groupedTodos).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    
    if (a === "Tomorrow" && b !== "Today") return -1;
    if (b === "Tomorrow" && a !== "Today") return 1;
    
    if (a === "Yesterday" && b !== "Today" && b !== "Tomorrow") return -1;
    if (b === "Yesterday" && a !== "Today" && a !== "Tomorrow") return 1;
    
    const dateA = a === "Today" 
      ? getTodayDate()
      : a === "Tomorrow"
        ? getTomorrowDate()
        : a === "Yesterday"
          ? new Date(new Date().setDate(new Date().getDate() - 1))
          : new Date(a);
          
    const dateB = b === "Today" 
      ? getTodayDate()
      : b === "Tomorrow"
        ? getTomorrowDate()
        : b === "Yesterday"
          ? new Date(new Date().setDate(new Date().getDate() - 1))
          : new Date(b);
          
    return dateB.getTime() - dateA.getTime();
  });

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoText.trim() || !user) return;
    
    try {
      const newTodo = {
        text: newTodoText.trim(),
        completed: false,
        user_id: user.id,
        due_date: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("todos")
        .insert(newTodo)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setTodos(prev => [data[0], ...prev]);
        setNewTodoText("");
        toast.success("Task added");
      }
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
        setTimeout(() => setShowConfetti(false), 100);
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
      toast.success("Task deleted");
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedTodo(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, dateSection: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(dateSection);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetDate: string) => {
    e.preventDefault();
    setDropTarget(null);
    
    const todoId = e.dataTransfer.getData("text/plain") || draggedTodo;
    if (!todoId) return;
    
    try {
      const todoToMove = todos.find(todo => todo.id === todoId);
      if (!todoToMove) return;
      
      let dueDate: Date;
      
      if (targetDate === "Today") {
        dueDate = getTodayDate();
      } else if (targetDate === "Tomorrow") {
        dueDate = getTomorrowDate();
      } else if (targetDate === "Yesterday") {
        dueDate = new Date(new Date().setDate(new Date().getDate() - 1));
      } else {
        dueDate = new Date(targetDate);
      }
      
      const { error } = await supabase
        .from("todos")
        .update({
          due_date: dueDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", todoId);

      if (error) {
        throw error;
      }

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId
            ? { ...todo, due_date: dueDate.toISOString() }
            : todo
        )
      );
      
      toast.success(`Task moved to ${targetDate}`);
      setDraggedTodo(null);
    } catch (error) {
      console.error("Error moving todo:", error);
      toast.error("Failed to move task");
      setDraggedTodo(null);
    }
  };

  return (
    <div className="page-container">
      <ConfettiEffect isActive={showConfetti} />
      
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
        <Button type="submit" disabled={!newTodoText.trim() || !user}>
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
      ) : Object.keys(groupedTodos).length > 0 ? (
        <ScrollArea className="h-[calc(100vh-280px)]">
          {sortedDates.map(date => (
            <div 
              key={date} 
              className={cn(
                "mb-6",
                dropTarget === date ? "bg-blue-50 rounded-lg transition-colors" : ""
              )}
              onDragOver={(e) => handleDragOver(e, date)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, date)}
            >
              <div className="flex items-center mb-2">
                <h2 className="text-sm font-medium text-gray-500">{date}</h2>
                <div className="ml-2 flex items-center text-xs text-gray-400">
                  <span>Drag to move</span>
                  <MoveRight className="h-3 w-3 mx-1" />
                  <Calendar className="h-3 w-3" />
                </div>
              </div>
              <div className="space-y-2">
                {groupedTodos[date] && groupedTodos[date].length > 0 ? (
                  groupedTodos[date].map((todo) => (
                    <TodoItem
                      key={todo.id}
                      id={todo.id}
                      text={todo.text}
                      completed={todo.completed}
                      onToggle={handleToggleTodo}
                      onDelete={handleDeleteTodo}
                      onEdit={handleEditTodo}
                      draggable={true}
                      onDragStart={handleDragStart}
                      dueDate={todo.due_date}
                    />
                  ))
                ) : (
                  <div className="text-sm text-gray-400 py-2 px-3 border border-dashed border-gray-200 rounded-lg text-center">
                    No tasks for {date.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          ))}
          
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
                  <Button type="submit" disabled={!newTodoText.trim() || !user}>
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
