# PostgreSQL Installation Check

## Issue: No PostgreSQL Service Found

If you can't see PostgreSQL in Services, it might not be installed properly or the service isn't registered.

## Solutions

### Option 1: Reinstall PostgreSQL (Recommended)

1. **Download PostgreSQL**:
   - Go to: https://www.postgresql.org/download/windows/
   - Download the latest version (17.x recommended)
   - Choose the Windows x86-64 installer

2. **Install PostgreSQL**:
   - Run the installer
   - **Important**: During installation, make sure to:
     - Check "Install pgAdmin 4" (if not already installed)
     - Check "Stack Builder" (optional)
     - **Set password**: `DamnThisMF` (or remember what you set)
     - **Port**: Keep default `5432`
     - **Locale**: Default is fine
     - **Install as Windows Service**: ✅ **CHECK THIS BOX**
     - Service name: `postgresql-x64-17` (or similar)
     - **Start service at end of setup**: ✅ **CHECK THIS BOX**

3. **After Installation**:
   - The service should automatically start
   - Check Services again - you should see it now

### Option 2: Check if PostgreSQL is Installed but Service Not Created

If PostgreSQL files exist but no service:

1. **Find PostgreSQL installation**:
   - Usually at: `C:\Program Files\PostgreSQL\17\` (or your version)

2. **Create service manually**:
   - Open Command Prompt as Administrator
   - Navigate to PostgreSQL bin folder:
     ```cmd
     cd "C:\Program Files\PostgreSQL\17\bin"
     ```
   - Create service:
     ```cmd
     pg_ctl register -N "postgresql-x64-17" -D "C:\Program Files\PostgreSQL\17\data"
     ```
   - Start service:
     ```cmd
     net start postgresql-x64-17
     ```

### Option 3: Use PostgreSQL Portable/Alternative

If installation is problematic, you could use:
- **PostgreSQL Portable** (if available)
- **Docker** with PostgreSQL container
- **Cloud PostgreSQL** (for development)

## Quick Check Commands

Run these to check if PostgreSQL is installed:

```powershell
# Check installation directory
Test-Path "C:\Program Files\PostgreSQL"

# Check if psql command works
psql --version

# Check registry for PostgreSQL
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*PostgreSQL*"}
```

## After Reinstalling

Once PostgreSQL service is running:
1. Test connection: `node test-db-connection.js`
2. Create database in pgAdmin
3. Run schema.sql
4. Your app should work!

