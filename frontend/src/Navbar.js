import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // vraća na login
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm"
      style={{ padding: "10px 40px" }}
    >
      <div className="container-fluid">
        {}
        <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center" to="/">
          <img
            src="/logo.png"         // 
            alt="Logo"
            style={{ width: "35px", height: "35px", marginRight: "10px" }}
          />
          Rezervacije
        </Link>

        {/* Hamburger meni za mobilne uređaje */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desni dio navigacije */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registracija
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <span className="nav-link text-white fw-semibold">
                    {user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-light btn-sm fw-semibold shadow-sm"
                  >
                    Odjavi se
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
