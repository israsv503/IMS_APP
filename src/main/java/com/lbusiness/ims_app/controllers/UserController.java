package com.lbusiness.ims_app.controllers;


import com.lbusiness.ims_app.services.UserService;
import org.springframework.http.ResponseEntity;
import com.lbusiness.ims_app.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping
  public List<User> getUsers() {
    return userService.getAllUsers();
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    userService.deleteUser(id);
  }
  /**
   * Creates a new user account with encrypted password.
   */
  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User user) {
      try {
          // Default role for new users is ROLE_USER
          user.setRoles(Set.of("ROLE_USER"));
          User savedUser = userService.registerUser(user);
          return ResponseEntity.ok(savedUser);
      } catch (Exception e) {
          return ResponseEntity.badRequest().body("Error: Username or Email already exists.");
      }
  }
}