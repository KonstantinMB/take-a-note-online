
import { useState } from "react";
import AddInvestmentForm from "@/features/investments/AddInvestmentForm";
import InvestmentsList from "@/features/investments/InvestmentsList";
import InvestmentSummary from "@/features/investments/InvestmentSummary";

const Investments = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInvestmentAdded = () => {
    // Trigger refresh of investment lists and summary
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-6">Investment Tracker</h1>
      
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Add form and Summary */}
        <div className="lg:col-span-5 space-y-6">
          <AddInvestmentForm onInvestmentAdded={handleInvestmentAdded} />
          <InvestmentSummary refreshTrigger={refreshTrigger} />
        </div>
        
        {/* Right column: Investments list */}
        <div className="lg:col-span-7">
          <InvestmentsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Investments;
