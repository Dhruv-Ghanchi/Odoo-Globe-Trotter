/**
 * Login Component
 * 
 * Handles user login with email and password.
 * Displays validation errors and handles authentication.
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { validateEmail } from '../utils/emailValidator.js';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError();
  }, [clearError]);

  /**
   * Validate form inputs
   */
  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {/* Display API error */}
        {error && (
          <div className="error-message" role="alert">
            {error}
            {(error.includes("doesn't exist") || error.includes("User doesn't exist")) && (
              <div className="error-action">
                <Link to="/signup">Go to Sign Up</Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'error' : ''}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={validationErrors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


