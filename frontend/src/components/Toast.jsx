/**
 * Toast Notification Component
 * 
 * A reusable toast notification for success/error messages.
 */

import { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div 
      className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-icon">{icon}</div>
      <div className="toast-message">{message}</div>
      <button 
        className="toast-close" 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;

