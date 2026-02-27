🔐 MERN Authentication System

A full-stack authentication system built using MongoDB, Express.js, React (Vite), and Node.js.

This project implements a secure authentication system with JWT tokens, email verification, refresh tokens, and role-based access control (Admin/User).

The project demonstrates real-world authentication practices used in modern web applications.

🚀 Features
🔑 Authentication

User Registration

Email Verification

User Login

Secure Logout

Persistent Login

JWT Authentication

Access Token & Refresh Token

HTTP-only Cookies

🔒 Security

Password hashing using bcrypt

JWT Authentication

HTTP-only cookies

Protected Routes

Authentication Middleware

Role-Based Authorization

👤 User Features

Register Account

Verify Email

Login

Logout

View Dashboard

👑 Admin Features

Admin Role System

Admin-only Route

Admin Panel

Role-based Middleware

🛠 Tech Stack
Frontend

React.js

Vite

TailwindCSS

Axios

React Router

Backend

Node.js

Express.js

MongoDB

Mongoose

Authentication

JWT Tokens

Access Token

Refresh Token

Security

bcrypt

HTTP-only Cookies

dotenv

Email

Nodemailer

Gmail SMTP

📁 Project Structure
auth-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   Login.jsx
│   │   │   Register.jsx
│   │   │   Dashboard.jsx
│   │   │   Admin.jsx
│   │   │
│   │   ├── components/
│   │   │   Navbar.jsx
│   │   │
│   │   ├── context/
│   │   │   AuthContext.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md
⚙️ Installation
Clone Repository
git clone https://github.com/YOUR_USERNAME/auth-system.git
Backend Setup
cd backend
npm install
npm run dev

Create .env file:

PORT=5001

MONGO_URI=mongodb://localhost:27017/auth_system

JWT_SECRET=secret123
REFRESH_SECRET=secret456

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173
Frontend Setup
cd frontend

npm install

npm run dev

Frontend:

http://localhost:5173

Backend:

http://localhost:5001
🔌 API Routes
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
Email
GET /api/auth/verifyEmail
POST /api/auth/forgot-password
POST /api/auth/reset-password
Admin
GET /api/auth/adminAccess
🔄 Authentication Flow
Register Flow

1 User registers
2 Verification email sent
3 User verifies email
4 Account activated

Login Flow

1 User logs in
2 Tokens generated
3 Cookies stored
4 /auth/me returns user
5 Dashboard loads

Persistent Login

1 User refreshes page
2 /auth/me called
3 Cookies verified
4 User stays logged in

🎯 Learning Outcomes

This project helped me learn:

MERN Stack Development

JWT Authentication

Refresh Tokens

HTTP-only Cookies

Email Verification

Role-based Authentication

React Context API

Protected Routes

👨‍💻 Author

Aditya Jadhav
MERN Stack Developer

⭐ Future Improvements

Google Login

Dark Mode

Profile Page

File Upload

OTP Verification