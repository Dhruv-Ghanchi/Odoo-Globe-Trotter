/**
 * Budget View Component
 * 
 * Displays trip budget breakdown with total cost, daily breakdown,
 * and highlights days exceeding average spend.
 */

import { useState, useEffect } from 'react';
import { getBudget } from '../services/tripService.js';
import './BudgetView.css';

const BudgetView = ({ tripId }) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch budget from API
   */
  useEffect(() => {
    if (!tripId) {
      setBudget(null);
      return;
    }

    const fetchBudget = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getBudget(tripId);
        if (response.success) {
          setBudget(response.data);
        } else {
          setError(response.error?.message || 'Failed to load budget');
        }
      } catch (err) {
        setError(err.error?.message || 'Failed to load budget');
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [tripId]);

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="budget-view-container">
        <div className="budget-loading">
          <div>Loading budget...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="budget-view-container">
        <div className="budget-error">
          <div className="error-message">{error}</div>
          <button onClick={() => window.location.reload()} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No trip selected
  if (!tripId || !budget) {
    return (
      <div className="budget-view-container">
        <div className="budget-empty">
          <p>Select a trip to view budget</p>
        </div>
      </div>
    );
  }

  const { trip, summary, daily_breakdown } = budget;
  const averageCost = summary.average_cost_per_day;

  return (
    <div className="budget-view-container">
      <div className="budget-header">
        <h2>{trip.title}</h2>
        <p className="budget-destination">📍 {trip.destination}</p>
      </div>

      {/* Total Cost Summary */}
      <div className="budget-summary">
        <div className="summary-card total-cost">
          <div className="summary-label">Total Cost</div>
          <div className="summary-value">{formatCurrency(summary.total_cost)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Average per Day</div>
          <div className="summary-value">{formatCurrency(summary.average_cost_per_day)}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Activities</div>
          <div className="summary-value">{summary.activity_count}</div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      {daily_breakdown && daily_breakdown.length > 0 ? (
        <div className="budget-breakdown">
          <h3>Daily Cost Breakdown</h3>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activities</th>
                <th>Daily Cost</th>
                <th>vs Average</th>
              </tr>
            </thead>
            <tbody>
              {daily_breakdown.map((day) => {
                const exceedsAverage = day.cost > averageCost;
                const difference = day.cost - averageCost;
                return (
                  <tr
                    key={day.date}
                    className={exceedsAverage ? 'exceeds-average' : ''}
                  >
                    <td>{formatDate(day.date)}</td>
                    <td>{day.activity_count}</td>
                    <td className="cost-cell">{formatCurrency(day.cost)}</td>
                    <td className={exceedsAverage ? 'exceeds-indicator' : 'within-average'}>
                      {exceedsAverage ? (
                        <span className="exceeds-badge">
                          +{formatCurrency(Math.abs(difference))}
                        </span>
                      ) : (
                        <span className="within-badge">Within average</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="budget-empty">
          <p>No cost data available for this trip.</p>
        </div>
      )}
    </div>
  );
};

export default BudgetView;

