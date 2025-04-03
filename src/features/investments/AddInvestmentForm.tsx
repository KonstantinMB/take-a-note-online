import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import ConfettiEffect from "@/components/ConfettiEffect";

const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  shares: z.string().min(1, "Shares are required"),
  purchasePrice: z.string().min(1, "Purchase price is required"),
  purchaseDate: z.date(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddInvestmentForm = ({ onInvestmentAdded }: { onInvestmentAdded: () => void }) => {
  const { user } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      shares: "",
      purchasePrice: "",
      purchaseDate: new Date(),
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      const numericShares = parseFloat(values.shares.replace(/,/g, '.'));
      const numericPrice = parseFloat(values.purchasePrice.replace(/,/g, '.'));
      
      if (isNaN(numericShares) || isNaN(numericPrice)) {
        toast.error("Invalid number format");
        return;
      }

      const newInvestment = {
        user_id: user.id,
        symbol: values.symbol.toUpperCase(),
        shares: numericShares,
        purchase_price: numericPrice,
        purchase_date: format(values.purchaseDate, "yyyy-MM-dd"),
        notes: values.notes || null,
      };

      const { error } = await supabase
        .from('investments')
        .insert(newInvestment);

      if (error) throw error;

      toast.success("Investment added successfully");
      setShowConfetti(true);
      
      form.reset({
        symbol: "",
        shares: "",
        purchasePrice: "",
        purchaseDate: new Date(),
        notes: "",
      });
      
      onInvestmentAdded();
    } catch (error) {
      console.error("Error adding investment:", error);
      toast.error("Failed to add investment");
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Add New Investment</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Symbol</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="AAPL" 
                        autoCapitalize="characters"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Shares</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="text" 
                          placeholder="10" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                          <Input 
                            {...field} 
                            type="text" 
                            className="pl-7" 
                            placeholder="150.00" 
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {format(field.value, "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Add notes about this investment" 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full">
                <TrendingUp className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <ConfettiEffect isActive={showConfetti} />
    </>
  );
};

export default AddInvestmentForm;
