import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import MainPage from "./components/MainPage";
import AdminSignIn from "./(pages)/signin/page";
import Navigation from "./components/Navigation";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AppContent = () => {
  const location = useLocation();
  const showNav = location.pathname === "/admin";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<MainPage supabase={supabase} />} />
        <Route path="/admin" element={<AdminSignIn supabase={supabase} />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
