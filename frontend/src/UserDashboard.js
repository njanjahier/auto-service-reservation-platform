import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDashboard() {
  const [termini, setTermini] = useState([]);
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    telefon: "",
    vozilo: "",
    usluga_id: 1,  //  default vrijednost da ne baca 400
    termin_id: "",
    napomena: "",
  });

  useEffect(() => {
    // Učitaj slobodne termine sa servera
    axios.get("http://localhost:5000/termini")
      .then((res) => {
        setTermini(res.data);
      })
      .catch((err) => {
        console.error("Greška pri učitavanju termina:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/rezervacija", formData);
      alert(response.data.message || "Rezervacija uspešna!");

      // Resetuj formu
      setFormData({
        ime: "",
        prezime: "",
        email: "",
        telefon: "",
        vozilo: "",
        usluga_id: 1,  // ostaje default
        termin_id: "",
        napomena: "",
      });
    } catch (err) {
      console.error(err);
      alert("Greška prilikom slanja rezervacije.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Rezervacija termina</h2>

      <div className="row">
        {/* Forma za rezervaciju */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h5 className="mb-3 text-primary">Podaci o klijentu</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    name="ime"
                    className="form-control"
                    placeholder="Ime"
                    value={formData.ime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    name="prezime"
                    className="form-control"
                    placeholder="Prezime"
                    value={formData.prezime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="telefon"
                className="form-control mb-3"
                placeholder="Telefon"
                value={formData.telefon}
                onChange={handleChange}
              />

              <input
                type="text"
                name="vozilo"
                className="form-control mb-3"
                placeholder="Marka i model vozila"
                value={formData.vozilo}
                onChange={handleChange}
              />

              <textarea
                name="napomena"
                className="form-control mb-3"
                placeholder="Dodatne napomene (nije obavezno)"
                rows="3"
                value={formData.napomena}
                onChange={handleChange}
              />

              <button type="submit" className="btn btn-primary w-100">
                Pošalji rezervaciju
              </button>
            </form>
          </div>
        </div>

        {/* Lista slobodnih termina */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h5 className="mb-3 text-success">Slobodni termini</h5>
            {termini.length > 0 ? (
              <div className="list-group">
                {termini.map((t) => (
                  <label key={t.id} className="list-group-item">
                    <input
                      type="radio"
                      name="termin_id"
                      value={t.id}
                      className="form-check-input me-2"
                      onChange={handleChange}
                      required
                    />
                    {t.datum} u {t.vrijeme}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-muted">Nema slobodnih termina.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
