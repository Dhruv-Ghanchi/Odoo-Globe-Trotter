/**
 * Trip Card Component
 * 
 * Displays a single trip card with trip information and actions.
 */

import './TripCard.css';

const TripCard = ({ trip, isSelected, onSelect, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Handle card click - toggle selection
  const handleCardClick = (e) => {
    // Don't trigger if clicking on action buttons
    if (e.target.closest('.trip-card-actions')) {
      return;
    }
    
    // Toggle selection
    if (isSelected) {
      onSelect(null); // Deselect
    } else {
      onSelect(trip.id); // Select
    }
  };

  return (
    <div 
      className={`trip-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
      title={isSelected ? 'Click to deselect' : 'Click to view activities'}
    >
      <div className="trip-card-header">
        <h3>{trip.title}</h3>
        <div className="trip-card-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="icon-button edit-button"
            title="Edit trip"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="icon-button delete-button"
            title="Delete trip"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="trip-card-body">
        <div className="trip-destination">
          <span className="destination-icon">📍</span>
          {trip.destination}
        </div>
        <div className="trip-dates">
          <span>{formatDate(trip.start_date)}</span>
          <span className="date-separator">→</span>
          <span>{formatDate(trip.end_date)}</span>
        </div>
      </div>
      
      {isSelected && (
        <div className="trip-card-selected-indicator">
          ✓ Selected - Viewing activities
        </div>
      )}
    </div>
  );
};

export default TripCard;


