/**
 * Public Itinerary View Component
 * 
 * Read-only public view of trip itinerary.
 * No authentication required.
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicItinerary } from '../services/publicService.js';
import './PublicItineraryView.css';

const PublicItineraryView = () => {
  const { tripId } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch public itinerary from API
   */
  useEffect(() => {
    if (!tripId) {
      setError('Invalid trip ID');
      setLoading(false);
      return;
    }

    const fetchItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPublicItinerary(tripId);
        if (response.success) {
          setItinerary(response.data);
        } else {
          setError(response.error?.message || 'Failed to load itinerary');
        }
      } catch (err) {
        setError(err.error?.message || 'Trip not found or itinerary unavailable');
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
    return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
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
      <div className="public-itinerary-container">
        <div className="public-itinerary-loading">
          <div>Loading itinerary...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="public-itinerary-container">
        <div className="public-itinerary-error">
          <div className="error-icon">⚠️</div>
          <h2>Trip Not Found</h2>
          <p className="error-message">{error}</p>
          <p className="error-help">
            The trip you're looking for doesn't exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  // Empty itinerary
  if (!itinerary || !itinerary.activities || itinerary.activities.length === 0) {
    return (
      <div className="public-itinerary-container">
        <div className="public-itinerary-header">
          <div className="read-only-badge">READ-ONLY</div>
          <h1>{itinerary?.trip?.title || 'Trip Itinerary'}</h1>
          {itinerary?.trip?.destination && (
            <p className="itinerary-destination">📍 {itinerary.trip.destination}</p>
          )}
        </div>
        <div className="public-itinerary-empty">
          <p>No activities scheduled for this trip.</p>
        </div>
      </div>
    );
  }

  // Group activities by date
  const activitiesByDate = groupActivitiesByDate(itinerary.activities);
  const sortedDates = Object.keys(activitiesByDate).sort();

  return (
    <div className="public-itinerary-container">
      <div className="public-itinerary-header">
        <div className="read-only-badge">READ-ONLY</div>
        <h1>{itinerary.trip.title}</h1>
        <p className="itinerary-destination">📍 {itinerary.trip.destination}</p>
        <p className="itinerary-dates">
          {formatDate(itinerary.trip.start_date)} → {formatDate(itinerary.trip.end_date)}
        </p>
      </div>

      <div className="public-itinerary-content">
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

export default PublicItineraryView;

