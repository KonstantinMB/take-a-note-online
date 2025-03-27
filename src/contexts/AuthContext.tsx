
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { session: Session | null };
  }>;
  signup: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { user: User | null; session: Session | null };
  }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('Auth state changed:', event, newSession?.user?.email);
          setSession(newSession);
          setUser(newSession?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      return {
        data: { session: response.data.session },
        error: response.error
      };
    } catch (err) {
      console.error('Login error:', err);
      return {
        data: { session: null },
        error: new AuthError('An unexpected error occurred during login')
      };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signUp({ email, password });
      return {
        data: { 
          user: response.data.user,
          session: response.data.session
        },
        error: response.error
      };
    } catch (err) {
      console.error('Signup error:', err);
      return {
        data: { user: null, session: null },
        error: new AuthError('An unexpected error occurred during signup')
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        login, 
        signup,
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
