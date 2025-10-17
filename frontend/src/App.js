import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import UserDashboard from "./UserDashboard.js";
import AdminDashboard from "./AdminDashboard.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Navbar from "./Navbar.js";
import Footer from "./Footer.js"; 
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  // učitaj user-a iz localStorage pri pokretanju
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      {/* Navigacija */}
      <Navbar user={user} setUser={setUser} />

      {/*Glavni sadržaj */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/*Footer na svakoj stranici */}
      <Footer />
    </Router>
  );
}

export default App;
