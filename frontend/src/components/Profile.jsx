/**
 * Profile Component
 * 
 * Simple profile page for viewing and editing user information.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile, deleteAccount } from '../services/authService.js';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  /**
   * Fetch profile data
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfile();
        if (response.success) {
          setFormData({
            email: response.data.user.email || '',
          });
        }
      } catch (err) {
        setError(err.error?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /**
   * Handle form input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile({ email: formData.email });
      if (response.success) {
        setSuccess('Profile updated successfully');
        // Update user in context
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      const response = await deleteAccount();
      if (response.success) {
        // Logout and redirect to login
        logout();
        navigate('/login', { replace: true });
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p className="profile-subtitle">Manage your account information</p>
      </div>

      <div className="profile-content">
        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={saving}
              className="form-input"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Account Information */}
        <div className="profile-info">
          <h2>Account Information</h2>
          <div className="info-item">
            <span className="info-label">Account Created:</span>
            <span className="info-value">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'N/A'}
            </span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <p className="danger-warning">
            Deleting your account will permanently remove all your data, including trips and activities.
            This action cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger"
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p className="confirm-message">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="btn btn-danger"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

