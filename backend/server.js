require("dotenv").config(); // 👉 učitavanje .env fajla

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// 🔐 Tajni ključ za JWT iz .env fajla
const JWT_SECRET = process.env.JWT_SECRET;

// 🧰 Povezivanje na bazu iz .env fajla
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ✅ Test konekcije
db.connect((err) => {
  if (err) {
    console.error("Greška prilikom povezivanja:", err);
  } else {
    console.log("Povezan sa bazom!");
  }
});

// 🧪 Test ruta
app.get("/", (req, res) => {
  res.send("Backend radi!");
});

// 📌 Dohvati sve usluge
app.get("/usluge", (req, res) => {
  db.query("SELECT * FROM usluge", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 📅 Dohvati slobodne termine
app.get("/termini", (req, res) => {
  db.query("SELECT * FROM termini WHERE status='slobodno'", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// ➕ Dodavanje novog termina (admin)
app.post("/termini", (req, res) => {
  const { datum, vrijeme } = req.body;
  if (!datum || !vrijeme) {
    return res.status(400).json({ error: "Nedostaje datum ili vrijeme" });
  }

  db.query(
    "INSERT INTO termini (datum, vrijeme, status) VALUES (?, ?, 'slobodno')",
    [datum, vrijeme],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    }
  );
});

// 📝 Kreiranje nove rezervacije
app.post("/rezervacija", (req, res) => {
  let { ime, prezime, email, telefon, usluga_id, termin_id, napomena } = req.body;

  if (!usluga_id) usluga_id = 1;
  if (!ime || !prezime || !email || !termin_id) {
    return res.status(400).json({ error: "Nedostaju podaci" });
  }

  // Dodaj ili ažuriraj korisnika
  db.query(
    "INSERT INTO korisnici (ime, prezime, email, telefon) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE telefon=?",
    [ime, prezime, email, telefon, telefon],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const korisnikId = result.insertId;

      if (korisnikId) {
        napraviRezervaciju(korisnikId);
      } else {
        db.query(
          "SELECT id FROM korisnici WHERE email = ?",
          [email],
          (err2, results) => {
            if (err2) return res.status(500).json({ error: err2 });
            if (results.length === 0)
              return res.status(400).json({ error: "Greška: korisnik nije pronađen." });

            napraviRezervaciju(results[0].id);
          }
        );
      }

      function napraviRezervaciju(korisnik_id) {
        db.query(
          "INSERT INTO rezervacije (korisnik_id, usluga_id, termin_id, napomena) VALUES (?, ?, ?, ?)",
          [korisnik_id, usluga_id, termin_id, napomena],
          (err3, result3) => {
            if (err3) return res.status(500).json({ error: err3 });

            db.query(
              "UPDATE termini SET status='rezervisano' WHERE id=?",
              [termin_id],
              (err4) => {
                if (err4) return res.status(500).json({ error: err4 });
                res.json({ success: true, message: "Rezervacija uspješna!" });
              }
            );
          }
        );
      }
    }
  );
});

// 🛡️ JWT Middleware za zaštitu ruta
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token nedostaje" });

  jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Nevažeći token" });
    req.user = decoded;
    next();
  });
}

// 🧍 Registracija korisnika
app.post("/register", async (req, res) => {
  const { ime, prezime, email, password } = req.body;

  if (!ime || !prezime || !email || !password) {
    return res.status(400).json({ error: "Sva polja su obavezna" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO korisnici (ime, prezime, email, password, role) VALUES (?, ?, ?, ?, 'user')",
    [ime, prezime, email, hashedPassword],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email već postoji" });
        }
        return res.status(500).json({ error: err });
      }
      res.json({ success: true, message: "Registracija uspješna" });
    }
  );
});

// 🔑 Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM korisnici WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(401).json({ error: "Neispravni podaci" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: "Neispravna lozinka" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        ime: user.ime,
        prezime: user.prezime,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// 🔒 Zaštićena ruta za admina
app.get("/admin-data", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Pristup zabranjen" });
  }
  res.json({ message: "Dobrodošao, admin!" });
});

app.listen(port, () => {
  console.log(`✅ Server radi na portu ${port}`);
});
