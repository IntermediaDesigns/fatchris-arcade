import { Link, useNavigate } from "react-router-dom";

const Navigation = ({ supabase }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client is not properly initialized');
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error.message);
      // You might want to show an error message to the user here
    }
  };

  return (
    <nav className="nes-container is-dark">
      <ul className="nes-list is-disc flex justify-between items-center">
        <div className="flex space-x-4">
          <li><Link to="/" className="nes-btn is-primary">Home</Link></li>
        </div>
        <li>
          <button onClick={handleSignOut} className="nes-btn is-error">Sign Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;