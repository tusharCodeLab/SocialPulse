import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

// Demo credentials — sign-in is handled locally, no network call needed
const DEMO_EMAIL = "tushar@gmail.com";
const DEMO_PASSWORD = "123456";
const DEMO_USER_KEY = "demo_user_active";

function makeDemoUser(): User {
  return {
    id: "demo-user-id",
    email: DEMO_EMAIL,
    app_metadata: {},
    user_metadata: { full_name: "Demo User" },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        localStorage.removeItem(DEMO_USER_KEY);
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else {
        const isDemoActive = localStorage.getItem(DEMO_USER_KEY) === "true";
        if (isDemoActive) {
          setUser(makeDemoUser());
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo user if offline/network error
        if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          const demoUser = makeDemoUser();
          localStorage.setItem(DEMO_USER_KEY, "true");
          setUser(demoUser);
          return {};
        }
        return { error: error.message };
      }

      return {};
    } catch (err) {
      // Fallback for demo user if network error
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const demoUser = makeDemoUser();
        localStorage.setItem(DEMO_USER_KEY, "true");
        setUser(demoUser);
        return {};
      }
      console.error("Sign in error:", err);
      return { error: "Failed to sign in" };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (err) {
      console.error("Sign up error:", err);
      return { error: "Failed to sign up" };
    }
  };

  const signOut = async () => {
    // Clear demo session
    if (localStorage.getItem(DEMO_USER_KEY) === "true") {
      localStorage.removeItem(DEMO_USER_KEY);
      setUser(null);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
