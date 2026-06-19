package com.notesapp.model;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Note entity - represents an uploaded note/document in our database.
 *
 * Each note has a title, subject, uploader info, and the path to the file.
 */
@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false)
    private String title; // e.g., "Chapter 3 - Data Structures"

    @Column(nullable = false)
    private String subject; // e.g., "Computer Science", "Mathematics"

    @Column(length = 500)
    private String description; // Short description of the note

    @Column(name = "file_name", nullable = false)
    private String fileName; // Original name of the uploaded file

    @Column(name = "file_path", nullable = false)
    private String filePath; // Where the file is stored on the server

    @Column(name = "file_type")
    private String fileType; // e.g., "application/pdf", "image/png"

    @Column(name = "uploaded_by")
    private String uploadedBy; // Name of the student who uploaded it

    @Column(name = "uploader_id")
    private Long uploaderId; // ID of the student who uploaded it

    @Column(name = "upload_date")
    private String uploadDate; // Date uploaded (e.g., "2024-01-15")

    @Column(name = "download_count")
    private int downloadCount = 0; // Track how many times the note was downloaded
}
