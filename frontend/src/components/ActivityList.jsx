/**
 * Activity List Component
 * 
 * Displays activities for a selected trip with options to add, edit, and delete.
 */

import { useState, useEffect } from 'react';
import { getActivities, deleteActivity } from '../services/activityService.js';
import ActivityItem from './ActivityItem.jsx';
import ActivityForm from './ActivityForm.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import Loader from './Loader.jsx';
import './ActivityList.css';

const ActivityList = ({ tripId, showToast }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, activityId: null });

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
   * Handle activity deletion request
   */
  const handleDeleteClick = (activityId) => {
    setDeleteConfirm({ isOpen: true, activityId });
  };

  /**
   * Confirm and execute activity deletion
   */
  const handleDeleteConfirm = async () => {
    const { activityId } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, activityId: null });

    try {
      const response = await deleteActivity(activityId);
      if (response.success) {
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
        showToast?.('Activity deleted successfully', 'success');
      }
    } catch (err) {
      showToast?.(err.error?.message || 'Failed to delete activity', 'error');
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
    const message = editingActivity ? 'Activity updated successfully' : 'Activity added successfully';
    showToast?.(message, 'success');
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
        <Loader />
        <div style={{ marginTop: '16px', color: '#666' }}>Loading activities...</div>
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Activity"
        message="Are you sure you want to delete this activity? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, activityId: null })}
      />

      {activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p><strong>No activities yet.</strong></p>
          <p>Add your first activity to start planning your trip itinerary!</p>
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
                    onDelete={() => handleDeleteClick(activity.id)}
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


