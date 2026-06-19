// src/pages/HomePage.jsx
// Landing page - shown when the user first visits the app.

import React from 'react';

/**
 * HomePage component
 *
 * Props:
 * - currentUser: the logged-in user (or null)
 * - onNavigate: function to change the current page
 */
function HomePage({ currentUser, onNavigate }) {
  return (
    <div>
      {/* ─── Hero Section ────────────────────────────────── */}
      <div className="hero">
        <div className="container">
          <h1>📚 Share Notes, Learn Together</h1>
          <p>
            Upload your study notes, discover notes from fellow students,
            and excel in your academics — all in one place.
          </p>

          <div className="hero-actions">
            {currentUser ? (
              // If logged in, show quick-action buttons
              <>
                <button className="btn btn-white" onClick={() => onNavigate('browse')}>
                  Browse Notes
                </button>
                <button className="btn btn-ghost" onClick={() => onNavigate('upload')}>
                  Upload a Note
                </button>
              </>
            ) : (
              // If guest, prompt to register or login
              <>
                <button className="btn btn-white" onClick={() => onNavigate('register')}>
                  Get Started
                </button>
                <button className="btn btn-ghost" onClick={() => onNavigate('browse')}>
                  Browse Notes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Features Section ────────────────────────────── */}
      <div className="container">
        <div className="page-header" style={{ textAlign: 'center', paddingTop: '48px' }}>
          <h1>Why Use NoteShare?</h1>
          <p>Everything students need in one simple platform</p>
        </div>

        {/* Feature cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', paddingBottom: '48px' }}>

          {/* Feature 1 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📤</div>
            <h3 style={{ marginBottom: '8px' }}>Easy Upload</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Upload your notes in PDF, Word, or PowerPoint format in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>Smart Search</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Find notes by subject or title quickly with our search feature.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⬇️</div>
            <h3 style={{ marginBottom: '8px' }}>Free Downloads</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Download any note for free. No hidden fees or paywalls.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎓</div>
            <h3 style={{ marginBottom: '8px' }}>Student-Focused</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Built specifically for students to share knowledge and help each other.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
