/**
 * Trip List Component
 * 
 * Displays all user trips with options to view, edit, and delete.
 */

import { useState, useEffect } from 'react';
import { getTrips, deleteTrip } from '../services/tripService.js';
import TripCard from './TripCard.jsx';
import TripForm from './TripForm.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Loader from './Loader.jsx';
import './TripList.css';

const TripList = ({ onTripSelect, selectedTripId, showToast }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, tripId: null });

  /**
   * Fetch trips from API
   */
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTrips();
      if (response.success) {
        setTrips(response.data.trips || []);
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  /**
   * Handle trip deletion request
   */
  const handleDeleteClick = (tripId) => {
    setDeleteConfirm({ isOpen: true, tripId });
  };

  /**
   * Confirm and execute trip deletion
   */
  const handleDeleteConfirm = async () => {
    const { tripId } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, tripId: null });

    try {
      const response = await deleteTrip(tripId);
      if (response.success) {
        // Remove trip from list
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        // Clear selection if deleted trip was selected
        if (selectedTripId === tripId) {
          onTripSelect(null);
        }
        showToast?.('Trip deleted successfully', 'success');
      }
    } catch (err) {
      showToast?.(err.error?.message || 'Failed to delete trip', 'error');
    }
  };

  /**
   * Handle trip edit
   */
  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  /**
   * Handle form close
   */
  const handleFormClose = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  /**
   * Handle trip created/updated
   */
  const handleTripSaved = () => {
    fetchTrips(); // Refresh list
    handleFormClose();
    const message = editingTrip ? 'Trip updated successfully' : 'Trip created successfully';
    showToast?.(message, 'success');
  };

  if (loading) {
    return (
      <div className="trip-list-loading">
        <Loader />
        <div style={{ marginTop: '16px', color: '#666' }}>Loading trips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trip-list-error">
        <div className="error-message">{error}</div>
        <button onClick={fetchTrips} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="trip-list-container">
      <div className="trip-list-header">
        <h2>My Trips</h2>
        <button onClick={() => setShowForm(true)} className="add-button">
          + New Trip
        </button>
      </div>

      {showForm && (
        <TripForm
          trip={editingTrip}
          onSave={handleTripSaved}
          onCancel={handleFormClose}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? All activities will also be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, tripId: null })}
      />

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✈️</div>
          <p><strong>No trips yet.</strong></p>
          <p>Create your first trip to start planning your adventures!</p>
        </div>
      ) : (
        <>
          {!selectedTripId && trips.length > 0 && (
            <div className="trip-list-hint">
              💡 <strong>Tip:</strong> Click on any trip card below to view and manage its activities
            </div>
          )}
          <div className="trip-grid">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onSelect={(tripId) => onTripSelect(tripId)}
                onEdit={() => handleEdit(trip)}
                onDelete={() => handleDeleteClick(trip.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TripList;


