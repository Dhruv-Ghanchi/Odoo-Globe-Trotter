/**
 * Activity Item Component
 * 
 * Displays a single activity with time, title, and description.
 */

import './ActivityItem.css';

const ActivityItem = ({ activity, onEdit, onDelete }) => {
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="activity-item">
      <div className="activity-time">{formatTime(activity.time)}</div>
      <div className="activity-content">
        <div className="activity-header">
          <h4>{activity.title}</h4>
          <div className="activity-actions">
            <button
              onClick={() => onEdit()}
              className="icon-button edit-button"
              title="Edit activity"
              aria-label="Edit activity"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete()}
              className="icon-button delete-button"
              title="Delete activity"
              aria-label="Delete activity"
            >
              🗑️
            </button>
          </div>
        </div>
        {activity.description && (
          <p className="activity-description">{activity.description}</p>
        )}
        {activity.cost && parseFloat(activity.cost) > 0 && (
          <div className="activity-cost">
            <span className="cost-label">Cost:</span>
            <span className="cost-value">${parseFloat(activity.cost).toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;


