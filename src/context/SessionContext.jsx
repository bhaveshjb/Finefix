import { createContext, useState, useEffect } from "react";
import supabase from "@/integrations/supabase";

export const SessionContext = createContext({
  session: null,
  setSession: (session) => {},
  getSession: async () => {},
  signInWithPassword: async (email, password) => {},
  logout: async () => {},
  supabase: null,
});

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("getSession", session);
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    setSession(data.session);
    return data.session;
  };

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error);
      return null;
    }

    setSession(data.session);
    return data.session;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return null;
    }

    setSession(null);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        getSession,
        signInWithPassword,
        logout,
        supabase,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
