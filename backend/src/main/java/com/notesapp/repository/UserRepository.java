package com.notesapp.repository;

import com.notesapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * UserRepository - handles all database operations for Users.
 *
 * By extending JpaRepository, we get built-in methods for free:
 * - save(user)       → INSERT or UPDATE
 * - findById(id)     → SELECT by ID
 * - findAll()        → SELECT all
 * - deleteById(id)   → DELETE by ID
 * - count()          → COUNT all
 *
 * We can also define custom query methods by naming conventions.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     * Spring automatically creates the SQL: SELECT * FROM users WHERE email = ?
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if an email is already registered.
     * Returns true/false without loading the whole object.
     */
    boolean existsByEmail(String email);
}
