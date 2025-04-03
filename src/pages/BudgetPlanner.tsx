
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BudgetItem {
  id: string;
  category: string;
  planned_amount: number;
  user_id: string;
  month_year: string;
  created_at: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
}

const BudgetPlanner = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    category: "",
    planned_amount: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  const formatMonthYear = (date: Date) => {
    return format(date, "yyyy-MM");
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('expense_categories')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    fetchCategories();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    
    const fetchBudgetItems = async () => {
      setIsLoading(true);
      try {
        const monthYear = formatMonthYear(selectedDate);
        
        const { data, error } = await supabase
          .from('budget_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('month_year', monthYear);
          
        if (error) throw error;
        
        setBudgetItems(data || []);
      } catch (error) {
        console.error("Error fetching budget items:", error);
        toast.error("Failed to load budget items");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBudgetItems();
  }, [user, selectedDate]);

  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleAddItem = async () => {
    if (!user) return;
    if (!newItem.category) {
      toast.error("Please select a category");
      return;
    }
    if (newItem.planned_amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      const monthYear = formatMonthYear(selectedDate);
      
      const { data, error } = await supabase
        .from('budget_items')
        .insert({
          category: newItem.category,
          planned_amount: newItem.planned_amount,
          user_id: user.id,
          month_year: monthYear
        })
        .select();
        
      if (error) throw error;
      
      setBudgetItems([...budgetItems, data[0]]);
      setNewItem({ category: "", planned_amount: 0 });
      toast.success("Budget item added");
    } catch (error) {
      console.error("Error adding budget item:", error);
      toast.error("Failed to add budget item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budget_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBudgetItems(budgetItems.filter(item => item.id !== id));
      toast.success("Budget item deleted");
    } catch (error) {
      console.error("Error deleting budget item:", error);
      toast.error("Failed to delete budget item");
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalBudget = () => {
    return budgetItems.reduce((total, item) => total + item.planned_amount, 0);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Monthly Budget Planner</h1>
      
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="month"
                  selected={selectedDate}
                  onSelect={handleMonthChange}
                  className="rounded-md border"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">
                  {format(selectedDate, "MMMM yyyy")}
                </h2>
                <p className="text-muted-foreground">
                  Planning for {startOfMonth(selectedDate).toLocaleDateString()} - {endOfMonth(selectedDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Add Budget Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Planned Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.planned_amount || ""}
                    onChange={(e) => setNewItem({...newItem, planned_amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleAddItem}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add to Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Budget for {format(selectedDate, "MMMM yyyy")}</CardTitle>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Budget:</div>
                <div className="text-2xl font-bold">{formatCurrency(getTotalBudget())}</div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading budget items...</div>
              ) : budgetItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No budget items found</p>
                  <p className="text-sm text-muted-foreground">Add your first budget item using the form</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Planned Amount</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{getCategoryName(item.category)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.planned_amount)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
