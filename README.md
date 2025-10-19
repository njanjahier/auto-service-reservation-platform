
## Auto Service Reservation Platform

Full-stack aplikacija za rezervaciju termina u auto servisima.  
Omogućava korisnicima da lako zakažu termine, dok administratori mogu upravljati dostupnim slotovima putem admin panela.

## Funkcionalnosti
- Registracija i prijava korisnika (JWT autentifikacija)  
- Korisnički dashboard za rezervaciju termina  
- Admin panel za dodavanje termina i upravljanje sistemom  
- Zaštićene rute (samo admin ima pristup određenim funkcijama)  
- MariaDB/MySQL baza podataka  
- Prikaz i ažuriranje statusa termina u realnom vremenu

## Korištene tehnologije
- **Frontend:** React, React Router, Axios, Bootstrap  
- **Backend:** Express.js, Node.js, JWT, Bcrypt, CORS  
- **Baza podataka:** MariaDB (kompatibilna sa MySQL)  
- **Autentifikacija:** JSON Web Tokens (JWT)

## Pokretanje projekta (lokalno):
1. Klonirati repozitorijum (ili preuzeti kao ZIP)  
2. Ući u `frontend` folder i instalirati zavisnosti:
   
   cd frontend
   npm install
   npm start
   
3. Ući u backend folder i instalirati zavisnosti:

    cd backend
    npm install
    node server.js
   
4. Kreirati bazu podataka (MariaDB/MySQL) i importovati odgovarajuće tabele.

Podešavanje .env fajla:
Da bi backend pravilno radio, potrebno je kreirati .env fajl unutar backend foldera sa sljedećim sadržajem:
JWT_SECRET=nekiSuperTajniKljuc
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=servis_rezervacije
CORS_ORIGIN=http://localhost:3000

- .env fajl se ne postavlja na GitHub — on treba da bude u .gitignore fajlu.

## Problem i rješenje
Tokom razvoja pojavio se problem sa registracijom korisnika, gdje se prilikom slanja podataka iz React forme vraćala greška:

"Greška pri registraciji. Pokušajte ponovo."

Nakon testiranja zahtjeva putem Invoke-WebRequest u PowerShell-u i provjere server logova, otkriveno je da je problem bio u komunikaciji fronta i backa (CORS podešavanja).

Rješenje: dodata je eksplicitna CORS konfiguracija u server.js:


const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

Nakon toga — registracija je radila ispravno.

Izgled aplikacije:Screenshotovi se nalaze u folderu screenshots unutar root projekta.

Napomena o bazi:
Aplikacija koristi MariaDB, ali je potpuno kompatibilna i sa MySQL bazom podataka.
Tabela korisnici koristi kolone za ime, prezime, email, lozinku i ulogu (user/admin), dok tabela termini čuva sve dostupne i rezervisane termine.


Autor: Sanja Savić
      2025.godina

