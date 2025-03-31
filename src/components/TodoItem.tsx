
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Save, Trash, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
}

const TodoItem = ({ 
  id, 
  text, 
  completed, 
  onToggle, 
  onDelete, 
  onEdit,
  draggable = false,
  onDragStart
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(text);
  };

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(id, editedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div 
      className={cn(
        "group flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white transition-all duration-200",
        completed ? "bg-gray-50" : "",
        isHovering ? "shadow-sm" : "",
        draggable ? "cursor-grab active:cursor-grabbing" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      draggable={draggable}
      onDragStart={(e) => onDragStart && onDragStart(e, id)}
    >
      <div className="flex items-center gap-3 flex-1">
        <Checkbox 
          id={`todo-${id}`} 
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className={cn(
            "transition-all duration-300",
            completed ? "opacity-70" : ""
          )}
        />
        
        {isEditing ? (
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 h-8 border-gray-200 input-focused"
            autoFocus
            onKeyDown={handleKeyDown}
          />
        ) : (
          <label 
            htmlFor={`todo-${id}`}
            className={cn(
              "flex-1 text-sm cursor-pointer transition-all duration-200",
              completed ? "text-gray-400 line-through" : "text-gray-700"
            )}
          >
            {text}
          </label>
        )}
      </div>
      
      <div className={cn(
        "flex items-center gap-1 transition-opacity duration-200",
        (isHovering || isEditing) ? "opacity-100" : "opacity-0"
      )}>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 rounded-full text-green-600 hover:bg-green-50 transition-colors"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              disabled={completed}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
