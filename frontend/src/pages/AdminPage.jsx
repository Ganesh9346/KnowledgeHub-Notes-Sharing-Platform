// src/pages/AdminPage.jsx
// Admin dashboard - view stats and manage notes (delete).

import React, { useState, useEffect } from 'react';
import { getAllNotes, deleteNote, getStats } from '../services/api';

/**
 * AdminPage component
 *
 * Only accessible by users with role = 'ADMIN'.
 * Shows statistics and a table of all notes with delete buttons.
 *
 * Props:
 * - currentUser: the logged-in admin user
 */
function AdminPage({ currentUser }) {
  const [notes,   setNotes]   = useState([]);
  const [stats,   setStats]   = useState({ totalNotes: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [message, setMessage] = useState('');

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch both stats and all notes in parallel.
   * Promise.all runs both requests simultaneously (faster).
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [notesResponse, statsResponse] = await Promise.all([
        getAllNotes(),
        getStats(),
      ]);
      setNotes(notesResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a note after asking for confirmation.
   *
   * @param noteId   ID of the note to delete
   * @param noteTitle Title shown in the confirmation dialog
   */
  const handleDelete = async (noteId, noteTitle) => {
    // Browser's built-in confirm dialog — simple enough for a student project
    const confirmed = window.confirm(
      `Are you sure you want to delete "${noteTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await deleteNote(noteId);
      if (response.data.success) {
        // Remove the deleted note from local state (no need to re-fetch)
        setNotes(prev => prev.filter(n => n.id !== noteId));
        setStats(prev => ({ ...prev, totalNotes: prev.totalNotes - 1 }));
        setMessage('✅ Note deleted successfully.');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (err) {
      setError('Failed to delete note. Please try again.');
    }
  };

  // Guard: only admins can see this page
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '60px' }}>
          <div className="empty-icon">🚫</div>
          <h3>Access Denied</h3>
          <p>You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Dashboard ⚙️</h1>
        <p>Manage notes and monitor platform usage</p>
      </div>

      {/* Messages */}
      {message && <div className="alert alert-success">{message}</div>}
      {error   && <div className="alert alert-error">❌ {error}</div>}

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalNotes}</div>
          <div className="stat-label">📚 Total Notes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">👥 Registered Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {notes.reduce((sum, n) => sum + n.downloadCount, 0)}
          </div>
          <div className="stat-label">⬇️ Total Downloads</div>
        </div>
      </div>

      {/* Notes management table */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)' }}>
          All Notes ({notes.length})
        </h3>

        {loading ? (
          <div className="loading">⏳ Loading...</div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notes yet</h3>
            <p>Notes will appear here once students start uploading.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Uploaded By</th>
                  <th>Date</th>
                  <th>Downloads</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note, index) => (
                  <tr key={note.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td>
                      <strong>{note.title}</strong>
                      {note.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {note.description.substring(0, 60)}{note.description.length > 60 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="note-card-subject">{note.subject}</span>
                    </td>
                    <td>{note.uploadedBy}</td>
                    <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {note.uploadDate}
                    </td>
                    <td style={{ textAlign: 'center' }}>{note.downloadCount}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(note.id, note.title)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
