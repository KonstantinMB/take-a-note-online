import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, parseISO, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import EventModal from "@/components/EventModal";
import DayEventsSheet from "@/components/DayEventsSheet";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchEvents();
  }, [user, currentDate]);

  const fetchEvents = async () => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });
      
      if (error) throw error;
      
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };
  
  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(parseISO(event.start_time));
    setIsSheetOpen(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    try {
      if (!user) return;

      if (selectedEvent) {
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
        const { error } = await supabase
          .from("calendar_events")
          .insert({
            user_id: user.id,
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
      
      fetchEvents();
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
      
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      toast.success("Event removed from calendar");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to remove event");
    }
  };

  const getEventsForDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    
    return events.filter(event => {
      const eventDate = startOfDay(parseISO(event.start_time));
      return isSameDay(eventDate, normalizedDate);
    });
  };

  const colorVariants: Record<string, string> = {
    blue: "bg-blue-500 border-blue-600",
    green: "bg-green-500 border-green-600",
    red: "bg-red-500 border-red-600",
    yellow: "bg-yellow-500 border-yellow-600",
    purple: "bg-purple-500 border-purple-600",
    pink: "bg-pink-500 border-pink-600",
    indigo: "bg-indigo-500 border-indigo-600",
    default: "bg-gray-500 border-gray-600"
  };

  console.log("Calendar - isSheetOpen:", isSheetOpen);
  console.log("Calendar - selectedDate:", selectedDate);
  console.log("Calendar - isMobile:", isMobile);

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button onClick={() => handleDateClick(new Date())}>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg sm:text-xl font-medium px-2">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
            className="hidden sm:flex"
          >
            Today
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="h-8 sm:h-10 flex items-center justify-center font-medium text-xs sm:text-sm text-gray-500"
            >
              {isMobile ? day.charAt(0) : day}
            </div>
          ))}
          
          {daysInMonth.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);
            
            return (
              <motion.div
                key={day.toString()}
                className={cn(
                  "min-h-[80px] sm:min-h-[100px] p-1 border border-gray-100 rounded-md",
                  "transition-colors cursor-pointer",
                  isToday ? "bg-blue-50" : isCurrentMonth ? "bg-white" : "bg-gray-50 opacity-70",
                  "hover:border-blue-300 hover:shadow-md hover:bg-blue-50/50",
                  "relative"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDateClick(day)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.01 }}
              >
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50"></div>
                
                <div className="flex flex-col h-full">
                  <div className={cn(
                    "text-xs sm:text-sm font-medium mb-1 p-1 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center",
                    isToday ? "bg-blue-500 text-white" : "text-gray-700"
                  )}>
                    {format(day, 'd')}
                  </div>
                  
                  <ScrollArea className="flex-1 h-full" type="always">
                    <div className="space-y-1">
                      {dayEvents.slice(0, isMobile ? 2 : 3).map((event) => (
                        <div 
                          key={event.id}
                          className={cn(
                            "text-xs px-2 py-1 rounded-md text-white truncate",
                            "border-l-2",
                            "hover:ring-1 hover:ring-offset-1 hover:ring-opacity-50",
                            event.color ? colorVariants[event.color] : colorVariants.default
                          )}
                          onClick={(e) => handleEventClick(e, event)}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > (isMobile ? 2 : 3) && (
                        <div className="text-xs px-2 py-1 text-gray-500 font-medium hover:underline">
                          +{dayEvents.length - (isMobile ? 2 : 3)} more
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse text-gray-400">Loading events...</div>
        </div>
      )}
      
      {!isLoading && events.length === 0 && (
        <EmptyState 
          icon={<CalendarIcon className="h-10 w-10" />}
          title="No events yet"
          description="Schedule your first event to get started."
          action={
            <Button onClick={() => handleDateClick(new Date())}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          }
          className="py-16"
        />
      )}
      
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
      />

      <DayEventsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        selectedDate={selectedDate}
        events={events}
        onEventUpdate={fetchEvents}
        userId={user?.id}
      />
    </div>
  );
};

export default CalendarPage;
