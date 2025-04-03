
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
  Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface Investment {
  id: string;
  user_id: string;
  symbol: string;
  shares: number;
  purchase_price: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
}

interface InvestmentSummaryProps {
  refreshTrigger: number;
}

const InvestmentSummary = ({ refreshTrigger }: InvestmentSummaryProps) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalInvested, setTotalInvested] = useState(0);
  const { user } = useAuth();

  const colors = [
    "#4EA8DE", "#5E60CE", "#7400B8", "#6930C3", "#5390D9", 
    "#48BFE3", "#64DFDF", "#80FFDB", "#56CFE1", "#8338EC",
    "#3A0CA3", "#4361EE", "#4CC9F0"
  ];

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('investments')
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;
        
        setInvestments(data as Investment[] || []);
        
        // Calculate total invested
        const total = (data || []).reduce((sum, investment) => sum + (investment.shares * investment.purchase_price), 0);
        setTotalInvested(total);
      } catch (error) {
        console.error("Error fetching investments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInvestments();
    }
  }, [user, refreshTrigger]);

  // Prepare data for stock allocation chart
  const stockData = investments.reduce<Record<string, number>>((acc, investment) => {
    const value = investment.shares * investment.purchase_price;
    if (!acc[investment.symbol]) {
      acc[investment.symbol] = 0;
    }
    acc[investment.symbol] += value;
    return acc;
  }, {});

  const pieData = Object.entries(stockData).map(([symbol, amount]) => ({
    name: symbol,
    value: amount
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
        <CardTitle className="text-xl">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Portfolio Value</p>
            <h2 className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                formatCurrency(totalInvested)
              )}
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No investments yet</p>
            <p className="text-sm text-muted-foreground">Add investments to see your portfolio summary</p>
          </div>
        ) : (
          <Tabs defaultValue="allocation">
            <TabsList className="grid w-full grid-cols-1 mb-4">
              <TabsTrigger value="allocation">Stock Allocation</TabsTrigger>
            </TabsList>
            <TabsContent value="allocation" className="space-y-4">
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
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={colors[index % colors.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2">
                {pieData.map((stock, index) => (
                  <div 
                    key={stock.name} 
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span>{stock.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{formatCurrency(stock.value)}</span>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(stock.value / totalInvested * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;
