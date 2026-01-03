# Sharing Your Website for Testing

## Quick Options

### Option 1: ngrok (Recommended - Easiest)

1. **Install ngrok:**
   - Download from: https://ngrok.com/download
   - Or use: `npm install -g ngrok` (if you have Node.js)

2. **Start your servers:**
   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Create ngrok tunnel for frontend:**
   ```bash
   ngrok http 3001
   ```

4. **Share the ngrok URL:**
   - You'll get a URL like: `https://abc123.ngrok.io`
   - Share this with your team members
   - They can access your site at this URL

5. **Update frontend API URL (if needed):**
   - If backend is on different port, create another tunnel:
   ```bash
   # Terminal 3 - Backend tunnel
   ngrok http 3000
   ```
   - Update `frontend/src/config/api.js` to use the ngrok backend URL

### Option 2: localtunnel (Free Alternative)

1. **Install localtunnel:**
   ```bash
   npm install -g localtunnel
   ```

2. **Create tunnel for frontend:**
   ```bash
   lt --port 3001
   ```

3. **Share the generated URL with your team**

### Option 3: Cloudflare Tunnel (Free, More Permanent)

1. **Install cloudflared:**
   - Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

2. **Create tunnel:**
   ```bash
   cloudflared tunnel --url http://localhost:3001
   ```

### Option 4: Deploy to Free Hosting

**Frontend (Vercel/Netlify):**
- Push code to GitHub
- Connect to Vercel/Netlify
- Auto-deploys on push

**Backend (Railway/Render):**
- Connect GitHub repo
- Set environment variables
- Auto-deploys

## Important Notes

### Database Access
- If using local PostgreSQL, team members won't be able to access it
- Options:
  1. Use a cloud database (Supabase, Railway, etc.)
  2. Keep database local (only you can test with data)
  3. Use ngrok for database too (not recommended for production)

### Environment Variables
- Make sure `.env` is NOT committed to GitHub
- For deployment, set environment variables in hosting platform

### Security
- ngrok URLs are temporary and public
- Anyone with the URL can access your site
- Don't use for production
- Consider password protection if needed

## Quick Setup Script

I can create a script to help you set this up. Would you like me to:
1. Create an ngrok setup script?
2. Help you deploy to a free hosting service?
3. Set up a cloud database?

