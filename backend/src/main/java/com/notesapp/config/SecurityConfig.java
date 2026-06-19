package com.notesapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * SecurityConfig - configures Spring Security for our application.
 *
 * By default, Spring Security locks down ALL endpoints and shows a login form.
 * Since we have our own login logic (via /api/users/login), we disable the
 * default Spring Security so all API endpoints are publicly accessible.
 *
 * For a production app, you'd add JWT token authentication here.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (Cross-Site Request Forgery) protection
            // This is safe for a stateless REST API (no sessions/cookies)
            .csrf(csrf -> csrf.disable())

            // Allow ALL requests without authentication
            // Our login logic is handled manually in UserController
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );

        return http.build();
    }
}
