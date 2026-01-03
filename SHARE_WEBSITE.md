# How to Share Your Website for Testing

## Quick Method: Using ngrok (Recommended)

### Step 1: Install ngrok
1. Go to: https://ngrok.com/download
2. Download and install ngrok
3. Or use: `npm install -g ngrok` (if you have npm)

### Step 2: Start Your Servers
Make sure both servers are running:

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 3: Create Tunnels

**Terminal 3 - Backend Tunnel:**
```bash
ngrok http 3000
```
- Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
- This is your backend URL

**Terminal 4 - Frontend Tunnel:**
```bash
ngrok http 3001
```
- Copy the HTTPS URL (e.g., `https://xyz789.ngrok.io`)
- This is your frontend URL

### Step 4: Update Frontend to Use ngrok Backend

1. Create/update `frontend/.env`:
```
VITE_API_URL=https://abc123.ngrok.io/api
```
(Replace `abc123.ngrok.io` with your actual ngrok backend URL)

2. Restart frontend server:
```bash
cd frontend
npm run dev
```

### Step 5: Share with Team
- Share the **frontend ngrok URL** (e.g., `https://xyz789.ngrok.io`)
- Your team can access the site at this URL

## Alternative: localtunnel (Free, No Signup)

### Install:
```bash
npm install -g localtunnel
```

### Create Tunnels:
```bash
# Terminal 1 - Backend
lt --port 3000

# Terminal 2 - Frontend  
lt --port 3001
```

Update `frontend/.env` with the backend tunnel URL.

## Important Notes

⚠️ **Database Access:**
- Your PostgreSQL database is local, so only you can test with real data
- Team members can test the UI but won't have database access
- For full testing, consider:
  1. Using a cloud database (Supabase, Railway, etc.)
  2. Or they can create their own local setup

⚠️ **Security:**
- These URLs are public - anyone with the link can access
- Don't use for production
- URLs change each time you restart ngrok (unless you have a paid plan)

⚠️ **Keep Servers Running:**
- Both backend and frontend must stay running
- If you close the terminals, the site goes offline

## Quick Test

After setup, test by:
1. Opening the frontend ngrok URL in a browser
2. Try signing up/login
3. Test the features

If you see errors, check:
- Backend ngrok URL is correct in `frontend/.env`
- Both servers are running
- CORS is configured correctly (should work with `*`)

