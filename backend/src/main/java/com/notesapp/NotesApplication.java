package com.notesapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Notes Sharing Application.
 *
 * @SpringBootApplication is a shortcut annotation that combines:
 * - @Configuration: marks this as a config class
 * - @EnableAutoConfiguration: enables Spring Boot's auto-config
 * - @ComponentScan: scans for Spring components in this package
 */
@SpringBootApplication
public class NotesApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotesApplication.class, args);
        System.out.println("✅ Notes Sharing App is running at http://localhost:8080");
    }
}
