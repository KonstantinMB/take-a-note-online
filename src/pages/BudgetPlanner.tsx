
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import ExpenseCategoryBadge from "@/components/ExpenseCategoryBadge";

interface BudgetItem {
  id?: string;
  category: string;
  planned_amount: number;
  month_year: string;
  user_id: string;
}

interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  user_id: string;
  created_at: string;
}

const BudgetPlanner = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [plannedAmount, setPlannedAmount] = useState<string>('');

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('expense_categories')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to load categories');
        return;
      }

      setCategories(data || []);
    };

    const fetchBudgetItems = async () => {
      if (!user) return;
      
      const monthYear = format(selectedMonth, 'yyyy-MM');
      // Use the type-safe way to access the budget_items table
      const { data, error } = await supabase
        .from('budget_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', monthYear);

      if (error) {
        toast.error('Failed to load budget items');
        return;
      }

      // Cast the data to the BudgetItem[] type
      setBudgetItems(data as BudgetItem[]);
    };

    fetchCategories();
    fetchBudgetItems();
  }, [user, selectedMonth]);

  const handleAddBudgetItem = async () => {
    if (!user || !selectedCategory || !plannedAmount) {
      toast.error('Please select a category and enter an amount');
      return;
    }

    const monthYear = format(selectedMonth, 'yyyy-MM');
    const newBudgetItem: BudgetItem = {
      category: selectedCategory,
      planned_amount: parseFloat(plannedAmount),
      month_year: monthYear,
      user_id: user.id
    };

    // Use the type-safe way to access the budget_items table
    const { data, error } = await supabase
      .from('budget_items')
      .upsert(newBudgetItem)
      .select();

    if (error) {
      toast.error('Failed to save budget item');
      return;
    }

    // Update local state
    if (data) {
      setBudgetItems(prev => {
        // Remove existing item for this category if it exists
        const filteredItems = prev.filter(item => 
          item.category !== selectedCategory || item.month_year !== monthYear
        );
        return [...filteredItems, data[0] as BudgetItem];
      });

      // Reset form
      setSelectedCategory(null);
      setPlannedAmount('');
      toast.success('Budget item saved');
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Monthly Budget Planner</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Set Budget for {format(selectedMonth, 'MMMM yyyy')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {format(selectedMonth, 'MMMM yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => setSelectedMonth(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((category) => (
                  <ExpenseCategoryBadge
                    key={category.id}
                    name={category.name}
                    color={category.color}
                    icon={category.icon}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? "ring-2 ring-offset-2" 
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <Input 
              type="number" 
              placeholder="Budget Amount" 
              value={plannedAmount}
              onChange={(e) => setPlannedAmount(e.target.value)}
              className="w-40"
            />
          </div>
          
          <Button 
            onClick={handleAddBudgetItem} 
            disabled={!selectedCategory || !plannedAmount}
            className="w-full"
          >
            Add Budget Item
          </Button>
        </CardContent>
        
        <CardFooter>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Current Budget Items</h3>
            {budgetItems.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No budget items for this month
              </p>
            ) : (
              <div className="space-y-2">
                {budgetItems.map((item) => {
                  const category = categories.find(c => c.id === item.category);
                  return (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 border rounded-lg"
                    >
                      {category && (
                        <ExpenseCategoryBadge
                          name={category.name}
                          color={category.color}
                          icon={category.icon}
                        />
                      )}
                      <span className="font-medium">
                        ${item.planned_amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BudgetPlanner;
