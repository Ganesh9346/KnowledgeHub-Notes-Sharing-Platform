package com.notesapp.controller;

import com.notesapp.model.Note;
import com.notesapp.service.NoteService;
import com.notesapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;


@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController{

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserService userService;

    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllNotes() {
        List<Note> notes = noteService.getAllNotes();
        return ResponseEntity.ok(createResponse(true, "Notes fetched", notes));
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);

        if (!note.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createResponse(false, "Note not found", null));
        }

        return ResponseEntity.ok(createResponse(true, "Note found", note.get()));
    }

    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchNotes(@RequestParam String keyword) {
        List<Note> results = noteService.searchNotes(keyword);
        return ResponseEntity.ok(createResponse(true, "Search results", results));
    }

    
    @GetMapping("/my/{uploaderId}")
    public ResponseEntity<Map<String, Object>> getMyNotes(@PathVariable Long uploaderId) {
        List<Note> notes = noteService.getNotesByUploader(uploaderId);
        return ResponseEntity.ok(createResponse(true, "My notes", notes));
    }

   
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("subject") String subject,
            @RequestParam(value = "description", defaultValue = "") String description,
            @RequestParam("uploaderId") Long uploaderId,
            @RequestParam("uploaderName") String uploaderName) {

        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(createResponse(false, "Please select a file to upload", null));
        }

        
        String contentType = file.getContentType();
        if (!isAllowedFileType(contentType)) {
            return ResponseEntity.badRequest()
                    .body(createResponse(false,
                            "Only PDF, Word, PowerPoint, and text files are allowed", null));
        }

        try {
            Note savedNote = noteService.uploadNote(
                    file, title, subject, description, uploaderId, uploaderName);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(createResponse(true, "Note uploaded successfully!", savedNote));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse(false, "Failed to upload file: " + e.getMessage(), null));
        }
    }

    
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadNote(@PathVariable Long id) {
        Optional<Note> optionalNote = noteService.getNoteById(id);

        if (!optionalNote.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Note note = optionalNote.get();

        try {
            // Load the file from disk
            Path filePath = Paths.get(note.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            // Increment the download counter
            noteService.incrementDownloadCount(id);

            // Return the file as a downloadable response
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(
                            note.getFileType() != null ? note.getFileType() : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + note.getFileName() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteNote(@PathVariable Long id) {
        boolean deleted = noteService.deleteNote(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createResponse(false, "Note not found", null));
        }

        return ResponseEntity.ok(createResponse(true, "Note deleted successfully", null));
    }

    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNotes", noteService.getTotalNotes());
        stats.put("totalUsers", userService.getTotalUsers());
        return ResponseEntity.ok(createResponse(true, "Stats fetched", stats));
    }

    // ─── Helper Methods ──────────────────────────────────────────────────────

    
    private Map<String, Object> createResponse(boolean success, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        response.put("data", data);
        return response;
    }

    
    private boolean isAllowedFileType(String contentType) {
        if (contentType == null) return false;
        return contentType.equals("application/pdf") ||
               contentType.equals("application/msword") ||
               contentType.contains("wordprocessingml") ||  // .docx
               contentType.contains("presentationml") ||    // .pptx
               contentType.equals("application/vnd.ms-powerpoint") ||
               contentType.startsWith("text/") ||
               contentType.equals("image/png") ||
               contentType.equals("image/jpeg");
    }
}
