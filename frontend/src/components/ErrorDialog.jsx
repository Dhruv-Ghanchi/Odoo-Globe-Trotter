/**
 * Error Dialog Component
 * 
 * Displays error messages in a modal dialog box.
 */

import { Link } from 'react-router-dom';
import './ErrorDialog.css';

const ErrorDialog = ({ error, onClose, show }) => {
  if (!show || !error) {
    return null;
  }

  // Determine if we should show action links
  const errorLower = error.toLowerCase();
  const showLoginLink = errorLower.includes('already exists') || errorLower.includes('please login');
  const showSignupLink = errorLower.includes("doesn't exist") || errorLower.includes('sign up');

  return (
    <div className="error-dialog-overlay" onClick={onClose}>
      <div className="error-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="error-dialog-header">
          <h2>⚠️ Error</h2>
          <button className="error-dialog-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="error-dialog-body">
          <p>{error}</p>
          {(showLoginLink || showSignupLink) && (
            <div className="error-dialog-action">
              {showLoginLink && (
                <Link to="/login" onClick={onClose} className="error-dialog-link">
                  Go to Login →
                </Link>
              )}
              {showSignupLink && (
                <Link to="/signup" onClick={onClose} className="error-dialog-link">
                  Go to Sign Up →
                </Link>
              )}
            </div>
          )}
        </div>
        <div className="error-dialog-footer">
          <button className="error-dialog-button" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;

