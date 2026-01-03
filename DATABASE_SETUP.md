# Database Setup Instructions

## Issue: "Database error while finding user"

This error means the database connection is failing. You need to set up the PostgreSQL database.

## Step 1: Check PostgreSQL is Running

1. Open **Services** (Windows Key + R, type `services.msc`)
2. Look for **PostgreSQL** service
3. Make sure it's **Running**

## Step 2: Create the Database

### Option A: Using pgAdmin (GUI)
1. Open **pgAdmin**
2. Connect to your PostgreSQL server
3. Right-click on **Databases** → **Create** → **Database**
4. Name: `travel_planner`
5. Click **Save**

### Option B: Using Command Line
1. Open **Command Prompt** or **PowerShell**
2. Navigate to PostgreSQL bin directory (usually `C:\Program Files\PostgreSQL\<version>\bin`)
3. Run:
   ```bash
   createdb -U postgres travel_planner
   ```
4. Enter your PostgreSQL password when prompted

### Option C: Using psql
1. Open **Command Prompt** or **PowerShell**
2. Navigate to PostgreSQL bin directory
3. Run:
   ```bash
   psql -U postgres
   ```
4. Enter your password
5. Run:
   ```sql
   CREATE DATABASE travel_planner;
   ```
6. Exit: `\q`

## Step 3: Run the Schema

### Option A: Using pgAdmin
1. Open **pgAdmin**
2. Connect to `travel_planner` database
3. Click **Tools** → **Query Tool**
4. Open the file: `C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter\schema.sql`
5. Copy all contents and paste into Query Tool
6. Click **Execute** (F5)

### Option B: Using psql Command Line
1. Open **Command Prompt** or **PowerShell**
2. Navigate to project directory:
   ```bash
   cd "C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter"
   ```
3. Navigate to PostgreSQL bin directory and run:
   ```bash
   psql -U postgres -d travel_planner -f schema.sql
   ```
4. Enter your password when prompted

### Option C: Using Node.js Script
1. Open **Command Prompt** or **PowerShell**
2. Navigate to project directory:
   ```bash
   cd "C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter"
   ```
3. Run:
   ```bash
   node scripts/init-db.js
   ```

## Step 4: Verify Database Setup

Test if tables were created:
```sql
-- Connect to database
psql -U postgres -d travel_planner

-- Check tables
\dt

-- Should show: users, trips, activities
```

## Step 5: Verify .env File

Make sure your `.env` file has correct database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_planner
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
```

## Step 6: Restart Backend Server

After setting up the database:
1. Stop the backend server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "Database does not exist"
- Make sure you created the database (Step 2)

### "Password authentication failed"
- Check your `.env` file has the correct password
- Try resetting PostgreSQL password

### "Connection refused"
- Make sure PostgreSQL service is running
- Check DB_HOST and DB_PORT in `.env`

### "Relation does not exist"
- Run the schema.sql file (Step 3)

## Quick Test

After setup, test the connection:
```bash
# In PowerShell
$body = @{email='test@example.com';password='password123'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:3000/api/auth/signup' -Method POST -ContentType 'application/json' -Body $body
```

If successful, you should see a response with `"success": true` and user data.


