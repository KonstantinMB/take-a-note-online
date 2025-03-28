
import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import EventModal from "./EventModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  is_all_day: boolean | null;
  color: string | null;
  user_id: string;
}

interface DayEventsSheetProps {
  selectedDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  onEventUpdate: () => void;
  userId: string | undefined;
}

const DayEventsSheet = ({ 
  selectedDate, 
  isOpen, 
  onClose, 
  events, 
  onEventUpdate,
  userId
}: DayEventsSheetProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);

  // Filter events for the selected date whenever selectedDate or events change
  useEffect(() => {
    if (selectedDate && events && events.length > 0) {
      const filteredEvents = events.filter(event => {
        const eventDate = parseISO(event.start_time);
        return isSameDay(eventDate, selectedDate);
      });
      
      // Sort events by time
      filteredEvents.sort((a, b) => {
        if (a.is_all_day && !b.is_all_day) return -1;
        if (!a.is_all_day && b.is_all_day) return 1;
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      });
      
      setDayEvents(filteredEvents);
    } else {
      setDayEvents([]);
    }
  }, [selectedDate, events]);

  const handleAddNewEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    try {
      if (!userId) return;

      if (selectedEvent) {
        // Update existing event
        const { error } = await supabase
          .from("calendar_events")
          .update({
            title: eventData.title,
            description: eventData.description,
            start_time: eventData.startTime,
            end_time: eventData.endTime,
            is_all_day: eventData.isAllDay,
            color: eventData.color,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedEvent.id);
          
        if (error) throw error;
        toast.success("Event updated successfully");
      } else {
        // Create new event
        const { error } = await supabase
          .from("calendar_events")
          .insert({
            user_id: userId,
            title: eventData.title,
            description: eventData.description,
            start_time: eventData.startTime,
            end_time: eventData.endTime,
            is_all_day: eventData.isAllDay,
            color: eventData.color
          });
          
        if (error) throw error;
        toast.success("Event added to calendar");
      }
      
      onEventUpdate();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
      
      toast.success("Event removed from calendar");
      onEventUpdate();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to remove event");
    }
  };

  const colorVariants: Record<string, string> = {
    blue: "bg-blue-500 border-blue-600 text-white",
    green: "bg-green-500 border-green-600 text-white",
    red: "bg-red-500 border-red-600 text-white",
    yellow: "bg-yellow-500 border-yellow-600 text-white",
    purple: "bg-purple-500 border-purple-600 text-white",
    pink: "bg-pink-500 border-pink-600 text-white",
    indigo: "bg-indigo-500 border-indigo-600 text-white",
    default: "bg-gray-500 border-gray-600 text-white"
  };

  console.log("DayEventsSheet - selectedDate:", selectedDate);
  console.log("DayEventsSheet - dayEvents:", dayEvents);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Events'}
            </SheetTitle>
          </SheetHeader>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">
              {dayEvents.length === 0 ? 'No events scheduled' : 
                `${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
            </h3>
            <Button size="sm" onClick={handleAddNewEvent} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-3 pr-4">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all",
                      "transform hover:scale-[1.02] active:scale-[0.98]",
                      event.color ? colorVariants[event.color] : colorVariants.default
                    )}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{event.title}</h4>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm opacity-90">
                      <Clock className="h-3 w-3 mr-1" />
                      {event.is_all_day ? (
                        'All day'
                      ) : (
                        <>
                          {format(new Date(event.start_time), 'h:mm a')}
                          {event.end_time && (
                            <> - {format(new Date(event.end_time), 'h:mm a')}</>
                          )}
                        </>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="mt-2 text-sm opacity-90 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No events for this day</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleAddNewEvent}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
      />
    </>
  );
};

export default DayEventsSheet;
