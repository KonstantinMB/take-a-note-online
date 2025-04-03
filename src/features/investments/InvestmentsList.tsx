
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  MoreVertical, 
  Trash2, 
  Filter, 
  ChevronDown,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'purchase_date' | 'symbol'>('purchase_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { user } = useAuth();

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('investments')
          .select("*")
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .eq("user_id", user.id);

        if (error) throw error;
        
        setInvestments(data as Investment[] || []);
      } catch (error) {
        console.error("Error fetching investments:", error);
        toast.error("Failed to load investments");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchInvestments();
    }
  }, [user, refreshTrigger, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setInvestments((prev) => prev.filter((investment) => investment.id !== id));
      toast.success("Investment deleted");
    } catch (error) {
      console.error("Error deleting investment:", error);
      toast.error("Failed to delete investment");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatShares = (shares: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(shares);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          Loading investments...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Your Investments</CardTitle>
          <CardDescription>
            {investments.length} {investments.length === 1 ? "investment" : "investments"} found
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Sort by
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSortBy('purchase_date'); setSortOrder('desc'); }}>
              <Calendar className="h-4 w-4 mr-2" />
              Newest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy('purchase_date'); setSortOrder('asc'); }}>
              <Calendar className="h-4 w-4 mr-2" />
              Oldest first
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSortBy('symbol'); setSortOrder('asc'); }}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Symbol (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {investments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No investments found</p>
            <p className="text-sm text-muted-foreground">Add your first investment using the form</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {investments.map((investment) => (
                <div 
                  key={investment.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-background border"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-md flex items-center justify-center bg-blue-100 text-blue-600"
                    >
                      {investment.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <Badge 
                          variant="secondary" 
                          className="mr-2 font-mono"
                        >
                          {investment.symbol}
                        </Badge>
                        <span className="font-medium">
                          {formatShares(investment.shares)} shares
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm">
                          {formatCurrency(investment.purchase_price)} per share
                        </span>
                        <span className="text-xs text-muted-foreground mx-2">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(investment.purchase_date)}
                        </span>
                      </div>
                      {investment.notes && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {investment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-4">
                      <div className="font-medium">
                        {formatCurrency(investment.shares * investment.purchase_price)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total investment
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleDelete(investment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentsList;
