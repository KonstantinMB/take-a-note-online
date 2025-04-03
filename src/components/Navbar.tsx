
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Changed from signOut to logout
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

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const filteredNavItems = navigation.filter(item => 
    !item.requiresAuth || (item.requiresAuth && user)
  );

  return (
    <nav className="py-4 px-6 border-b border-border bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-2">
          <Link to="/" className="font-bold text-xl">
            TakeANote
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors text-center flex items-center gap-2",
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
                onClick={logout} // Changed from signOut to logout
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent className="w-full">
            <div className="flex flex-col space-y-2 pt-2 pb-3 items-center">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-base font-medium transition-colors text-center w-full flex items-center gap-2",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent"
                  )}
                  onClick={closeMenu}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {user ? (
                <Button
                  variant="ghost"
                  className="justify-center w-full"
                  onClick={() => {
                    logout(); // Changed from signOut to logout
                    closeMenu();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link to="/auth" onClick={closeMenu} className="w-full">
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
