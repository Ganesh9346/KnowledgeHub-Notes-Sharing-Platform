// src/pages/UploadPage.jsx
// Form for students to upload a new note.

import React, { useState } from 'react';
import { uploadNote } from '../services/api';

// Common subject options for the dropdown
const SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Economics',
  'Business Studies',
  'Engineering',
  'Data Structures',
  'Database Management',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Other',
];

/**
 * UploadPage component
 *
 * Props:
 * - currentUser: the logged-in user (required)
 * - onNavigate: function to go to another page
 */
function UploadPage({ currentUser, onNavigate }) {
  // Form fields
  const [title,       setTitle]       = useState('');
  const [subject,     setSubject]     = useState('');
  const [description, setDescription] = useState('');
  const [file,        setFile]        = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  /**
   * Handle file selection from the file input.
   * Validates that it's an allowed file type.
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/png',
      'image/jpeg',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('File type not allowed. Please upload PDF, Word, PowerPoint, or text files.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  /**
   * Handle form submission.
   * Sends the file + metadata to the backend API.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title.trim())   { setError('Please enter a title.'); return; }
    if (!subject)        { setError('Please select a subject.'); return; }
    if (!file)           { setError('Please select a file to upload.'); return; }

    setLoading(true);

    try {
      const response = await uploadNote(
        file,
        title.trim(),
        subject,
        description.trim(),
        currentUser.id,
        currentUser.name
      );

      if (response.data.success) {
        setSuccess('✅ Note uploaded successfully!');
        // Reset form
        setTitle('');
        setSubject('');
        setDescription('');
        setFile(null);
        // Reset file input visually
        document.getElementById('file-input').value = '';
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Upload failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Upload a Note 📤</h1>
        <p>Share your study materials with fellow students</p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        {/* Messages */}
        {success && (
          <div className="alert alert-success">
            {success}
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={() => onNavigate('browse')}
            >
              View All Notes →
            </button>
          </div>
        )}
        {error && <div className="alert alert-error">❌ {error}</div>}

        {/* Upload Form */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Note Title *</label>
            <input
              type="text"
              placeholder='e.g. "Chapter 5 - Binary Trees" or "Thermodynamics Summary"'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Subject */}
          <div className="form-group">
            <label>Subject *</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="">-- Select a Subject --</option>
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              placeholder='Briefly describe what this note covers...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>Select File *</label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Allowed: PDF, Word (.doc/.docx), PowerPoint (.ppt/.pptx), Text, Images — Max 10MB
            </small>

            {/* Show selected file name */}
            {file && (
              <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--primary-light)', borderRadius: '6px', fontSize: '0.88rem', color: 'var(--primary)' }}>
                📎 Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Uploader info (read-only) */}
          <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '18px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            👤 Uploading as: <strong style={{ color: 'var(--text)' }}>{currentUser.name}</strong>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? '⏳ Uploading...' : '📤 Upload Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;
