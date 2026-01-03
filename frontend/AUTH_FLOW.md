# Authentication Flow Documentation

## Architecture Overview

The authentication system uses React Context API for state management, React Router for navigation, and localStorage for token persistence.

### Component Structure

```
App
├── AuthProvider (Context)
│   ├── Login Component
│   ├── Signup Component
│   └── ProtectedRoute
│       └── Dashboard Component
```

## Authentication Flow

### 1. **Initialization Flow**

```javascript
// AuthContext.jsx - useEffect on mount
useEffect(() => {
  const token = getToken(); // Check localStorage
  if (token) {
    setAuthHeader(token); // Set axios header
    getCurrentUser(); // Validate token
    // If valid → set user state
    // If invalid → clear token
  }
}, []);
```

**Steps:**
1. Check for existing token in localStorage
2. If found, set Authorization header
3. Validate token by calling `/auth/me`
4. Set user state if valid, clear token if invalid

### 2. **Signup Flow**

```javascript
// Signup.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return; // Client-side validation
  
  const result = await signup(email, password);
  if (result.success) {
    navigate('/dashboard'); // Redirect on success
  }
};
```

**Steps:**
1. User fills form (email, password, confirm password)
2. Client-side validation (email format, password length, match)
3. Call `signup()` from AuthContext
4. AuthContext calls API → stores token → sets user
5. Redirect to dashboard

### 3. **Login Flow**

```javascript
// Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  
  const result = await login(email, password);
  if (result.success) {
    navigate('/dashboard');
  }
};
```

**Steps:**
1. User fills form (email, password)
2. Client-side validation
3. Call `login()` from AuthContext
4. AuthContext calls API → stores token → sets user
5. Redirect to dashboard

### 4. **Protected Route Flow**

```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};
```

**Steps:**
1. Check authentication status from context
2. Show loading while checking
3. Redirect to login if not authenticated
4. Render protected content if authenticated

### 5. **Logout Flow**

```javascript
// AuthContext.jsx
const logout = () => {
  removeToken(); // Clear localStorage
  setAuthHeader(null); // Clear axios header
  setUser(null); // Clear user state
};
```

**Steps:**
1. Remove token from localStorage
2. Clear Authorization header
3. Clear user state
4. User redirected to login (via ProtectedRoute)

## Key Code Snippets

### 1. **AuthContext - State Management**

```javascript
// context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (email, password) => {
    const response = await loginAPI(email, password);
    if (response.success) {
      const { user, token } = response.data;
      setToken(token); // Store in localStorage
      setAuthHeader(token); // Set axios header
      setUser(user);
      return { success: true };
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. **Token Storage and Management**

```javascript
// services/authService.js
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
```

### 3. **Form Validation**

```javascript
// Login.jsx / Signup.jsx
const validate = () => {
  const errors = {};
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### 4. **Error Handling**

```javascript
// Components display errors in two ways:

// 1. API Errors (from server)
{error && (
  <div className="error-message" role="alert">
    {error}
  </div>
)}

// 2. Validation Errors (per field)
{validationErrors.email && (
  <span className="field-error">{validationErrors.email}</span>
)}
```

### 5. **Protected Route Implementation**

```javascript
// components/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage in App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Data Flow

### Signup/Login Request Flow

```
User Input
  ↓
Form Validation (Client)
  ↓
AuthContext.login/signup()
  ↓
authService.login/signup()
  ↓
API Call (axios)
  ↓
Backend API (/auth/login or /auth/signup)
  ↓
Response (user + token)
  ↓
Store token (localStorage)
  ↓
Set auth header (axios)
  ↓
Update user state (context)
  ↓
Redirect to dashboard
```

### Protected Route Access Flow

```
User navigates to /dashboard
  ↓
ProtectedRoute checks isAuthenticated
  ↓
If false → Redirect to /login
  ↓
If true → Render Dashboard
```

## Security Features

1. **Token Storage**: localStorage (can be changed to httpOnly cookies for production)
2. **Automatic Token Validation**: Token validated on app initialization
3. **Automatic Header Injection**: Token automatically added to all API requests
4. **Route Protection**: Unauthenticated users cannot access protected routes
5. **Error Handling**: Clear error messages without exposing sensitive info

## State Management

### AuthContext State

```javascript
{
  user: { id, email, created_at } | null,
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean,
  login: (email, password) => Promise,
  signup: (email, password) => Promise,
  logout: () => void,
  clearError: () => void
}
```

### Component State

**Login/Signup:**
- `formData`: Form input values
- `validationErrors`: Field-specific errors
- `isSubmitting`: Loading state during API call

## API Integration

All API calls use axios with automatic token injection:

```javascript
// authService.js
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Token automatically added via:
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## Error Messages

### Client-Side Validation
- Email format validation
- Password length validation
- Password match validation (signup)
- Required field validation

### Server-Side Errors
- Invalid credentials
- Email already exists
- Network errors
- Server validation errors (with details)

## User Experience

1. **Loading States**: Shows "Logging in..." / "Creating account..." during API calls
2. **Real-time Validation**: Errors clear as user types
3. **Clear Error Messages**: Specific, actionable error messages
4. **Automatic Redirects**: Redirects authenticated users away from login/signup
5. **Persistent Sessions**: Token persists across page refreshes

## Testing the Flow

1. **Signup:**
   - Navigate to `/signup`
   - Fill form with valid data
   - Submit → Should redirect to dashboard
   - Check localStorage for token

2. **Login:**
   - Navigate to `/login`
   - Use existing credentials
   - Submit → Should redirect to dashboard

3. **Protected Route:**
   - Logout
   - Try to access `/dashboard`
   - Should redirect to `/login`

4. **Token Persistence:**
   - Login
   - Refresh page
   - Should remain logged in

5. **Invalid Token:**
   - Manually edit token in localStorage
   - Refresh page
   - Should clear token and redirect to login


