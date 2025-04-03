
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AddExpenseForm from "@/features/expenses/AddExpenseForm";
import ExpensesList from "@/features/expenses/ExpensesList";
import ExpenseSummary from "@/features/expenses/ExpenseSummary";
import CategoriesManager from "@/features/expenses/CategoriesManager";

const Expenses = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("expenses");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  const handleExpenseAdded = () => {
    // Trigger refresh of expense lists and summary
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCategorySelected = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8">Expenses Tracker</h1>
      
      <Tabs 
        defaultValue="expenses" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full flex flex-col items-center"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="w-full">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left column: Add form and Summary */}
            <div className="lg:col-span-5 space-y-8">
              <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
              <ExpenseSummary refreshTrigger={refreshTrigger} />
            </div>
            
            {/* Right column: Expenses list */}
            <div className="lg:col-span-7">
              <ExpensesList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="w-full">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-8">
              <CategoriesManager 
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelected}
                refreshTrigger={refreshTrigger}
                onCategoryUpdated={handleExpenseAdded}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
