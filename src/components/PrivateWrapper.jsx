import { useState, useCallback, useEffect } from "react";
import { Outlet, redirect } from "react-router-dom";
import supabase from "@/integrations/supabase";
import { Loader2 } from "lucide-react";

const PrivateWrapper = ({ fallbackRoute = "/login" }) => {
  const [session, setSession] = useState(null);

  const handleRedirect = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect(fallbackRoute);
      return;
    }

    setSession(session);
  }, [fallbackRoute]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  if (!session) {
    return <Loader2 className="animate-spin text-gray-500" />;
  }

  return <Outlet />;
};

export default PrivateWrapper;
