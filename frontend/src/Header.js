import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="logo-container">
        <img src="/logo.png" alt="Logo" className="logo-icon" />
        <h1 className="logo-title">Rezervacija termina u autoservisu</h1>
      </div>

      <div className="links">
        {!user && (
          <>
            <Link to="/" className="link">
              Login
            </Link>
            <Link to="/register" className="link">
              Register
            </Link>
          </>
        )}
        {user && user.role === "user" && (
          <>
            <Link to="/dashboard" className="link">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="logoutBtn">
              Logout
            </button>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link to="/admin" className="link">
              Admin
            </Link>
            <button onClick={handleLogout} className="logoutBtn">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
