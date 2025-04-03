
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "@/components/EmptyState";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

interface InvestmentsListProps {
  refreshTrigger: number;
}

const InvestmentsList = ({ refreshTrigger }: InvestmentsListProps) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .order('purchase_date', { ascending: false });

        if (error) throw error;

        setInvestments(data as Investment[]);
      } catch (error) {
        console.error("Error fetching investments:", error);
        toast.error("Failed to load investments");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [user, refreshTrigger]);

  const handleDeleteInvestment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investment?")) return;

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvestments(prevInvestments => 
        prevInvestments.filter(investment => investment.id !== id)
      );
      
      toast.success("Investment deleted");
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Failed to delete investment");
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-[400px] flex justify-center items-center">
        <div className="animate-pulse text-muted-foreground">Loading investments...</div>
      </Card>
    );
  }

  if (investments.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="py-6">
          <EmptyState
            icon={<Info className="h-8 w-8" />}
            title="No investments yet"
            description="Add your first investment to start tracking."
            className="py-10"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Value at Purchase</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell className="font-medium">{investment.symbol}</TableCell>
                  <TableCell>{investment.shares}</TableCell>
                  <TableCell>${investment.purchase_price.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(investment.purchase_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    ${(investment.shares * investment.purchase_price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleDeleteInvestment(investment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete investment</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentsList;
