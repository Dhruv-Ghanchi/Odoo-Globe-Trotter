# Travel Planner Frontend

React frontend for the Travel Planning Application.

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS** - Styling (no CSS framework)

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Login.jsx        # Login form
│   │   ├── Signup.jsx       # Signup form
│   │   ├── Dashboard.jsx    # Protected dashboard
│   │   ├── ProtectedRoute.jsx  # Route guard
│   │   ├── Auth.css         # Auth form styles
│   │   └── Dashboard.css    # Dashboard styles
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── services/
│   │   └── authService.js   # API service for auth
│   ├── config/
│   │   └── api.js           # API configuration
│   ├── App.jsx              # Main app component
│   ├── App.css              # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Variables (Optional)
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## Authentication Flow

### 1. **Signup Flow**
```
User fills form → Client validation → API call → Store token → Set auth header → Redirect to dashboard
```

### 2. **Login Flow**
```
User fills form → Client validation → API call → Store token → Set auth header → Redirect to dashboard
```

### 3. **Protected Routes**
```
Route access → Check auth context → If not authenticated → Redirect to login
```

### 4. **Token Management**
- Token stored in `localStorage`
- Token automatically added to API requests via axios interceptor
- Token validated on app initialization
- Token cleared on logout

## Key Features

### Authentication Context
- Centralized auth state management
- Provides: `user`, `isAuthenticated`, `loading`, `error`
- Methods: `login()`, `signup()`, `logout()`, `clearError()`

### Protected Routes
- `ProtectedRoute` component wraps routes requiring authentication
- Automatically redirects to login if not authenticated
- Shows loading state during auth check

### Form Validation
- Client-side validation before API calls
- Real-time error display
- API error handling with detailed messages

### Error Handling
- Validation errors displayed per field
- API errors displayed at top of form
- Clear error messages for user feedback

## API Integration

All API calls go through `authService.js`:
- `signup(email, password)` - Register new user
- `login(email, password)` - Authenticate user
- `getCurrentUser()` - Get current user info
- Token automatically included in requests

## Styling

- Clean, minimal design
- Responsive layout
- Gradient backgrounds
- Smooth transitions
- Accessible form elements

## Next Steps

1. Add trip management components
2. Add activity management components
3. Implement trip listing and creation
4. Add activity scheduling interface


