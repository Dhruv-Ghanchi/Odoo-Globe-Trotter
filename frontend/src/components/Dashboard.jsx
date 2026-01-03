/**
 * Dashboard Component
 * 
 * Main dashboard with trip and activity management.
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import TripList from './TripList.jsx';
import ActivityList from './ActivityList.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedTripId, setSelectedTripId] = useState(null);
  const dashboardContentRef = useRef(null);

  /**
   * Handle click outside trip cards to deselect
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't deselect if clicking on:
      // - Header (logout button, etc.)
      // - Modal overlays
      // - Form elements
      // - Buttons inside trip cards (edit/delete)
      
      const target = event.target;
      
      // Check if click is on header
      if (target.closest('.dashboard-header')) {
        return;
      }
      
      // Check if click is on a modal
      if (target.closest('.modal-overlay') || target.closest('.modal')) {
        return;
      }
      
      // Check if click is on a form
      if (target.closest('form') || target.closest('.trip-form') || target.closest('.activity-form')) {
        return;
      }
      
      // Check if click is on a trip card or its buttons
      if (target.closest('.trip-card')) {
        return;
      }
      
      // Check if click is on activity list header buttons
      if (target.closest('.activity-list-header')) {
        return;
      }
      
      // If we get here, click is outside - deselect
      if (selectedTripId) {
        setSelectedTripId(null);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedTripId]);

  return (
    <div className="dashboard-container page-container">
      <main className="dashboard-content" ref={dashboardContentRef}>
        <div className="dashboard-layout">
          <div className="dashboard-left">
            <TripList
              onTripSelect={setSelectedTripId}
              selectedTripId={selectedTripId}
            />
          </div>
          <div className="dashboard-right">
            <ActivityList tripId={selectedTripId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

