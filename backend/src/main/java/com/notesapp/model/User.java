package com.notesapp.model;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * User entity - represents a student or admin in our database.
 *
 * @Entity tells JPA/Hibernate to map this class to a database table.
 * @Table(name="users") sets the table name.
 * @Data (Lombok) auto-generates getters, setters, toString, equals, hashCode.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true) // Email must be unique
    private String email;

    @Column(nullable = false)
    private String password; // Stored as plain text for simplicity (use BCrypt in production)

    @Column(nullable = false)
    private String role; // "STUDENT" or "ADMIN"

    @Column(name = "created_at")
    private String createdAt; // Stored as string for simplicity (e.g., "2024-01-15")
}
