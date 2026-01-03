/**
 * Activity Form Component
 * 
 * Form for creating and editing activities.
 */

import { useState, useEffect } from 'react';
import { createActivity, updateActivity } from '../services/activityService.js';
import './ActivityForm.css';

const ActivityForm = ({ tripId, activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    title: '',
    description: '',
    cost: '0.00',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!activity;

  // Populate form if editing
  useEffect(() => {
    if (activity) {
      setFormData({
        date: activity.date || '',
        time: activity.time.substring(0, 5) || '', // Format HH:MM from HH:MM:SS
        title: activity.title || '',
        description: activity.description || '',
        cost: activity.cost ? parseFloat(activity.cost).toFixed(2) : '0.00',
      });
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({ ...prev, date: today }));
    }
  }, [activity]);

  /**
   * Validate form inputs
   */
  const validate = () => {
    const errors = {};

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.time) {
      errors.time = 'Time is required';
    } else if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)) {
      errors.time = 'Time must be in HH:MM format (24-hour)';
    }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (formData.cost !== '' && (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) < 0)) {
      errors.cost = 'Cost must be a valid positive number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input changes
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
    setError(null);
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
    setError(null);

    try {
      // Format time to HH:MM:SS
      const timeFormatted = formData.time.length === 5 ? `${formData.time}:00` : formData.time;
      
      const activityData = {
        date: formData.date,
        time: timeFormatted,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        cost: parseFloat(formData.cost) || 0,
      };

      let response;
      if (isEditing) {
        response = await updateActivity(activity.id, activityData);
      } else {
        response = await createActivity(tripId, activityData);
      }

      if (response.success) {
        onSave();
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to save activity');
      if (err.error?.details) {
        const details = {};
        err.error.details.forEach((detail) => {
          details[detail.field] = detail.message;
        });
        setValidationErrors((prev) => ({ ...prev, ...details }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ESC key to close form
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onCancel, isSubmitting]);

  return (
    <div 
      className="activity-form-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-form-title"
    >
      <div 
        className="activity-form-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="activity-form-header">
          <h3 id="activity-form-title">{isEditing ? 'Edit Activity' : 'Add Activity'}</h3>
          <button onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={validationErrors.date ? 'error' : ''}
                disabled={isSubmitting}
              />
              {validationErrors.date && (
                <span className="field-error">{validationErrors.date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={validationErrors.time ? 'error' : ''}
                disabled={isSubmitting}
              />
              {validationErrors.time && (
                <span className="field-error">{validationErrors.time}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={validationErrors.title ? 'error' : ''}
              placeholder="e.g., Visit Eiffel Tower"
              disabled={isSubmitting}
            />
            {validationErrors.title && (
              <span className="field-error">{validationErrors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add details about this activity..."
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cost">Cost (Optional)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className={validationErrors.cost ? 'error' : ''}
              placeholder="0.00"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {validationErrors.cost && (
              <span className="field-error">{validationErrors.cost}</span>
            )}
            <small className="field-hint">Enter the estimated cost for this activity</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityForm;


