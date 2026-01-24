package com.lbusiness.ims_app.controllers;


import com.lbusiness.ims_app.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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
          user.setRoles(Set.of("ROLE_USER"));
          userService.registerUser(user);
          return ResponseEntity.ok("User registered successfully");
      } catch (RuntimeException e) {
          // This catches the custom exception we built earlier (e.g., "Username already taken")
          // and sends the specific message back to the frontend alert.
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
      }
  }
}