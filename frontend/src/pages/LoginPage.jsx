// src/pages/LoginPage.jsx
// Login form for existing students.

import React, { useState } from 'react';
import { loginUser } from '../services/api';

/**
 * LoginPage component
 *
 * Props:
 * - onLogin: function called with user data when login is successful
 * - onNavigate: function to go to another page
 */
function LoginPage({ onLogin, onNavigate }) {
  // Form field state
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  /**
   * Handle form submission.
   * Calls the login API and passes user data up to App.js on success.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();       // Prevent page reload
    setError('');             // Clear previous errors
    setLoading(true);         // Show loading state

    try {
      const response = await loginUser(email, password);
      const { success, message, data } = response.data;

      if (success) {
        // Pass the user object to App.js (which stores it in state)
        onLogin(data);
      } else {
        setError(message);
      }
    } catch (err) {
      // Handle network errors or server errors
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Cannot connect to server. Make sure the backend is running.');
      }
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Welcome back 👋</h2>
        <p className="auth-subtitle">Log in to your NoteShare account</p>

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔑 Log In'}
          </button>
        </form>

        {/* Link to register */}
        <p className="auth-footer">
          Don't have an account?{' '}
          <a onClick={() => onNavigate('register')} style={{ cursor: 'pointer' }}>
            Register here
          </a>
        </p>

        {/* Demo credentials hint */}
        <div style={{ marginTop: '16px', padding: '12px', background: 'var(--primary-light)', borderRadius: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <strong>Admin Demo:</strong> admin@notes.com / admin123<br />
          <strong>Note:</strong> Register a new account to try as student!
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
