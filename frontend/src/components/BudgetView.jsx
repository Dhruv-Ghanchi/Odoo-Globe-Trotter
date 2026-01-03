/**
 * Budget View Component
 * 
 * Displays trip budget breakdown with total cost, daily breakdown,
 * and highlights days exceeding average spend.
 */

import { useState, useEffect } from 'react';
import { getBudget } from '../services/tripService.js';
import Loader from './Loader.jsx';
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
          <Loader />
          <div style={{ marginTop: '16px', color: '#666' }}>Loading budget...</div>
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

  // Handle backend response format
  const total_cost = budget.summary?.total_cost || budget.total_cost || 0;
  const daily_costs = budget.daily_breakdown || budget.daily_costs || [];
  const average_cost_per_day = budget.summary?.average_cost_per_day || budget.average_cost_per_day || 0;

  return (
    <div className="budget-view-container">
      <div className="budget-header">
        <h2>Trip Budget</h2>
      </div>

      {/* Total Cost - Prominently Displayed */}
      <div className="budget-total-card">
        <div className="total-cost-label">Total Budget</div>
        <div className="total-cost-amount">{formatCurrency(total_cost)}</div>
        <div className="total-cost-subtitle">
          Average: {formatCurrency(average_cost_per_day)} per day
        </div>
      </div>

      {/* Daily Breakdown Table */}
      {daily_costs && daily_costs.length > 0 ? (
        <div className="budget-breakdown">
          <h3>Daily Cost Breakdown</h3>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Daily Cost</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {daily_costs.map((day) => {
                const dailyCost = day.daily_cost || day.cost || 0;
                const exceedsAverage = average_cost_per_day > 0 && dailyCost > average_cost_per_day;
                const difference = dailyCost - average_cost_per_day;
                return (
                  <tr
                    key={day.date}
                    className={exceedsAverage ? 'exceeds-average' : ''}
                  >
                    <td>{formatDate(day.date)}</td>
                    <td className="cost-cell">{formatCurrency(dailyCost)}</td>
                    <td className={exceedsAverage ? 'exceeds-indicator' : 'within-average'}>
                      {exceedsAverage ? (
                        <span className="exceeds-badge">
                          +{formatCurrency(Math.abs(difference))} above average
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
          <p>No cost data available. Add activities with costs to see your budget breakdown.</p>
        </div>
      )}
    </div>
  );
};

export default BudgetView;

