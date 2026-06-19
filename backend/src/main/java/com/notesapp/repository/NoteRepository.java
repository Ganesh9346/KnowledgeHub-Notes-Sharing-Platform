package com.notesapp.repository;

import com.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * NoteRepository - handles all database operations for Notes.
 *
 * Like UserRepository, we get CRUD operations for free from JpaRepository.
 * We define extra methods for search functionality.
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    /**
     * Find notes by subject (case-insensitive contains search).
     * e.g., searching "math" will find "Mathematics", "Math 101", etc.
     */
    List<Note> findBySubjectContainingIgnoreCase(String subject);

    /**
     * Find notes by title (case-insensitive contains search).
     */
    List<Note> findByTitleContainingIgnoreCase(String title);

    /**
     * Find all notes uploaded by a specific student.
     */
    List<Note> findByUploaderId(Long uploaderId);

    /**
     * Custom JPQL query: Search by title OR subject using a single keyword.
     * @Query lets us write our own query when method naming gets too complex.
     *
     * JPQL (Java Persistence Query Language) uses entity names, not table names.
     */
    @Query("SELECT n FROM Note n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.subject) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Note> searchByKeyword(@Param("keyword") String keyword);
}
