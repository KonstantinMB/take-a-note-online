
import { useState } from "react";
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
      
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Add form and Summary */}
        <div className="lg:col-span-5 space-y-8">
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
          <CategoriesManager 
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelected}
            refreshTrigger={refreshTrigger}
            onCategoryUpdated={handleExpenseAdded}
          />
          <ExpenseSummary refreshTrigger={refreshTrigger} />
        </div>
        
        {/* Right column: Expenses list */}
        <div className="lg:col-span-7">
          <ExpensesList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Expenses;
