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
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ExpenseCategoryBadge from "@/components/ExpenseCategoryBadge";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

const AddExpenseForm = ({ onExpenseAdded }: { onExpenseAdded: () => void }) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        setIsLoadingCategories(true);
        const { data, error } = await supabase
          .from('expense_categories')
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    if (user) {
      fetchCategories();
    }
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      const formattedDate = format(values.date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
      
      const numericAmount = parseFloat(values.amount.replace(/,/g, '.'));
      
      if (isNaN(numericAmount)) {
        toast.error("Invalid amount");
        return;
      }

      const newExpense = {
        amount: numericAmount,
        category: values.category,
        description: values.description || "",
        date: formattedDate,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('expenses')
        .insert(newExpense);

      if (error) throw error;

      toast.success("Expense added successfully");
      form.reset({
        amount: "",
        category: form.getValues().category,
        description: "",
        date: new Date(),
      });
      onExpenseAdded();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    }
  };

  const handleCreateCategory = async (name: string, color: string, icon: string) => {
    if (!user) return;
    
    try {
      const newCategory = {
        name,
        color,
        icon,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('expense_categories')
        .insert(newCategory)
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setCategories((prev) => [...prev, data[0] as ExpenseCategory]);
        setIsCategoryDialogOpen(false);
        toast.success("Category created");
        
        form.setValue("category", data[0].id);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      return false;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Add New Expense</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {isLoadingCategories ? (
                            <div className="text-sm text-muted-foreground">Loading categories...</div>
                          ) : categories.length > 0 ? (
                            categories.map((category) => (
                              <ExpenseCategoryBadge
                                key={category.id}
                                name={category.name}
                                color={category.color}
                                icon={category.icon}
                                onClick={() => form.setValue("category", category.id)}
                                className={`${
                                  field.value === category.id 
                                    ? "ring-2 ring-offset-2" 
                                    : "opacity-70 hover:opacity-100"
                                }`}
                              />
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No categories found</div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            type="button"
                            onClick={() => setIsCategoryDialogOpen(true)}
                          >
                            <Plus className="h-3.5 w-3.5" /> New
                          </Button>
                        </div>
                        {form.formState.errors.category && (
                          <p className="text-xs text-destructive mt-1">
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

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
                            <Calendar className="mr-2 h-4 w-4" />
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
                        placeholder="Add notes about this expense" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <CreateCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSave={handleCreateCategory}
      />
    </>
  );
};

export default AddExpenseForm;
