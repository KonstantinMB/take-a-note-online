
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Wallet, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navigation = [
    { path: "/", label: "Home", requiresAuth: false },
    { path: "/notes", label: "Notes", requiresAuth: true },
    { path: "/todo", label: "To-Do", requiresAuth: true },
    { path: "/calendar", label: "Calendar", requiresAuth: true },
    { path: "/references", label: "References", requiresAuth: true },
    { path: "/expenses", label: "Expenses", requiresAuth: true, icon: <Wallet className="h-4 w-4" /> },
    { path: "/investments", label: "Investments", requiresAuth: true, icon: <TrendingUp className="h-4 w-4" /> },
  ];

  const filteredNavItems = navigation.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl">
            TakeANote
          </Link>
          
          <nav className="flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
