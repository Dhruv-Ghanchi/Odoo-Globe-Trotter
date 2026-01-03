# 🌍 GlobeTrotter — Intelligent Travel Planner

GlobeTrotter is a full-stack, database-driven travel planning web application built as part of the **Odoo Hackathon**.  
The project focuses on **clean backend architecture, strong database design, and fully dynamic data handling**, rather than static mockups or shortcuts.

---

## 🎯 Hackathon Objective

This project demonstrates:
- Real-world **backend & database design**
- Clean **REST API architecture**
- Fully **dynamic, database-driven UI**
- Secure **authentication & authorization**
- Scalable and explainable code suitable for production use

---

## 🚀 Core Features

### 🔐 Authentication & Security
- Secure Signup & Login
- Password hashing using **bcrypt**
- **JWT-based authentication**
- Protected routes with proper authorization
- Stateless and scalable auth flow

---

### 👤 User Profile Management
- View and update profile details (name, email)
- Secure password change with verification
- Account deletion support
- Clear separation between auth and user data

---

### ✈️ Trip Management
- Create, view, update, and delete trips
- Trips securely linked to authenticated users
- Dynamic trip data stored in PostgreSQL
- Ownership validation for all operations

---

### 🗺️ Activity & Itinerary Planning
- Add activities with date, time, city, and cost
- Activities grouped dynamically per trip
- Interactive itinerary builder
- Read-only itinerary view grouped by day and city

---

### 💰 Budget & Cost Insights
- Dynamic cost calculation using SQL aggregation
- Total trip cost computed on the fly
- Average cost per day
- Highlights high-spend days
- No derived values stored in the database

---

### 📊 Dashboard Insights
- Personalized dashboard
- Dynamic statistics:
  - Total trips
  - Total activities
  - Upcoming activities
- All values derived from database queries

---

### 🌐 Public Itinerary Sharing
- Read-only public itinerary view
- No authentication required
- No sensitive user data exposed
- Safe, controlled public access

---

## 🧠 What Makes This Project Strong

- No static or mock data
- Strong PostgreSQL schema with ownership checks
- Derived values computed dynamically (not stored)
- Clean separation: Routes → Controllers → Services → DB
- Demo-stable and easy to explain

---

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt (password hashing)
- express-validator (validation)

### Frontend
- React
- Vite
- React Router
- Axios
- Custom responsive CSS

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running)

---

### 1️⃣ Database Setup
```sql
CREATE DATABASE travel_planner;
