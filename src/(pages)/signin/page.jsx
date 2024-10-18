import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const AdminSignIn = ({ supabase }) => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdminStatus(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("admins")
      .select("is_admin")
      .eq("user_id", userId)
      .single();
    if (error) console.error("Error checking admin status:", error);
    setIsAdmin(data?.is_admin || false);
  };

  const updateAttendance = async (willAttend) => {
    const { error } = await supabase
      .from("attendance")
      .upsert({ date: new Date().toISOString().split("T")[0], will_attend: willAttend })
      .eq("date", new Date().toISOString().split("T")[0]);
    if (error) console.error("Error updating attendance:", error);
  };

  if (!session) {
    return (
      <div className="nes-container is-dark with-title min-h-screen flex flex-col justify-center items-center p-4">
        <h2 className="title">Admin Sign In</h2>
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
    <div className="nes-container is-dark with-title min-h-screen flex flex-col justify-center items-center">
      <h2 className="title">Admin Dashboard</h2>
      {isAdmin ? (
        <div className="space-y-4 w-full max-w-xs">
          <div className="space-y-2">
            <button
              onClick={() => updateAttendance(true)}
              className="nes-btn is-success w-full"
            >
              Set Today&apos;s Attendance to Yes
            </button>
            <button
              onClick={() => updateAttendance(false)}
              className="nes-btn is-error w-full"
            >
              Set Today&apos;s Attendance to No
            </button>
          </div>
          <button
            onClick={() => {
              supabase.auth.signOut();
              navigate('/');
            }}
            className="nes-btn is-primary w-full"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p className="nes-text is-error">You don&apos;t have admin privileges.</p>
      )}
    </div>
  );
};

export default AdminSignIn;