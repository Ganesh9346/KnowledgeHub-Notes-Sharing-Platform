// src/pages/MyNotesPage.jsx
// Shows all notes uploaded by the currently logged-in student.

import React, { useState, useEffect } from 'react';
import { getMyNotes } from '../services/api';
import NoteCard from '../components/NoteCard';

/**
 * MyNotesPage component
 *
 * Shows only the notes that the logged-in user has uploaded.
 *
 * Props:
 * - currentUser: the logged-in user object
 * - onNavigate: function to go to another page
 */
function MyNotesPage({ currentUser, onNavigate }) {
  const [notes,   setNotes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  /**
   * Fetch only this user's notes when the component mounts.
   */
  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    setLoading(true);
    try {
      const response = await getMyNotes(currentUser.id);
      setNotes(response.data.data);
    } catch (err) {
      setError('Failed to load your notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Notes 📝</h1>
        <p>Notes you've uploaded — {notes.length} total</p>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">❌ {error}</div>}

      {/* Loading */}
      {loading && <div className="loading">⏳ Loading your notes...</div>}

      {/* Notes grid */}
      {!loading && (
        notes.length === 0 ? (
          // Empty state
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notes uploaded yet</h3>
            <p>Start contributing by uploading your first note!</p>
            <br />
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('upload')}
            >
              📤 Upload First Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                showDelete={false}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default MyNotesPage;
