// src/components/Navbar.jsx
// Navigation bar shown at the top of every page.

import React from 'react';

/**
 * Navbar component
 *
 * Props:
 * - currentUser: the logged-in user object (or null if not logged in)
 * - currentPage: which page is active ('home', 'browse', 'upload', 'admin', etc.)
 * - onNavigate: function to change the current page
 * - onLogout: function to log the user out
 */
function Navbar({ currentUser, currentPage, onNavigate, onLogout }) {
  return (
    <nav className="navbar">
      <div className="container">
        {/* Brand / Logo */}
        <a className="navbar-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span>📚</span> NoteShare
        </a>

        {/* Navigation Links */}
        <div className="navbar-links">
          {/* Browse Notes - visible to everyone */}
          <a onClick={() => onNavigate('browse')} style={{ cursor: 'pointer' }}>
            <span className="nav-label">Browse Notes</span>
          </a>

          {currentUser ? (
            // ─── Logged-in user links ──────────────────────
            <>
              {/* Upload Note */}
              <a onClick={() => onNavigate('upload')} style={{ cursor: 'pointer' }}>
                <span className="nav-label">Upload</span>
              </a>

              {/* My Notes */}
              <a onClick={() => onNavigate('my-notes')} style={{ cursor: 'pointer' }}>
                <span className="nav-label">My Notes</span>
              </a>

              {/* Admin Dashboard - only for ADMIN role */}
              {currentUser.role === 'ADMIN' && (
                <a onClick={() => onNavigate('admin')} style={{ cursor: 'pointer' }}>
                  <span className="nav-label">Admin</span>
                </a>
              )}

              {/* Show logged-in user's name */}
              <span className="navbar-user">👤 {currentUser.name}</span>

              {/* Logout button */}
              <button onClick={onLogout} className="btn-nav-primary">
                Logout
              </button>
            </>
          ) : (
            // ─── Guest links ────────────────────────────────
            <>
              <a onClick={() => onNavigate('login')} style={{ cursor: 'pointer' }}>
                Login
              </a>
              <button
                className="btn-nav-primary"
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
