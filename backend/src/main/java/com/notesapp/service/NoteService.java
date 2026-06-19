package com.notesapp.service;

import com.notesapp.model.Note;
import com.notesapp.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * NoteService - contains all business logic for Notes.
 *
 * Handles file uploads, downloads, search, and CRUD operations.
 */
@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    // Read upload directory from application.properties
    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    /**
     * Upload a new note file.
     *
     * Steps:
     * 1. Create the uploads directory if it doesn't exist
     * 2. Give the file a unique name to avoid conflicts
     * 3. Save the file to disk
     * 4. Save the note metadata to the database
     *
     * @param file        The uploaded file (PDF, DOCX, etc.)
     * @param title       Note title
     * @param subject     Note subject
     * @param description Short description
     * @param uploaderId  ID of the student uploading
     * @param uploaderName Name of the student uploading
     * @return Saved Note object
     */
    public Note uploadNote(MultipartFile file, String title, String subject,
                           String description, Long uploaderId, String uploaderName)
            throws IOException {

        // Step 1: Make sure the uploads folder exists
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs(); // Create folder (and parent folders) if not present
        }

        // Step 2: Create a unique filename to avoid overwriting existing files
        // UUID = Universally Unique Identifier (random string)
        String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        // Step 3: Save the actual file to the uploads folder
        Path filePath = Paths.get(uploadDir, uniqueFileName);
        Files.copy(file.getInputStream(), filePath); // Copy bytes from upload to disk

        // Step 4: Create Note metadata object and save to database
        Note note = new Note();
        note.setTitle(title);
        note.setSubject(subject);
        note.setDescription(description);
        note.setFileName(file.getOriginalFilename()); // Original name shown to users
        note.setFilePath(filePath.toString());         // Server path to find the file
        note.setFileType(file.getContentType());       // "application/pdf", etc.
        note.setUploadedBy(uploaderName);
        note.setUploaderId(uploaderId);
        note.setUploadDate(LocalDate.now().toString());
        note.setDownloadCount(0);

        return noteRepository.save(note);
    }

    /**
     * Get all notes (for the main notes list page).
     */
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    /**
     * Get a single note by its ID.
     */
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    /**
     * Search notes by a keyword (searches both title and subject).
     */
    public List<Note> searchNotes(String keyword) {
        return noteRepository.searchByKeyword(keyword);
    }

    /**
     * Get all notes uploaded by a specific student.
     */
    public List<Note> getNotesByUploader(Long uploaderId) {
        return noteRepository.findByUploaderId(uploaderId);
    }

    /**
     * Increment the download count when someone downloads a note.
     */
    public void incrementDownloadCount(Long noteId) {
        Optional<Note> optionalNote = noteRepository.findById(noteId);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setDownloadCount(note.getDownloadCount() + 1);
            noteRepository.save(note);
        }
    }

    /**
     * Delete a note (admin only).
     * Also deletes the actual file from disk.
     */
    public boolean deleteNote(Long id) {
        Optional<Note> optionalNote = noteRepository.findById(id);
        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();

            // Delete the actual file from disk
            try {
                Path filePath = Paths.get(note.getFilePath());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // File might not exist; that's okay, just log it
                System.out.println("Could not delete file: " + note.getFilePath());
            }

            // Delete the record from database
            noteRepository.deleteById(id);
            return true;
        }
        return false; // Note not found
    }

    /**
     * Get total number of notes (for admin dashboard).
     */
    public long getTotalNotes() {
        return noteRepository.count();
    }
}
