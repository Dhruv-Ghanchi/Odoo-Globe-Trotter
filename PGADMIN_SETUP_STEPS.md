# pgAdmin Setup Steps

## Step 1: Connect to PostgreSQL Server

1. In pgAdmin, look at the left sidebar
2. Find "Servers" section
3. Right-click on "Servers" → "Register" → "Server"
4. In the "General" tab:
   - Name: `Local PostgreSQL` (or any name you like)
5. In the "Connection" tab:
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `DamnThisMF` (your password)
6. Click "Save"

## Step 2: Create the Database

1. In the left sidebar, expand "Servers"
2. Expand your server (e.g., "Local PostgreSQL")
3. Expand "Databases"
4. Right-click on "Databases" → "Create" → "Database"
5. In the "General" tab:
   - Database: `travel_planner`
6. Click "Save"

## Step 3: Run the Schema

1. In the left sidebar, expand "Databases"
2. Click on `travel_planner` database
3. Click on "Tools" in the menu bar → "Query Tool" (or press Alt+Shift+Q)
4. Click the "Open File" icon (folder icon) in the Query Tool
5. Navigate to: `C:\Users\Ghanchi\Desktop\Odoo GlobeTrotter\schema.sql`
6. Open the file
7. Click the "Execute" button (play icon) or press F5
8. You should see "Success" message at the bottom

## Step 4: Verify Tables Created

1. In the left sidebar, expand `travel_planner` database
2. Expand "Schemas"
3. Expand "public"
4. Expand "Tables"
5. You should see three tables:
   - `users`
   - `trips`
   - `activities`

## Step 5: Test the Connection

After completing the above steps, the backend should be able to connect!

