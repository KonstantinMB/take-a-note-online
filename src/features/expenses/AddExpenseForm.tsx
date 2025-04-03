
import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Receipt, Calendar, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoriesManager from "./CategoriesManager";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import ConfettiEffect from "@/components/ConfettiEffect";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddExpenseForm = ({ onExpenseAdded }: { onExpenseAdded: () => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      category: "",
      date: new Date(),
      description: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("expense_categories")
          .select("*")
          .order("name");
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, [user, refreshTrigger]);

  const handleCategoryUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      const numericAmount = parseFloat(values.amount.replace(/,/g, '.'));
      
      if (isNaN(numericAmount)) {
        toast.error("Invalid amount format");
        return;
      }

      const newExpense = {
        user_id: user.id,
        amount: numericAmount,
        category: values.category,
        date: format(values.date, "yyyy-MM-dd"),
        description: values.description || null,
      };

      const { error } = await supabase.from('expenses').insert(newExpense);

      if (error) throw error;

      toast.success("Expense added successfully");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      form.reset({
        amount: "",
        category: "",
        date: new Date(),
        description: "",
      });
      
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  // Update form when a category is selected from the CategoriesManager
  useEffect(() => {
    if (selectedCategory) {
      form.setValue("category", selectedCategory);
    }
  }, [selectedCategory, form]);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Add New Expense</CardTitle>
        </CardHeader>

        <CategoriesManager 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory}
          refreshTrigger={refreshTrigger}
          onCategoryUpdated={handleCategoryUpdated}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input 
                            {...field} 
                            type="text" 
                            className="pl-7" 
                            placeholder="0.00" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(field.value, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Add details about this expense" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                <Receipt className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ConfettiEffect isActive={showConfetti} />
    </>
  );
};

export default AddExpenseForm;
