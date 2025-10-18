require("dotenv").config(); // učitava .env ako postoji

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 5000;

// CORS - dozvoli komunikaciju sa frontendom na localhost:3000 (promijeni pri deployu)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use(express.json());

// JWT secret iz .env (NEMA hardkodiranih tajni u produkciji)
const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";

// DB konekcija - koristi env varijable ako postoje, inače fallback na lokalni XAMPP
const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "servis_rezervacije",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
});

// Test konekcije
db.connect((err) => {
  if (err) {
    console.error("Greška prilikom povezivanja na bazu:", err.message);
    console.error("-> UPOZORENJE: Provjerite DB postavke i .env fajl.");
    process.exit(1);
  } else {
    console.log("✅ Povezan sa bazom!");
  }
});

// Middleware: verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token nedostaje" });

  jwt.verify(token.replace("Bearer ", ""), JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Nevažeći token" });
    req.user = decoded;
    next();
  });
}

/* JAVNE RUTE*/

// Health check
app.get("/", (req, res) => {
  res.send("Backend radi!");
});

// Dohvati slobodne termine
app.get("/termini", (req, res) => {
  db.query("SELECT * FROM termini WHERE status='slobodno'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Kreiranje rezervacije
app.post("/rezervacija", (req, res) => {
  let { ime, prezime, email, telefon, usluga_id, termin_id, napomena } = req.body;

  if (!ime || !prezime || !email || !termin_id) {
    return res.status(400).json({ error: "Nedostaju obavezni podaci (ime, prezime, email, termin)" });
  }

  const napraviRezervaciju = (korisnik_id) => {
    db.query(
      "INSERT INTO rezervacije (korisnik_id, usluga_id, termin_id, napomena) VALUES (?, ?, ?, ?)",
      [korisnik_id, usluga_id || 1, termin_id, napomena],
      (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        db.query("UPDATE termini SET status='rezervisano' WHERE id=?", [termin_id], (err4) => {
          if (err4) return res.status(500).json({ error: err4.message });
          res.json({ success: true, message: "Rezervacija uspješna! Status termina ažuriran." });
        });
      }
    );
  };

  db.query(
    "INSERT INTO korisnici (ime, prezime, email, telefon) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE telefon=?",
    [ime, prezime, email, telefon, telefon],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.insertId && result.insertId > 0) {
        napraviRezervaciju(result.insertId);
      } else {
        db.query("SELECT id FROM korisnici WHERE email = ?", [email], (err2, results) => {
          if (err2 || !results.length) return res.status(500).json({ error: "Greška pri dohvaćanju ID-a korisnika." });
          napraviRezervaciju(results[0].id);
        });
      }
    }
  );
});

/* AUTENTIFIKACIJA*/

// Registracija
app.post("/register", async (req, res) => {
  const { ime, prezime, email, password } = req.body;

  if (!ime || !prezime || !email || !password || password.length < 6) {
    return res.status(400).json({ error: "Sva polja su obavezna i lozinka mora biti min 6 znakova" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO korisnici (ime, prezime, email, password, role) VALUES (?, ?, ?, ?, 'user')",
      [ime, prezime, email, hashedPassword],
      (err) => {
        if (err) {
          console.error("SQL ERROR:", err);
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email već postoji" });
          }
          return res.status(500).json({ error: "Greška na serveru. Provjerite DB shemu." });
        }
        res.json({ success: true, message: "Registracija uspješna" });
      }
    );
  } catch (hashError) {
    console.error("Hashing error:", hashError);
    res.status(500).json({ error: "Greška pri hešovanju lozinke." });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email i lozinka su obavezni." });

  db.query("SELECT * FROM korisnici WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(401).json({ error: "Neispravni podaci (email nije pronađen)" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Neispravna lozinka" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "2h" });

    res.json({
      token,
      user: { id: user.id, ime: user.ime, prezime: user.prezime, email: user.email, role: user.role },
    });
  });
});

/* ADMIN RUTE zahtijevaju token*/

app.post("/termini", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Pristup zabranjen: Samo administratori mogu dodavati termine." });

  const { datum, vrijeme } = req.body;
  if (!datum || !vrijeme) return res.status(400).json({ error: "Nedostaje datum ili vrijeme" });

  db.query("INSERT INTO termini (datum, vrijeme, status) VALUES (?, ?, 'slobodno')", [datum, vrijeme], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId, message: "Novi termin uspješno dodan." });
  });
});

app.get("/admin-data", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Pristup zabranjen" });
  res.json({ message: `Dobrodošao, admin ${req.user.email}!` });
});

app.listen(port, () => {
  console.log(` Server radi na portu ${port}`);
});
