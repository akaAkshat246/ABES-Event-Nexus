# 🎓 ABES Club Connect

> **Full-Stack Club Event Management Platform for ABES Engineering College, Ghaziabad**  
> *"Recognized among the best engineering colleges in Delhi NCR"* • [https://www.abes.ac.in/](https://www.abes.ac.in/)

---

## 🌟 Overview

**ABES Club Connect** is a responsive, full-stack event discovery and registration platform engineered specifically for **ABES Engineering College, Ghaziabad**. The platform enables students across all 4 academic years to discover, explore, and register for premier campus events run by student clubs (**TEDx ABES, Genero, TechFest, Utsaah, ACM, etc.**). It also provides college club coordinators and faculty administrators with an executive dashboard to manage events, track registrations, and export attendee data.

---

## 🚀 Key Features

### 🏛️ 1. Student / Public Portal
- **Landing Page (`/`):** Dynamic hero banner, campus statistics, **Spotlight Featured Event** with countdown, upcoming events carousel, and interactive **ABES Clubs Showcase**.
- **Search & Filter Catalog (`/events`):** Live debounced search by name/club/venue, dynamic category chips (Technical, Cultural, Sports, Workshop, Hackathon, Seminar), and URL query parameters sync (`?q=hack&category=Technical`).
- **Event Detail & Registration (`/events/:id`):** Full event description, agenda highlights, venue map details, seats availability progress bar, and instant registration.
- **Form Validation & Anti-Duplicate:** Client-side (Zod + React Hook Form) and server-side compound unique index on `(event, email)` to prevent duplicate registrations.
- **Digital E-Pass / Ticket Modal:** Auto-generated unique Ticket ID (e.g. `ABES-2026-XXXXX`), QR code verification badge, and one-click **Print / Save Pass**.

### 🛡️ 2. Admin & Faculty Portal
- **Secure Authentication (`/admin/login`):** JWT token-based auth with bcrypt encryption and protected route guards. Includes quick demo credential autofill for testing.
- **Analytics Dashboard (`/admin/dashboard`):** Real-time metrics (Total Events, Upcoming Events, Total Registrations, Velocity This Week), Category distribution charts, and Academic Year breakdowns.
- **Event CRUD Operations (`/admin/events`):** Create, update, preview, and delete events with live poster URL preview and cascade deletion of attendee registrations.
- **Registrations Table (`/admin/registrations`):** Search by attendee name/email/phone/ticket, filter by event or year, and **One-Click CSV Export**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, Tailwind CSS, Lucide React, React Hook Form, Zod, Axios |
| **Backend** | Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs, Zod, express-rate-limit, Morgan |
| **Database** | MongoDB with Mongoose (with automated In-Memory MongoDB fallback for zero-friction local setup) |
| **Branding** | ABES Deep Maroon (`#8B1E2E`), Dark Navy (`#0B2340`), Gold Accents (`#F59E0B`), Local ABES Crest Logo |

---

## 📁 Monorepo Layout

```
abes-club-connect/
├── client/                      # React 18 + Vite + TypeScript Frontend
│   ├── public/
│   │   └── assets/
│   │       ├── abes-logo.png    # ABES College logo reference
│   │       └── abes-logo.svg    # High-res vector emblem fallback
│   ├── src/
│   │   ├── api/                 # Typed Axios endpoints (events, registrations, auth)
│   │   ├── components/          # Navbar, Footer, EventCard, FeaturedEventCard, etc.
│   │   ├── context/             # AuthContext, ToastContext
│   │   ├── pages/               # Home, Events, EventDetail, AdminLogin, AdminDashboard, etc.
│   │   ├── types/               # Shared TypeScript interfaces
│   │   ├── App.tsx              # React Router configuration
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js       # ABES custom theme colors
│   └── package.json
│
├── server/                      # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/              # MongoDB connection with memory fallback
│   │   ├── controllers/         # eventController, registrationController, authController
│   │   ├── middleware/          # auth, errorHandler, validate
│   │   ├── models/              # Event.ts, Registration.ts, Admin.ts
│   │   ├── routes/              # Modular Express routers
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── scripts/
│   │   │   └── seed.ts          # Database seeder with realistic ABES events & admin
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **MongoDB** (Optional: local MongoDB server or Mongo URI in `.env`; if MongoDB is not installed, the app automatically boots an In-Memory MongoDB instance so you can run the app with 0 configuration!)

---

### 2. Installation

From the root directory:

```bash
# Install root, server, and client dependencies
npm run install:all
```

---

### 3. Environment Configuration

The repository includes pre-configured `.env` and `.env.example` files:

#### Server (`/server/.env`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/abes-club-connect
JWT_SECRET=abes_club_connect_jwt_secret_super_secure_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@abes.ac.in
ADMIN_PASSWORD=Admin@123
```

#### Client (`/client/.env`):
```env
VITE_API_URL=/api
```

---

### 4. Seed Sample Data (Admin & ABES Events)

Populate the database with the default admin account and sample events across TEDx, Genero, TechFest, Utsaah, ACM:

```bash
npm run seed
```

Default Admin Credentials created by seed:
- **Email:** `admin@abes.ac.in`
- **Password:** `Admin@123`

---

### 5. Run in Development Mode

Run both the Express backend and Vite frontend concurrently with a single command:

```bash
npm run dev
```

- 🌐 **Client Web App:** [http://localhost:5173](http://localhost:5173)
- 📡 **Server API:** [http://localhost:5000](http://localhost:5000)
- 🩺 **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- 🔐 **Admin Portal:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 📡 API Endpoints Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | API Health check & uptime |
| `GET` | `/api/events` | Public | List events (`?q=`, `?category=`, `?timeframe=`, `?page=`) |
| `GET` | `/api/events/:id` | Public | Get single event details & seats count |
| `POST` | `/api/events/:id/register` | Public (Rate Limited) | Register attendee for event |
| `POST` | `/api/auth/login` | Public | Admin login & returns JWT token |
| `GET` | `/api/auth/me` | Admin | Get current admin profile |
| `POST` | `/api/events` | Admin | Create new event |
| `PUT` | `/api/events/:id` | Admin | Update event details |
| `DELETE` | `/api/events/:id` | Admin | Delete event + cascade delete registrations |
| `GET` | `/api/registrations` | Admin | Get all registrations (`?q=`, `?event=`, `?year=`, `?format=csv`) |
| `GET` | `/api/events/:id/registrations` | Admin | Get registrations for specific event |
| `DELETE` | `/api/registrations/:id` | Admin | Delete registration ticket |
| `GET` | `/api/registrations/stats` | Admin | Dashboard summary analytics |

---

## 🎨 ABES College Branding Colors

| Color Token | Hex Code | Preview | Usage |
|---|---|---|---|
| `primary` | `#8B1E2E` | 🔴 Deep Maroon | Main buttons, badges, brand header |
| `secondary` | `#0B2340` | 🔵 Navy Blue | Dark sections, Navbar, footer, card backgrounds |
| `accent` | `#F59E0B` | 🟡 Warm Amber/Gold | Spotlight badges, highlights, stats |
| `slate-50` | `#F8FAFC` | ⚪ Off-White | Clean background canvas |

---

## 📜 License
Developed for **ABES Engineering College, Ghaziabad**.
