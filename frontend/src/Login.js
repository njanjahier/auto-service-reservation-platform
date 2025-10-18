import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // pošalji login zahtjev serveru
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // preuzmi token i podatke korisnika
      const { token, user } = response.data;

      // sačuvaj korisnika i token
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      // redirekcija po ulozi
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Pogrešan email ili lozinka");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ minWidth: "380px", borderRadius: "12px" }}>
        <h3 className="card-title text-center mb-4 text-primary fw-bold">Prijava</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger text-center">{error}</p>}

          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Email adresa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fs-5 shadow-sm"
            style={{ borderRadius: "8px" }}
          >
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
