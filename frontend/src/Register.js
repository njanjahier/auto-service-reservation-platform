// frontend/src/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 znakova.");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/register", {
        ime,
        prezime,
        email,
        password,
      });

      // opcionalno: show success message prije redirecta
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      // detaljna obrada greške iz backend-a
      const message =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : err.message || "Greška pri registraciji";
      setError(message);
      console.error("Register error:", err.response || err);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Registracija</h2>
      <form onSubmit={handleRegister} className="form-card">
        {error && <p className="error">{error}</p>}

        <input type="text" placeholder="Ime" value={ime} onChange={(e) => setIme(e.target.value)} required />
        <input type="text" placeholder="Prezime" value={prezime} onChange={(e) => setPrezime(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Lozinka (min 6 znakova)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Registruj se"}
        </button>
      </form>
    </div>
  );
}

export default Register;
