import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AdminSignIn = ({ supabase }) => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkAdminStatus(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const checkAdminStatus = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("is_admin")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error("Error checking admin status:", error.message);
      setError("Failed to verify admin status. Please try again.");
      setIsAdmin(false);
    }
  };

  const updateAttendance = async (willAttend) => {
    try {
      const { error } = await supabase
        .from("attendance")
        .upsert({
          date: new Date().toISOString().split("T")[0],
          will_attend: willAttend,
        })
        .eq("date", new Date().toISOString().split("T")[0]);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating attendance:", error.message);
      setError("Failed to update attendance. Please try again.");
    }
  };

  if (!session) {
    return (
      <div className="nes-container is-dark with-title h-screen flex flex-col justify-center items-center p-4">
        <div className="flex flex-col items-center gap-8">
          <i className="nes-logo"></i>
          <h2 className="title">Admin Sign In</h2>
        </div>
        <div className="w-full max-w-xs">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="nes-container is-dark with-title h-screen flex flex-col justify-center items-center">
      <h2 className="title">Admin Dashboard</h2>
      {isAdmin ? (
        <div className="space-y-4 w-full max-w-xs">
          <div className="space-y-2">
            <button
              onClick={() => updateAttendance(true)}
              className="nes-btn is-success w-full"
            >
              Yes
            </button>
            <button
              onClick={() => updateAttendance(false)}
              className="nes-btn is-error w-full"
            >
              No
            </button>
          </div>
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate("/");
            }}
            className="nes-btn is-primary w-full"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p className="nes-text is-error">
          You don&apos;t have admin privileges.
        </p>
      )}
    </div>
  );
};

export default AdminSignIn;
