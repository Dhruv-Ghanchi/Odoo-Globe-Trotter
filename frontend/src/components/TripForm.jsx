/**
 * Trip Form Component
 * 
 * Form for creating and editing trips.
 */

import { useState, useEffect } from 'react';
import { createTrip, updateTrip } from '../services/tripService.js';
import './TripForm.css';

const TripForm = ({ trip, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    start_date: '',
    end_date: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!trip;

  // Populate form if editing
  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || '',
        destination: trip.destination || '',
        start_date: trip.start_date || '',
        end_date: trip.end_date || '',
      });
    }
  }, [trip]);

  /**
   * Validate form inputs
   */
  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.destination.trim()) {
      errors.destination = 'Destination is required';
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    } else if (formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      errors.end_date = 'End date must be after start date';
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
      let response;
      if (isEditing) {
        response = await updateTrip(trip.id, formData);
      } else {
        response = await createTrip(formData);
      }

      if (response.success) {
        onSave();
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to save trip');
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
      className="trip-form-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-form-title"
    >
      <div 
        className="trip-form-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trip-form-header">
          <h2 id="trip-form-title">{isEditing ? 'Edit Trip' : 'Create New Trip'}</h2>
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
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={validationErrors.title ? 'error' : ''}
              placeholder="e.g., Summer Vacation"
              disabled={isSubmitting}
            />
            {validationErrors.title && (
              <span className="field-error">{validationErrors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className={validationErrors.destination ? 'error' : ''}
              placeholder="e.g., Paris, France"
              disabled={isSubmitting}
            />
            {validationErrors.destination && (
              <span className="field-error">{validationErrors.destination}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={validationErrors.start_date ? 'error' : ''}
                disabled={isSubmitting}
              />
              {validationErrors.start_date && (
                <span className="field-error">{validationErrors.start_date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={validationErrors.end_date ? 'error' : ''}
                disabled={isSubmitting}
              />
              {validationErrors.end_date && (
                <span className="field-error">{validationErrors.end_date}</span>
              )}
            </div>
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Trip' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TripForm;


