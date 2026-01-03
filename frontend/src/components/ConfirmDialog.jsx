/**
 * Confirm Dialog Component
 * 
 * A reusable confirmation modal for delete actions and other confirmations.
 */

import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  onConfirm, 
  onCancel,
  variant = 'danger' // 'danger' or 'warning'
}) => {
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default (safer)
      cancelButtonRef.current?.focus();
      
      // Handle ESC key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="confirm-dialog-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div 
        className="confirm-dialog-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-header">
          <h2 id="confirm-dialog-title" className={`confirm-dialog-title ${variant}`}>
            {variant === 'danger' ? '⚠️' : '⚠️'} {title}
          </h2>
        </div>
        
        <div className="confirm-dialog-body">
          <p id="confirm-dialog-message">{message}</p>
        </div>
        
        <div className="confirm-dialog-footer">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="confirm-dialog-button cancel-button"
            type="button"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={`confirm-dialog-button confirm-button ${variant}`}
            type="button"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

