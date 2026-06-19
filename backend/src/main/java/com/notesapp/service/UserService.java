package com.notesapp.service;

import com.notesapp.model.User;
import com.notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

/**
 * UserService - contains all business logic related to Users.
 *
 * The Service layer sits between the Controller (API layer) and
 * Repository (database layer). It handles the actual logic.
 *
 * @Service marks this class as a Spring-managed service component.
 */
@Service
public class UserService {

    // Spring automatically injects the UserRepository (Dependency Injection)
    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new student.
     *
     * @param name     Student's full name
     * @param email    Student's email (must be unique)
     * @param password Student's password
     * @return Saved user object, or null if email already exists
     */
    public User registerStudent(String name, String email, String password) {
        // Check if email is already taken
        if (userRepository.existsByEmail(email)) {
            return null; // Email already registered
        }

        // Create a new user object
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // In production, use BCryptPasswordEncoder
        user.setRole("STUDENT");
        user.setCreatedAt(LocalDate.now().toString());

        // Save to database and return the saved user
        return userRepository.save(user);
    }

    /**
     * Login: Check if email and password match a user in the database.
     *
     * @param email    Email entered by user
     * @param password Password entered by user
     * @return User object if credentials are correct, null otherwise
     */
    public User login(String email, String password) {
        // Find user by email
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Check if user exists AND password matches
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPassword().equals(password)) {
                return user; // ✅ Login successful
            }
        }

        return null; // ❌ Invalid credentials
    }

    /**
     * Get a user by their ID.
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Get the total number of registered users (for admin dashboard).
     */
    public long getTotalUsers() {
        return userRepository.count();
    }
}
