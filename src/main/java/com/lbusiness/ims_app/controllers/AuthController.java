package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.dto.LoginRequest;
import com.lbusiness.ims_app.models.User;
import com.lbusiness.ims_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

/**
 * Controller responsible for handling authentication requests.
 * Validates user credentials against the database.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

  @Autowired
  private UserService userService;

  // We use the same BCrypt encoder to compare the typed password with the hashed
  // one
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  /**
   * Validates user credentials.
   * 
   * @param loginRequest The credentials provided by the user.
   * @return A success message if valid, or an unauthorized error if invalid.
   */
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    Optional<User> user = userService.findByUsername(loginRequest.getUsername());

    // Check if user exists and if the hashed passwords match
    if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {      
      return ResponseEntity.ok(user.get());
    } else {
      return ResponseEntity.status(401).body("Invalid username or password");
    }
  }
}