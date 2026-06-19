// src/components/NoteCard.jsx
// A card component to display a single note in the grid.

import React from 'react';
import { getDownloadUrl } from '../services/api';

/**
 * Returns an emoji based on the file type.
 * Makes the UI a bit more fun and informative.
 */
function getFileIcon(fileType) {
  if (!fileType) return '📄';
  if (fileType.includes('pdf'))  return '📕';
  if (fileType.includes('word') || fileType.includes('wordprocessingml')) return '📘';
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
  if (fileType.includes('text')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  return '📄';
}

/**
 * NoteCard component
 *
 * Props:
 * - note: the note object from the API
 * - onDelete: function to call when admin clicks "Delete" (optional)
 * - showDelete: whether to show the delete button (admin only)
 */
function NoteCard({ note, onDelete, showDelete }) {
  /**
   * Handle download: open the download URL in a new tab.
   * The browser will automatically trigger a file download.
   */
  const handleDownload = () => {
    const url = getDownloadUrl(note.id);
    window.open(url, '_blank'); // Open in new tab to trigger download
  };

  return (
    <div className="note-card">
      {/* File type icon */}
      <div className="note-card-icon">
        {getFileIcon(note.fileType)}
      </div>

      {/* Note title */}
      <div className="note-card-title">{note.title}</div>

      {/* Subject badge */}
      <div>
        <span className="note-card-subject">{note.subject}</span>
      </div>

      {/* Description (if available) */}
      {note.description && (
        <div className="note-card-description">{note.description}</div>
      )}

      {/* Metadata: uploader, date, download count */}
      <div className="note-card-meta">
        <span>👤 {note.uploadedBy}</span>
        <span>📅 {note.uploadDate}</span>
        <span>⬇️ {note.downloadCount} downloads</span>
      </div>

      {/* Action buttons */}
      <div className="note-card-actions">
        {/* Download button - visible to everyone */}
        <button className="btn btn-primary btn-sm" onClick={handleDownload}>
          ⬇️ Download
        </button>

        {/* Delete button - only shown to admin */}
        {showDelete && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(note.id, note.title)}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
