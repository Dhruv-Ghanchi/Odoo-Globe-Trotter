/**
 * Profile Component
 *
 * Page for viewing and editing user profile information including
 * name, avatar, and preferences.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile, deleteAccount, uploadImage, changePassword } from '../services/authService.js';
import API_BASE_URL from '../config/api.js';
import './Profile.css';

// Extract server URL from API base URL (remove /api suffix)
const SERVER_URL = API_BASE_URL.replace('/api', '');

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Ref for file input
  const fileInputRef = useRef(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    avatar_url: '',
    preferences: {
      currency: 'USD',
      language: 'en',
    },
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
          const userData = response.data.user;
          setFormData({
            email: userData.email || '',
            full_name: userData.full_name || '',
            avatar_url: userData.avatar_url || '',
            preferences: {
              currency: userData.preferences?.currency || 'USD',
              language: userData.preferences?.language || 'en',
            },
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

    if (name.startsWith('pref_')) {
      const prefKey = name.replace('pref_', '');
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setError(null);
    setError(null);
    setSuccess(null);
  };

  /**
   * Handle image upload
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const response = await uploadImage(file);

      if (response.success) {
        setFormData(prev => ({
          ...prev,
          avatar_url: response.data.url
        }));
        setSuccess('Image uploaded successfully! Don\'t forget to save changes.');
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.success) {
        setSuccess('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      setError(err.error?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Get display URL for avatar
   */
  const getAvatarUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${SERVER_URL}${url}`;
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
      const response = await updateProfile({
        email: formData.email,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        preferences: formData.preferences,
      });

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
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        <div className="profile-grid">
          {/* Avatar Preview Section */}
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              <div className="avatar-preview">
                {formData.avatar_url ? (
                  <img
                    src={getAvatarUrl(formData.avatar_url)}
                    alt="Profile"
                    className="avatar-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://ui-avatars.com/api/?name=' + (formData.full_name || 'User');
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>

              {/* Camera Overlay */}
              <div
                className="avatar-overlay"
                onClick={() => fileInputRef.current?.click()}
                title="Upload new photo"
              >
                {uploading ? (
                  <span className="spinner">⌛</span>
                ) : (
                  <span className="camera-icon">📷</span>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <div className="user-meta">
              <h3>{formData.full_name || 'GlobeTrotter User'}</h3>
              <p>{formData.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>

              <div className="form-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="form-input"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={saving}
                />
              </div>


            </div>


            <div className="form-section">
              <h3>Change Password</h3>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  disabled={saving}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    disabled={saving}
                  />
                </div>

                <div className="form-group half">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="form-input"
                    disabled={saving}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="btn btn-secondary"
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                >
                  Update Password
                </button>
              </div>
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
        </div>

        {/* Account Information */}
        <div className="profile-footer-info">
          <p>
            Account Created: {' '}
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : 'N/A'}
          </p>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <p className="danger-warning">
            Deleting your account will permanently remove all your data.
          </p>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-danger-outline"
            >
              Delete Account
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Are you sure? This action cannot be undone.</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="btn btn-danger"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
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

