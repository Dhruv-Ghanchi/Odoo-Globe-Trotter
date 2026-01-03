# How to Start PostgreSQL Service

## PostgreSQL 17 is Installed But Service Not Running

Your PostgreSQL is installed at: `C:\Program Files\PostgreSQL\17`

## Solution: Register and Start the Service

### Method 1: Using Command Prompt (As Administrator)

1. **Open Command Prompt as Administrator**:
   - Press `Windows Key + X`
   - Click "Windows Terminal (Admin)" or "Command Prompt (Admin)"

2. **Navigate to PostgreSQL bin folder**:
   ```cmd
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```

3. **Register the service**:
   ```cmd
   pg_ctl register -N "postgresql-x64-17" -D "C:\Program Files\PostgreSQL\17\data"
   ```

4. **Start the service**:
   ```cmd
   net start postgresql-x64-17
   ```

### Method 2: Using pg_ctl Directly

1. **Open Command Prompt as Administrator**

2. **Start PostgreSQL directly** (temporary, until service is registered):
   ```cmd
   cd "C:\Program Files\PostgreSQL\17\bin"
   pg_ctl start -D "C:\Program Files\PostgreSQL\17\data"
   ```

### Method 3: Re-run PostgreSQL Installer

1. Find the PostgreSQL installer you used
2. Run it again
3. Choose "Modify" or "Repair"
4. Make sure "Install as Windows Service" is checked
5. Complete the installation

## After Starting

1. **Verify service is running**:
   - Open Services (`services.msc`)
   - Look for `postgresql-x64-17`
   - Status should be "Running"

2. **Test connection**:
   ```cmd
   node test-db-connection.js
   ```

3. **Connect in pgAdmin**:
   - Try connecting again with password: `DamnThisMF`

