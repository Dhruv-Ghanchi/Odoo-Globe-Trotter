/**
 * Trip List Component
 * 
 * Displays all user trips with options to view, edit, and delete.
 */

import { useState, useEffect } from 'react';
import { getTrips, deleteTrip } from '../services/tripService.js';
import TripCard from './TripCard.jsx';
import TripForm from './TripForm.jsx';
import './TripList.css';

const TripList = ({ onTripSelect, selectedTripId }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

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
   * Handle trip deletion
   */
  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? All activities will also be deleted.')) {
      return;
    }

    try {
      const response = await deleteTrip(tripId);
      if (response.success) {
        // Remove trip from list
        setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
        // Clear selection if deleted trip was selected
        if (selectedTripId === tripId) {
          onTripSelect(null);
        }
      }
    } catch (err) {
      alert(err.error?.message || 'Failed to delete trip');
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
  };

  if (loading) {
    return (
      <div className="trip-list-loading">
        <div>Loading trips...</div>
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

      {trips.length === 0 ? (
        <div className="empty-state">
          <p>No trips yet. Create your first trip to get started!</p>
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
                onDelete={() => handleDelete(trip.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TripList;


