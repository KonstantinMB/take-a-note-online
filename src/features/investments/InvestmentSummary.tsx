
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Investment {
  id: string;
  symbol: string;
  shares: number;
  purchase_price: number;
  purchase_date: string;
  notes: string | null;
  created_at: string;
}

interface InvestmentSummaryData {
  name: string;
  value: number;
}

interface InvestmentSummaryProps {
  refreshTrigger: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'];

const InvestmentSummary = ({ refreshTrigger }: InvestmentSummaryProps) => {
  const [investmentData, setInvestmentData] = useState<InvestmentSummaryData[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*');

        if (error) throw error;
        
        // Process investment data for chart
        const investments = data as Investment[];
        const bySymbol = investments.reduce((acc: Record<string, number>, curr: Investment) => {
          const value = curr.shares * curr.purchase_price;
          if (acc[curr.symbol]) {
            acc[curr.symbol] += value;
          } else {
            acc[curr.symbol] = value;
          }
          return acc;
        }, {});

        const chartData: InvestmentSummaryData[] = Object.keys(bySymbol).map((symbol) => ({
          name: symbol,
          value: bySymbol[symbol]
        }));

        setInvestmentData(chartData);
        
        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        setTotalValue(total);

      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    };

    fetchInvestments();
  }, [user, refreshTrigger]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background border p-2 rounded shadow-sm">
          <p className="font-medium">{`${data.name}`}</p>
          <p>{`$${data.value.toFixed(2)}`}</p>
          <p>{`${((data.value / totalValue) * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-muted-foreground">Total Value:</span> 
          <span className="font-bold ml-2">${totalValue.toFixed(2)}</span>
        </div>
        
        {investmentData.length > 0 ? (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={investmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {investmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[250px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Add investments to see your portfolio allocation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentSummary;
