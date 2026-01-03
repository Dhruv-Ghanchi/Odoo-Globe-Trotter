# Setup Instructions for Team Members

This guide will help you set up the project locally and test the login functionality.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (installed and running)
3. **Git** (to pull the code)

## Step-by-Step Setup

### 1. Clone/Pull the Repository

```bash
git pull origin main
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Database Setup

**Create the database:**
```bash
# Using psql
psql -U postgres
CREATE DATABASE travel_planner;
\q

# Or using createdb command
createdb travel_planner
```

**Run the schema:**
```bash
psql -d travel_planner -f schema.sql
```

**Create test user:**
```bash
npm run seed:test-user
```

This will create a test user with the following credentials:
- **Email:** `test@example.com`
- **Password:** `password123`

### 4. Environment Configuration

**Backend `.env` file:**
Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_planner
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration (optional - defaults to allowing localhost:3001, 3002, 5173)
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

**Frontend `.env` file:**
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Start the Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```
Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3002` (or another port if 3002 is taken)

### 6. Test Login

1. Open your browser and go to `http://localhost:3002`
2. You should be redirected to the login page
3. Use the test credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Login"
5. You should be redirected to the dashboard

## Troubleshooting

### "User doesn't exist" error
- Make sure you ran `npm run seed:test-user`
- Check that the database connection is working
- Verify the `.env` file has correct database credentials

### "Cannot connect to database" error
- Make sure PostgreSQL is running
- Check that the database `travel_planner` exists
- Verify database credentials in `.env` file

### CORS errors
- Make sure both backend and frontend are running
- Check that `CORS_ORIGIN` in backend `.env` includes your frontend URL
- Default configuration allows `localhost:3001`, `localhost:3002`, and `localhost:5173`

### Port already in use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use the next available port

## Already Logged In Behavior

If you're already logged in and try to access the login page:
- You'll see a message: "You are already logged in. Redirecting to dashboard..."
- After 1.5 seconds, you'll be automatically redirected to the dashboard

## Creating Your Own Account

You can also create your own account:
1. Go to the signup page
2. Enter your email and password
3. Click "Sign Up"
4. You'll be automatically logged in and redirected to the dashboard

## Need Help?

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Check the backend terminal for error messages
3. Verify all environment variables are set correctly
4. Make sure PostgreSQL is running and accessible

