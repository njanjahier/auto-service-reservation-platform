
# Auto Service Reservation Platform

A full-stack web application for managing and booking auto service appointments.  
The platform allows customers to easily schedule service slots, while administrators can manage availability, users, and system settings through a dedicated admin panel.

---

## 🚀 Features

### 👤 User Features
- User registration and login (JWT authentication)
- User dashboard for viewing and booking available service slots
- Real-time updates on appointment status
- Booking cancellation and status tracking

### 🛠️ Admin Features
- Admin-only protected routes
- Create, edit, and delete available time slots
- Manage reservations and system settings
- Full CRUD operations over services and schedules
- Real-time updates for bookings and slot availability

### 🔧 System Features
- REST API built with Express.js
- MariaDB/MySQL relational database
- Secure password hashing (bcrypt)
- CORS protection and properly configured client–server communication
- Modular full-stack architecture (React + Node.js)

---

## 🛑 Problem Encountered During Development (and Solution)

During development, a recurring error appeared when attempting user registration:

**"Registration error. Please try again."**

After debugging using `Invoke-WebRequest` in PowerShell and reviewing backend logs, the issue was identified as **a CORS configuration problem**—the frontend client was not authorized to communicate with the backend API.

### ✅ Solution  
Explicit CORS configuration was added to `server.js`:

```javascript
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

### 🧱 Tech Stack
Frontend: React, React Router, Axios, Bootstrap, Backend.
Backend: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt, CORS.

### Database: MariaDB (fully compatible with MySQL)


###📦 Local Setup
1. Clone the repository
git clone https://github.com/njanjahier/auto-service-reservation-platform.git

2. Setup the Frontend
cd frontend
npm install
npm start


This will start the frontend on:
http://localhost:3000

3. Setup the Backend
cd backend
npm install
node server.js


Backend will run on your configured port (default: http://localhost:5000
 or similar).

###🗄️ Database Setup (MariaDB / MySQL)

Create a database named:
servis_rezervacije

Import the SQL tables provided in the project.

Ensure that your user has proper permissions (SELECT, INSERT, UPDATE, DELETE).

###🔐 Environment Variables (.env)

Create a .env file in the backend folder:

JWT_SECRET=yourSuperSecretKey
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=
DB_NAME=servis_rezervacije
CORS_ORIGIN=http://localhost:3000


⚠️ Do NOT upload .env to GitHub.
It must be added to .gitignore.

### 🖼️ Screenshots

All screenshots of the application UI can be found in the folder:

/screenshots


Add them to the README if you want a visually appealing presentation (recommended).

### 💾 Database Notes

MariaDB is used, but the application is fully compatible with MySQL.

Users table stores:
first_name, last_name, email, password_hash, role (user/admin)

Appointments table stores:
date, time, status, user_id, and system-assigned metadata.

### 📅 Future Improvements (Roadmap)

- Email/SMS notifications for reservation reminders
- Token refresh logic (silent token renewal)
- Admin dashboard analytics (daily/weekly appointment metrics)
- Workshop multi-location support
- Role-based access control (RBAC) with multiple admin levels
- Dockerization and deployment pipeline
- Unit and integration test coverage (Jest / Supertest)

