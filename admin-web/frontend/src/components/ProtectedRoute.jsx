import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import supabase from "../lib/supabase";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setAuthorized(false);
          return;
        }

        const { data: account, error: accountError } = await supabase
          .from("accounts")
          .select("role")
          .eq("auth_user_id", session.user.id)
          .single();

        if (accountError || account?.role !== "admin") {
          setAuthorized(false);

          if (account?.role !== "admin") {
            await supabase.auth.signOut();
          }

          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Admin access check failed:", error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#292d45] text-white">
        Checking admin access...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
