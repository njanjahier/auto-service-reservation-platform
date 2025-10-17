const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "servis_rezervacije",
});

db.connect(err => {
  if (err) throw err;
  console.log("Povezano na bazu");

  const admin = ['Admin', 'Admin', 'admin@example.com', '1234', 'admin'];

  db.query(
    "INSERT INTO korisnici (ime, prezime, email, password, role) VALUES (?, ?, ?, ?, ?)",
    admin,
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log("Admin već postoji.");
        } else {
          console.error(err);
        }
      } else {
        console.log("Admin kreiran:", result.insertId);
      }
      db.end();
    }
  );
});
