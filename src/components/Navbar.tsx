
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet, Layers } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const navItems = [
    { path: "/todo", label: "Todo", requiresAuth: true },
    { path: "/calendar", label: "Calendar", requiresAuth: true },
    { path: "/references", label: "References", requiresAuth: true },
    { path: "/expenses", label: "Expenses", requiresAuth: true },
    { path: "/budget", label: "Budget", requiresAuth: true }, // New budget route
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-bold flex items-center gap-2"
        >
          <Layers className="h-6 w-6" />
          Lovable
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems
            .filter(item => !item.requiresAuth || isAuthenticated)
            .map((item) => (
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
                {item.path === "/expenses" && <Wallet className="h-4 w-4" />}
                {item.path === "/budget" && <Wallet className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
          {isAuthenticated && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              {navItems
                .filter(item => !item.requiresAuth || isAuthenticated)
                .map((item) => (
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
                    {item.path === "/expenses" && <Wallet className="h-4 w-4" />}
                    {item.path === "/budget" && <Wallet className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              {isAuthenticated && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
