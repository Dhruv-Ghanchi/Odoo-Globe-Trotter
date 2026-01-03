# 🌍 GlobeTrotter — Intelligent Travel Planner  
*A full-stack, database-driven travel planning platform built for the Odoo Hackathon.*

GlobeTrotter helps users plan trips, manage itineraries, and track travel costs using a **clean backend architecture**, **strong PostgreSQL data modeling**, and a **fully dynamic React UI**.

---

## 🖼️ Screenshots

> *(Add screenshots here before final submission)*

| Login & Signup | Dashboard |
|---------------|-----------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Trips | Itinerary |
|------|-----------|
| ![Trips](screenshots/trips.png) | ![Itinerary](screenshots/itinerary.png) |

| Budget View | Public Itinerary |
|------------|------------------|
| ![Budget](screenshots/budget.png) | ![Public](screenshots/public.png) |

---

## 🎯 Why This Project Stands Out

- Fully **dynamic, database-driven** application
- Strong **backend & SQL aggregation logic**
- Clean **REST API design**
- Proper **authentication & data isolation**
- No mock data, no hardcoded business values
- Demo-stable and easy to explain

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Secure signup & login
- Password hashing with **bcrypt**
- **JWT-based authentication**
- Protected routes and ownership checks

### ✈️ Trip & Activity Management
- Create, update, delete trips
- Add activities with date, time, city, and cost
- Activities dynamically grouped per trip

### 🗺️ Itinerary Planning
- Interactive itinerary builder
- Read-only itinerary view grouped by day and city
- Timeline-style visualization

### 💰 Budget & Cost Insights
- Total trip cost computed dynamically
- Average cost per day
- Highlights high-spend days
- No derived values stored in DB

### 📊 Dashboard Insights
- Total trips
- Total activities
- Upcoming activities
- All stats computed using SQL aggregation

### 🌐 Public Itinerary Sharing
- Read-only public itinerary view
- No authentication required
- No sensitive user data exposed

---

## 🧪 Tech Stack

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- express-validator

**Frontend**
- React
- Vite
- React Router
- Axios
- Custom responsive CSS

---

## ⚙️ Quick Start (For Judges)

### 1️⃣ Database
```sql
CREATE DATABASE travel_planner;
