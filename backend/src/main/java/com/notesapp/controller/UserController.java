package com.notesapp.controller;

import com.notesapp.model.User;
import com.notesapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * UserController - exposes REST API endpoints for user operations.
 *
 * @RestController = @Controller + @ResponseBody
 *   → All methods return data (JSON) instead of view names.
 *
 * @RequestMapping("/api/users") → All endpoints start with /api/users
 * @CrossOrigin → Allows React frontend (port 3000) to call this API
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String name     = request.get("name");
        String email    = request.get("email");
        String password = request.get("password");

       
        if (name == null || email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(createResponse(false, "Name, email, and password are required", null));
        }

        
        User savedUser = userService.registerStudent(name, email, password);

        if (savedUser == null) {
            // Email already exists
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(createResponse(false, "Email is already registered", null));
        }

        
        Map<String, Object> userData = getUserData(savedUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(createResponse(true, "Registration successful!", userData));
    }

    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email    = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest()
                    .body(createResponse(false, "Email and password are required", null));
        }

        User user = userService.login(email, password);

        if (user == null) {
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createResponse(false, "Invalid email or password", null));
        }

        
        Map<String, Object> userData = getUserData(user);
        return ResponseEntity.ok(createResponse(true, "Login successful!", userData));
    }

    
    private Map<String, Object> createResponse(boolean success, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        response.put("data", data);
        return response;
    }

    
    private Map<String, Object> getUserData(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());
        userData.put("createdAt", user.getCreatedAt());
        return userData;
    }
}
