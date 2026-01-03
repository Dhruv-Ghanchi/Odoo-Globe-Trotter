# Troubleshooting Signup Issue

## Current Problem
- Signup button shows brief popup
- Not redirecting to dashboard
- Backend returning 500 error

## Steps to Debug

### 1. Check Browser Console
1. Open http://localhost:3001
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try signing up again
5. Look for any red error messages
6. Share what errors you see

### 2. Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Try signing up again
3. Look for the request to `/api/auth/signup`
4. Click on it
5. Check:
   - **Status Code** (should be 201 for success, or error code)
   - **Response** tab - see what the server returned
   - **Headers** tab - check if request was sent properly

### 3. Check Backend Logs
The backend server terminal should show error messages. Look for:
- Database connection errors
- Query errors
- Any stack traces

### 4. Possible Issues

**Issue 1: User Already Exists**
- If you tried signing up before, the email might already exist
- Try with a different email: `test2@example.com`

**Issue 2: Database Connection**
- Database might have disconnected
- Restart backend server

**Issue 3: Error Not Displayed**
- Error might be happening but not shown
- Check browser console for details

## Quick Fixes to Try

1. **Try Different Email**:
   - Use: `test2@example.com` or `newuser@example.com`

2. **Clear Browser Data**:
   - Press Ctrl+Shift+Delete
   - Clear cookies and cache
   - Try again

3. **Restart Backend**:
   - Stop backend (Ctrl+C in terminal)
   - Run: `npm run dev` again

4. **Check Database**:
   - Open pgAdmin
   - Check if `users` table has any data
   - If user exists, try logging in instead

## What to Share

Please share:
1. **Browser Console errors** (F12 → Console)
2. **Network request details** (F12 → Network → click on signup request)
3. **Backend terminal output** (any error messages)
4. **What the popup said** (exact message if possible)

