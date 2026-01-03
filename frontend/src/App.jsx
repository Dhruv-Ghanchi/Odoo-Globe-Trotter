/**
 * Main App Component
 * 
 * Sets up routing and authentication context.
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';
import PublicItineraryView from './components/PublicItineraryView.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import './App.css';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/public/trips/:tripId/itinerary" element={<PublicItineraryView />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppWithRouter />
    </AuthProvider>
  );
}

function AppRoot() {
  const { loading } = useAuth();
  const location = useLocation();
  const isPublicRoute = location.pathname.startsWith('/public/');

  return (
    <>
      {!isPublicRoute && <Header />}
      <div className="container page-container">
        {loading ? <Loader /> : <AppRoutes />}
      </div>
    </>
  );
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <AppRoot />
    </BrowserRouter>
  );
}

export default App;


