/**
 * Itinerary View Component
 * 
 * Read-only view of trip itinerary grouped by day.
 * Displays activities ordered by date and time.
 */

import { useState, useEffect } from 'react';
import { getItinerary } from '../services/tripService.js';
import './ItineraryView.css';

const ItineraryView = ({ tripId }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch itinerary from API
   */
  useEffect(() => {
    if (!tripId) {
      setItinerary(null);
      return;
    }

    const fetchItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getItinerary(tripId);
        if (response.success) {
          setItinerary(response.data);
        } else {
          setError(response.error?.message || 'Failed to load itinerary');
        }
      } catch (err) {
        setError(err.error?.message || 'Failed to load itinerary');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [tripId]);

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Format time for display
   */
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  /**
   * Group activities by date
   */
  const groupActivitiesByDate = (activities) => {
    const grouped = {};
    activities.forEach((activity) => {
      const date = activity.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  // Loading state
  if (loading) {
    return (
      <div className="itinerary-view-container">
        <div className="itinerary-loading">
          <div>Loading itinerary...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="itinerary-view-container">
        <div className="itinerary-error">
          <div className="error-message">{error}</div>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No trip selected
  if (!tripId || !itinerary) {
    return (
      <div className="itinerary-view-container">
        <div className="itinerary-empty">
          <p>Select a trip to view itinerary</p>
        </div>
      </div>
    );
  }

  // Empty itinerary
  if (!itinerary.activities || itinerary.activities.length === 0) {
    return (
      <div className="itinerary-view-container">
        <div className="itinerary-header">
          <h2>{itinerary.trip.title}</h2>
          <p className="itinerary-destination">📍 {itinerary.trip.destination}</p>
        </div>
        <div className="itinerary-empty">
          <p>No activities scheduled for this trip yet.</p>
        </div>
      </div>
    );
  }

  // Group activities by date
  const activitiesByDate = groupActivitiesByDate(itinerary.activities);
  const sortedDates = Object.keys(activitiesByDate).sort();

  return (
    <div className="itinerary-view-container">
      <div className="itinerary-header">
        <h2>{itinerary.trip.title}</h2>
        <p className="itinerary-destination">📍 {itinerary.trip.destination}</p>
      </div>

      <div className="itinerary-content">
        {sortedDates.map((date) => (
          <div key={date} className="itinerary-day">
            <div className="day-header">
              <h3>{formatDate(date)}</h3>
            </div>
            <div className="day-activities">
              {activitiesByDate[date].map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-time">{formatTime(activity.time)}</div>
                  <div className="activity-details">
                    <div className="activity-title">{activity.title}</div>
                    {activity.description && (
                      <div className="activity-description">{activity.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryView;

