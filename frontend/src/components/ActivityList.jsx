/**
 * Activity List Component
 * 
 * Displays activities for a selected trip with options to add, edit, and delete.
 */

import { useState, useEffect } from 'react';
import { getActivities, deleteActivity } from '../services/activityService.js';
import ActivityItem from './ActivityItem.jsx';
import ActivityForm from './ActivityForm.jsx';
import './ActivityList.css';

const ActivityList = ({ tripId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  /**
   * Fetch activities from API
   */
  const fetchActivities = async () => {
    if (!tripId) {
      setActivities([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getActivities(tripId);
      if (response.success) {
        setActivities(response.data.activities || []);
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [tripId]);

  /**
   * Handle activity deletion
   */
  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      const response = await deleteActivity(activityId);
      if (response.success) {
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
      }
    } catch (err) {
      alert(err.error?.message || 'Failed to delete activity');
    }
  };

  /**
   * Handle activity edit
   */
  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  /**
   * Handle form close
   */
  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  /**
   * Handle activity created/updated
   */
  const handleActivitySaved = () => {
    fetchActivities(); // Refresh list
    handleFormClose();
  };

  if (!tripId) {
    return (
      <div className="activity-list-empty">
        <div className="empty-state-icon">📋</div>
        <p className="empty-state-title">No Trip Selected</p>
        <p className="empty-state-message">
          Click on a trip card in the left panel to view and manage its activities
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="activity-list-loading">
        <div>Loading activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-list-error">
        <div className="error-message">{error}</div>
        <button onClick={fetchActivities} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // Group activities by date
  const activitiesByDate = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(activitiesByDate).sort();

  return (
    <div className="activity-list-container">
      <div className="activity-list-header">
        <h2>Activities</h2>
        <button onClick={() => setShowForm(true)} className="add-button">
          + Add Activity
        </button>
      </div>

      {showForm && (
        <ActivityForm
          tripId={tripId}
          activity={editingActivity}
          onSave={handleActivitySaved}
          onCancel={handleFormClose}
        />
      )}

      {activities.length === 0 ? (
        <div className="empty-state">
          <p>No activities yet. Add your first activity to start planning!</p>
        </div>
      ) : (
        <div className="activities-by-date">
          {sortedDates.map((date) => (
            <div key={date} className="activity-date-group">
              <h3 className="date-header">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </h3>
              <div className="activity-items">
                {activitiesByDate[date].map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    onEdit={() => handleEdit(activity)}
                    onDelete={() => handleDelete(activity.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityList;


