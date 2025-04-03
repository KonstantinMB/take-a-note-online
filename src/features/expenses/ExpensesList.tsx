import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ExpenseCategoryBadge from "@/components/ExpenseCategoryBadge";
import * as LucideIcons from "lucide-react"; 
import { 
  MoreVertical, 
  Trash2, 
  Filter, 
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Edit
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
  user_id: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
}

interface ExpensesListProps {
  refreshTrigger: number;
}

const ExpensesList = ({ refreshTrigger }: ExpensesListProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Record<string, ExpenseCategory>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('expense_categories')
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        
        const categoriesMap: Record<string, ExpenseCategory> = {};
        (data || []).forEach((cat) => {
          categoriesMap[cat.id] = cat as ExpenseCategory;
        });
        
        setCategories(categoriesMap);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (user) {
      fetchCategories();
    }
  }, [user, refreshTrigger]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('expenses')
          .select("*")
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .eq("user_id", user.id);
          
        if (filterCategory) {
          query = query.eq('category', filterCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        setExpenses(data as Expense[] || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchExpenses();
    }
  }, [user, refreshTrigger, sortBy, sortOrder, filterCategory]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const clearFilters = () => {
    setFilterCategory(null);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-t-primary rounded-full animate-spin mb-2"></div>
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Recent Expenses</CardTitle>
          <CardDescription className="flex items-center">
            {expenses.length} {expenses.length === 1 ? "expense" : "expenses"} found
            {filterCategory && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 ml-2 text-xs"
                onClick={clearFilters}
              >
                Clear filter
              </Button>
            )}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {filterCategory && <span className="ml-1 text-xs">•</span>}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(categories).length > 0 ? (
                Object.values(categories).map((category) => (
                  <DropdownMenuItem 
                    key={category.id}
                    onClick={() => setFilterCategory(category.id)}
                  >
                    <div className="flex items-center w-full">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      {filterCategory === category.id && (
                        <span className="ml-auto w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No categories found</DropdownMenuItem>
              )}
              {filterCategory && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearFilters}>
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sort
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('desc'); }}>
                <Calendar className="h-4 w-4 mr-2" />
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('asc'); }}>
                <Calendar className="h-4 w-4 mr-2" />
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('amount'); setSortOrder('desc'); }}>
                <TrendingDown className="h-4 w-4 mr-2" />
                Highest amount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('amount'); setSortOrder('asc'); }}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Lowest amount
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No expenses found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filterCategory 
                ? "Try removing filters or add an expense in this category"
                : "Add your first expense using the form"
              }
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {expenses.map((expense) => {
                const category = categories[expense.category];
                return (
                  <div 
                    key={expense.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-background border hover:border-muted-foreground/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {category ? (
                        <div 
                          className="w-10 h-10 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: `${category.color}30` }}
                        >
                          {category.icon && (() => {
                            const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons];
                            return IconComponent ? (
                              <IconComponent 
                                style={{ color: category.color }} 
                                className="h-5 w-5" 
                              />
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-100"></div>
                      )}
                      <div>
                        <div className="font-medium">
                          {formatAmount(expense.amount)}
                        </div>
                        <div className="flex items-center mt-1">
                          {category && (
                            <ExpenseCategoryBadge
                              name={category.name}
                              color={category.color}
                              icon={category.icon}
                              className="text-xs px-2 py-0.5"
                            />
                          )}
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDate(expense.date)}
                          </span>
                        </div>
                        {expense.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {expense.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem 
                          onClick={() => handleDelete(expense.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
