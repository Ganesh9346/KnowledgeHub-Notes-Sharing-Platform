// src/services/api.js
// ============================================================
// API Service - all calls to the Spring Boot backend go here.
// Using axios for HTTP requests (simpler than fetch).
// ============================================================

import axios from 'axios';

// Base URL of our Spring Boot backend
const BASE_URL = 'http://localhost:8080/api';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// ─── USER API ────────────────────────────────────────────────

/**
 * Register a new student account.
 * POST /api/users/register
 */
export const registerUser = (name, email, password) => {
  return api.post('/users/register', { name, email, password });
};

/**
 * Login with email and password.
 * POST /api/users/login
 */
export const loginUser = (email, password) => {
  return api.post('/users/login', { email, password });
};

// ─── NOTES API ───────────────────────────────────────────────

/**
 * Get all notes.
 * GET /api/notes
 */
export const getAllNotes = () => {
  return api.get('/notes');
};

/**
 * Search notes by keyword.
 * GET /api/notes/search?keyword=...
 */
export const searchNotes = (keyword) => {
  return api.get(`/notes/search?keyword=${encodeURIComponent(keyword)}`);
};

/**
 * Get notes uploaded by a specific user.
 * GET /api/notes/my/:uploaderId
 */
export const getMyNotes = (uploaderId) => {
  return api.get(`/notes/my/${uploaderId}`);
};

/**
 * Upload a new note.
 * POST /api/notes/upload (multipart/form-data)
 *
 * Uses FormData because we're sending a file + text fields together.
 */
export const uploadNote = (file, title, subject, description, uploaderId, uploaderName) => {
  const formData = new FormData();
  formData.append('file', file);           // The actual file
  formData.append('title', title);
  formData.append('subject', subject);
  formData.append('description', description);
  formData.append('uploaderId', uploaderId);
  formData.append('uploaderName', uploaderName);

  return api.post('/notes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Get the download URL for a note.
 * The browser will open this URL and download the file.
 */
export const getDownloadUrl = (noteId) => {
  return `${BASE_URL}/notes/download/${noteId}`;
};

/**
 * Delete a note (admin only).
 * DELETE /api/notes/:id
 */
export const deleteNote = (noteId) => {
  return api.delete(`/notes/${noteId}`);
};

/**
 * Get dashboard stats (total notes, total users).
 * GET /api/notes/stats
 */
export const getStats = () => {
  return api.get('/notes/stats');
};

export default api;
