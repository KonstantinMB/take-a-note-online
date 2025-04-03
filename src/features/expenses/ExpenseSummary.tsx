
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface Expense {
  amount: number;
  category: string;
  date: string;
  user_id: string;
  id: string;
  description?: string | null;
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

interface ExpenseSummaryProps {
  refreshTrigger: number;
}

const ExpenseSummary = ({ refreshTrigger }: ExpenseSummaryProps) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Record<string, ExpenseCategory>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      try {
        // Fixed: Added proper type assertion to resolve TypeScript error
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
  }, [user]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
        const endDate = format(endOfMonth(new Date()), "yyyy-MM-dd");
        
        // Fixed: Added proper type assertion to resolve TypeScript error
        const { data, error } = await supabase
          .from('expenses')
          .select("amount, category, date")
          .gte("date", startDate)
          .lte("date", endDate)
          .eq("user_id", user.id);

        if (error) throw error;
        
        setExpenses(data as Expense[] || []);
        
        // Calculate total spent
        const total = (data || []).reduce((sum, expense) => sum + (expense.amount as number), 0);
        setTotalSpent(total);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchExpenses();
    }
  }, [user, refreshTrigger]);

  // Prepare data for category breakdown chart
  const categoryData = expenses.reduce<Record<string, number>>((acc, expense) => {
    const categoryId = expense.category;
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    acc[categoryId] += expense.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([categoryId, amount]) => ({
    name: categories[categoryId]?.name || "Unknown",
    value: amount,
    color: categories[categoryId]?.color || "#999",
  }));

  // Prepare data for daily spending chart
  const dailyExpenses: Record<string, number> = {};
  
  expenses.forEach((expense) => {
    const date = format(new Date(expense.date), "MMM d");
    if (!dailyExpenses[date]) {
      dailyExpenses[date] = 0;
    }
    dailyExpenses[date] += expense.amount;
  });

  const barData = Object.entries(dailyExpenses).map(([date, amount]) => ({
    date,
    amount,
  }));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm">
          <p className="text-sm">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Spent This Month</p>
            <h2 className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                formatCurrency(totalSpent)
              )}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(startOfMonth(new Date()), "MMMM yyyy")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No expenses this month</p>
            <p className="text-sm text-muted-foreground">Add expenses to see your spending summary</p>
          </div>
        ) : (
          <Tabs defaultValue="category">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="daily">Daily Spending</TabsTrigger>
            </TabsList>
            <TabsContent value="category" className="space-y-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2">
                {pieData.map((category) => (
                  <div 
                    key={category.name} 
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span>{formatCurrency(category.value)}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="daily">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#4EA8DE" 
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseSummary;
