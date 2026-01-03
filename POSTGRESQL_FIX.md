# PostgreSQL Connection Issue - ECONNREFUSED

## Error Found
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

This means **PostgreSQL is not running** or not accessible on port 5432.

## Solutions

### Option 1: Start PostgreSQL Service

1. **Open Services**:
   - Press `Windows Key + R`
   - Type `services.msc` and press Enter

2. **Find PostgreSQL Service**:
   - Look for services named:
     - `postgresql-x64-XX` (where XX is version number)
     - `PostgreSQL Server XX`
     - `postgresql-x64`

3. **Start the Service**:
   - Right-click on the PostgreSQL service
   - Click **Start**
   - Wait for it to start (Status should change to "Running")

4. **Set to Auto-Start** (Optional):
   - Right-click → Properties
   - Set "Startup type" to **Automatic**
   - Click OK

### Option 2: Check if PostgreSQL is Installed

If you don't see PostgreSQL in Services:

1. **Check if PostgreSQL is installed**:
   - Open Control Panel → Programs and Features
   - Look for "PostgreSQL"

2. **If not installed**, download and install:
   - Go to: https://www.postgresql.org/download/windows/
   - Download PostgreSQL installer
   - Install with default settings
   - Remember the password you set during installation

3. **Update .env file** with the correct password

### Option 3: Check PostgreSQL Port

If PostgreSQL is running but on a different port:

1. **Find PostgreSQL data directory** (usually `C:\Program Files\PostgreSQL\<version>\data`)
2. **Check `postgresql.conf`** for `port = 5432`
3. **Or check `pg_hba.conf`** for connection settings

### Option 4: Use Different Database (If PostgreSQL Not Available)

If you can't use PostgreSQL, you would need to:
- Install PostgreSQL (recommended)
- Or modify the application to use a different database (not recommended for this project)

## After Starting PostgreSQL

1. **Restart your backend server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test connection again**:
   ```bash
   node test-db-connection.js
   ```

3. **If connection works**, you should see:
   ```
   ✅ Database connection successful!
   ```

4. **Then create the database**:
   - Use pgAdmin or command line to create `travel_planner` database
   - Run `schema.sql` to create tables

## Quick Check Commands

```powershell
# Check if PostgreSQL service exists
Get-Service | Where-Object {$_.DisplayName -like "*PostgreSQL*"}

# Check if port 5432 is in use
netstat -ano | findstr ":5432"

# Test connection (after starting service)
node test-db-connection.js
```


