CREATE DATABASE IF NOT EXISTS servis_rezervacije;
USE servis_rezervacije;

CREATE TABLE IF NOT EXISTS korisnici (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ime VARCHAR(100) NOT NULL,
  prezime VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  telefon VARCHAR(50),
  role ENUM('user','admin') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS usluge (
  id INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(255) NOT NULL,
  opis TEXT
);

CREATE TABLE IF NOT EXISTS termini (
  id INT AUTO_INCREMENT PRIMARY KEY,
  datum DATE NOT NULL,
  vrijeme TIME NOT NULL,
  status ENUM('slobodno','rezervisano') DEFAULT 'slobodno'
);

CREATE TABLE IF NOT EXISTS rezervacije (
  id INT AUTO_INCREMENT PRIMARY KEY,
  korisnik_id INT NOT NULL,
  usluga_id INT NOT NULL,
  termin_id INT NOT NULL,
  napomena TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (korisnik_id) REFERENCES korisnici(id),
  FOREIGN KEY (usluga_id) REFERENCES usluge(id),
  FOREIGN KEY (termin_id) REFERENCES termini(id)
);
