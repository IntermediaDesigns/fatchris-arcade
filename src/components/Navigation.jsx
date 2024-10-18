import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="nes-container is-dark">
      <ul className="nes-list is-disc flex justify-center space-x-4">
        <li><Link to="/" className="nes-btn is-primary">Home</Link></li>
        <li><Link to="/admin" className="nes-btn is-success">Admin</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;