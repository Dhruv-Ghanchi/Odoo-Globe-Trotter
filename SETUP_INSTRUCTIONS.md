# Setup Instructions - Running the Development Server

## Issue: `npm run dev` Not Working

The server might be hanging because of missing configuration or database connection issues.

## Step-by-Step Setup

### 1. Create `.env` File

Create a `.env` file in the root directory (`C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter\.env`) with:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_planner
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3001
```

**Important**: Replace `your_postgres_password` with your actual PostgreSQL password.

### 2. Ensure PostgreSQL is Running

- Check if PostgreSQL service is running
- Verify you can connect to PostgreSQL

### 3. Create the Database

```bash
# Open PostgreSQL command line or pgAdmin
createdb travel_planner

# Or using psql:
psql -U postgres
CREATE DATABASE travel_planner;
\q
```

### 4. Run Database Schema

```bash
psql -U postgres -d travel_planner -f schema.sql
```

### 5. Start Backend Server

```bash
cd "C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter"
npm run dev
```

### 6. Start Frontend Server (in a new terminal)

```bash
cd "C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter\frontend"
npm run dev
```

## Troubleshooting

### If `npm run dev` hangs or shows database errors:

1. **Check .env file exists**: Make sure `.env` is in the root directory
2. **Check PostgreSQL is running**: 
   ```bash
   # Windows
   Get-Service postgresql*
   ```
3. **Check database exists**:
   ```bash
   psql -U postgres -l
   ```
4. **Check database connection**:
   ```bash
   psql -U postgres -d travel_planner
   ```

### If you see "Cannot find module" errors:

Run:
```bash
npm install
```

### If port 3000 is already in use:

Change PORT in `.env` to a different port (e.g., 3002)

## Quick Test

To test if the server can start without database:

1. Temporarily comment out database connection in `server.js`
2. Or set a dummy DB_PASSWORD in `.env`
3. Start server and check if it runs (will fail on first API call, but server will start)

## Expected Output

When `npm run dev` works, you should see:
```
🚀 Server running on port 3000
📝 Environment: development
🌐 API available at http://localhost:3000/api
✅ Database connection established
```


