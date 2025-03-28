
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
  onDelete: () => void;
  selectedDate: Date | null;
  selectedEvent: any | null;
}

const EventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  selectedDate,
  selectedEvent 
}: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [isAllDay, setIsAllDay] = useState(false);
  const [color, setColor] = useState("blue");
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (selectedEvent) {
        // Edit mode
        setTitle(selectedEvent.title);
        setDescription(selectedEvent.description || "");
        setDate(selectedDate);
        
        if (selectedEvent.start_time) {
          setStartTime(format(new Date(selectedEvent.start_time), 'HH:mm'));
        }
        
        if (selectedEvent.end_time) {
          setEndTime(format(new Date(selectedEvent.end_time), 'HH:mm'));
        }
        
        setIsAllDay(!!selectedEvent.is_all_day);
        setColor(selectedEvent.color || "blue");
      } else {
        // Create mode
        setTitle("");
        setDescription("");
        setDate(selectedDate);
        setStartTime("09:00");
        setEndTime("10:00");
        setIsAllDay(false);
        setColor("blue");
      }
    }
  }, [isOpen, selectedEvent, selectedDate]);
  
  const handleSave = () => {
    if (!title.trim()) return;
    if (!date) return;
    
    // Combine date and time
    let startDateTime = new Date(date);
    let endDateTime = new Date(date);
    
    if (!isAllDay) {
      // Parse time strings
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      
      startDateTime.setHours(startHours, startMinutes);
      endDateTime.setHours(endHours, endMinutes);
    } else {
      // For all-day events, set times to start and end of day
      startDateTime.setHours(0, 0, 0, 0);
      endDateTime.setHours(23, 59, 59, 999);
    }
    
    onSave({
      title,
      description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      isAllDay,
      color
    });
    
    onClose();
  };
  
  const colorOptions = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Yellow", value: "yellow", class: "bg-yellow-500" },
    { name: "Purple", value: "purple", class: "bg-purple-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
    { name: "Indigo", value: "indigo", class: "bg-indigo-500" },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedEvent ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-focused"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="all-day">All day</Label>
            <Switch 
              id="all-day" 
              checked={isAllDay} 
              onCheckedChange={setIsAllDay} 
            />
          </div>
          
          {!isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="pl-9 input-focused"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="pl-9 input-focused"
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    option.class,
                    color === option.value ? "ring-2 ring-offset-2 ring-black" : ""
                  )}
                  onClick={() => setColor(option.value)}
                  title={option.name}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this event"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-focused resize-none h-20"
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {selectedEvent && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim() || !date}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
