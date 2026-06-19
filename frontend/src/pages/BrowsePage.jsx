// src/pages/BrowsePage.jsx
// Browse and search all uploaded notes.

import React, { useState, useEffect } from 'react';
import { getAllNotes, searchNotes } from '../services/api';
import NoteCard from '../components/NoteCard';

/**
 * BrowsePage component
 *
 * Shows all notes in a grid with a search bar at the top.
 * Users can search by keyword (matches title OR subject).
 *
 * Props:
 * - currentUser: the logged-in user (or null)
 */
function BrowsePage({ currentUser }) {
  const [notes,   setNotes]   = useState([]);   // All/filtered notes
  const [keyword, setKeyword] = useState('');   // Search input value
  const [loading, setLoading] = useState(true); // Show loading spinner
  const [error,   setError]   = useState('');   // Error message

  /**
   * Fetch all notes when the component loads.
   * useEffect with [] runs only once (on mount).
   */
  useEffect(() => {
    fetchAllNotes();
  }, []);

  const fetchAllNotes = async () => {
    setLoading(true);
    try {
      const response = await getAllNotes();
      setNotes(response.data.data); // .data.data because API wraps response
    } catch (err) {
      setError('Failed to load notes. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search for notes by keyword.
   * Called when the user clicks the Search button or presses Enter.
   */
  const handleSearch = async () => {
    if (!keyword.trim()) {
      // If search is empty, show all notes
      fetchAllNotes();
      return;
    }

    setLoading(true);
    try {
      const response = await searchNotes(keyword.trim());
      setNotes(response.data.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Allow pressing Enter to trigger search.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container">
      {/* Page header */}
      <div className="page-header">
        <h1>Browse Notes 📚</h1>
        <p>Discover study materials shared by fellow students</p>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or subject (e.g. 'Data Structures', 'Physics')"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          🔍 Search
        </button>
        {keyword && (
          <button
            className="btn btn-outline"
            onClick={() => { setKeyword(''); fetchAllNotes(); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <div className="alert alert-error">❌ {error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="loading">⏳ Loading notes...</div>
      )}

      {/* Notes grid */}
      {!loading && (
        <>
          {/* Result count */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '8px' }}>
            {notes.length} note{notes.length !== 1 ? 's' : ''} found
            {keyword ? ` for "${keyword}"` : ''}
          </p>

          {notes.length === 0 ? (
            // Empty state
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No notes found</h3>
              <p>Try a different search keyword, or be the first to upload!</p>
            </div>
          ) : (
            // Notes grid
            <div className="notes-grid">
              {notes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  showDelete={false} // No delete on browse page
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BrowsePage;
