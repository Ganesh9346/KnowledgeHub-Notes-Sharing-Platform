// src/pages/RegisterPage.jsx
// Registration form for new students.

import React, { useState } from 'react';
import { registerUser } from '../services/api';

/**
 * RegisterPage component
 *
 * Props:
 * - onLogin: function called with user data after successful registration
 * - onNavigate: function to go to another page
 */
function RegisterPage({ onLogin, onNavigate }) {
  // Form field state
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Validate the form before submitting.
   * Returns an error message string, or empty string if valid.
   */
  const validate = () => {
    if (!name.trim())         return 'Please enter your full name.';
    if (!email.trim())        return 'Please enter your email address.';
    if (password.length < 6)  return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return ''; // All valid
  };

  /**
   * Handle form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(name, email, password);
      const { success: ok, message, data } = response.data;

      if (ok) {
        setSuccess('Registration successful! Logging you in...');
        // Auto-login after registration (pass user data up to App.js)
        setTimeout(() => onLogin(data), 1000);
      } else {
        setError(message);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Cannot connect to server. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Create account 🎓</h2>
        <p className="auth-subtitle">Join NoteShare and start sharing notes</p>

        {/* Error / Success messages */}
        {error   && <div className="alert alert-error">❌ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Registering...' : '✅ Create Account'}
          </button>
        </form>

        {/* Link to login */}
        <p className="auth-footer">
          Already have an account?{' '}
          <a onClick={() => onNavigate('login')} style={{ cursor: 'pointer' }}>
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
