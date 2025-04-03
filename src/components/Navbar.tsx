
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Wallet, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
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

  // Calculate responsive visibility for nav items
  const visibleNavItems = filteredNavItems.slice(0, isMobile ? 0 : 4); // Show no items on mobile, up to 4 on small screens
  const hiddenNavItems = filteredNavItems.slice(isMobile ? 0 : 4); // All items hidden on mobile, the rest on desktop

  return (
    <nav className="py-3 px-4 sm:px-6 border-b border-border bg-background sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl mr-4">
            TakeANote
          </Link>

          {/* Desktop Navigation - Main Items */}
          <div className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors text-center flex items-center gap-1.5",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-accent"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* More menu for remaining items on desktop */}
            {hiddenNavItems.length > 0 && (
              <div className="hidden md:flex">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="px-2.5 py-1.5 h-auto text-foreground/60 hover:text-foreground hover:bg-accent"
                    >
                      More
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="w-full pt-16">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
                      {hiddenNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={cn(
                            "px-3 py-2 rounded-md text-sm font-medium transition-colors text-center flex flex-col items-center gap-2",
                            location.pathname === item.path
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/60 hover:text-foreground hover:bg-accent"
                          )}
                        >
                          {item.icon || <div className="w-4 h-4" />}
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          {/* User auth button */}
          <div className="hidden md:block">
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
      </div>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent className="w-full max-w-none pt-12 px-4">
          <div className="flex flex-col space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2.5 rounded-md text-base font-medium transition-colors flex items-center gap-3",
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
            
            <Separator className="my-2" />
            
            {user ? (
              <Button
                variant="ghost"
                className="justify-start w-full px-3 py-2.5 h-auto"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
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
    </nav>
  );
};

export default Navbar;
