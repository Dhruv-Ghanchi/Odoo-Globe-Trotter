/**
 * Timeline View Component
 * 
 * Vertical timeline view of trip activities grouped by day.
 * Days are collapsible to show/hide activities.
 */

import { useState, useEffect } from 'react';
import { getItinerary } from '../services/tripService.js';
import './TimelineView.css';

const TimelineView = ({ tripId }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDays, setExpandedDays] = useState(new Set());

  /**
   * Fetch itinerary from API
   */
  useEffect(() => {
    if (!tripId) {
      setItinerary(null);
      setExpandedDays(new Set());
      return;
    }

    const fetchItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getItinerary(tripId);
        if (response.success) {
          setItinerary(response.data);
          // Expand first day by default
          if (response.data.activities && response.data.activities.length > 0) {
            const firstDate = response.data.activities[0].date;
            setExpandedDays(new Set([firstDate]));
          }
        } else {
          setError(response.error?.message || 'Failed to load timeline');
        }
      } catch (err) {
        setError(err.error?.message || 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [tripId]);

  /**
   * Toggle day expansion
   */
  const toggleDay = (date) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

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
      <div className="timeline-view-container">
        <div className="timeline-loading">
          <div>Loading timeline...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="timeline-view-container">
        <div className="timeline-error">
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
      <div className="timeline-view-container">
        <div className="timeline-empty">
          <p>Select a trip to view timeline</p>
        </div>
      </div>
    );
  }

  // Empty itinerary
  if (!itinerary.activities || itinerary.activities.length === 0) {
    return (
      <div className="timeline-view-container">
        <div className="timeline-header">
          <h2>{itinerary.trip.title}</h2>
          <p className="timeline-destination">📍 {itinerary.trip.destination}</p>
        </div>
        <div className="timeline-empty">
          <p>No activities scheduled for this trip yet.</p>
        </div>
      </div>
    );
  }

  // Group activities by date
  const activitiesByDate = groupActivitiesByDate(itinerary.activities);
  const sortedDates = Object.keys(activitiesByDate).sort();

  return (
    <div className="timeline-view-container">
      <div className="timeline-header">
        <h2>{itinerary.trip.title}</h2>
        <p className="timeline-destination">📍 {itinerary.trip.destination}</p>
      </div>

      <div className="timeline-content">
        {sortedDates.map((date, dateIndex) => {
          const isExpanded = expandedDays.has(date);
          const dayActivities = activitiesByDate[date];

          return (
            <div key={date} className="timeline-day">
              <div
                className="timeline-day-header"
                onClick={() => toggleDay(date)}
              >
                <div className="day-info">
                  <div className="day-date">{formatDate(date)}</div>
                  <div className="day-activity-count">
                    {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
                <div className={`day-toggle ${isExpanded ? 'expanded' : ''}`}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {isExpanded && (
                <div className="timeline-activities">
                  {dayActivities.map((activity, activityIndex) => (
                    <div key={activity.id} className="timeline-activity">
                      <div className="activity-time">{formatTime(activity.time)}</div>
                      <div className="activity-content">
                        <div className="activity-city">{itinerary.trip.destination}</div>
                        <div className="activity-title">{activity.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;

