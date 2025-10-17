import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [termini, setTermini] = useState([]);
  const [noviTermin, setNoviTermin] = useState({ datum: "", vrijeme: "" });

  useEffect(() => {
    ucitajTermine();
  }, []);

  const ucitajTermine = () => {
    axios.get("http://localhost:5000/termini").then((res) => setTermini(res.data));
  };

  const handleChange = (e) => {
    setNoviTermin({ ...noviTermin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/termini", noviTermin);
      alert("Termin dodat!");
      setNoviTermin({ datum: "", vrijeme: "" });
      ucitajTermine();
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju termina.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Admin Dashboard</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h5 className="mb-3 text-primary">Dodaj novi termin</h5>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                name="datum"
                className="form-control mb-3"
                value={noviTermin.datum}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                name="vrijeme"
                className="form-control mb-3"
                value={noviTermin.vrijeme}
                onChange={handleChange}
                required
              />
              <button type="submit" className="btn btn-success w-100">
                Dodaj termin
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h5 className="mb-3 text-success">Postojeći termini</h5>
            <ul className="list-group">
              {termini.map((t) => (
                <li key={t.id} className="list-group-item d-flex justify-content-between">
                  {t.datum} u {t.vrijeme}
                  <span
                    className={`badge ${
                      t.status === "slobodno" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
