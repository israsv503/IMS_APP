package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.User;
import java.util.List;
import com.lbusiness.ims_app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service layer for managing user accounts.
 * Handles password encryption and registration logic.
 */
@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  // Standard encoder for hashing passwords
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  /**
   * Encrypts the user's password and saves them to the database.
   * 
   * @param user The user object containing raw password and details.
   * @return The saved User entity with an encrypted password.
   */
  public User registerUser(User user) {
    // Hash the password before saving to the database
    String encodedPassword = passwordEncoder.encode(user.getPassword());
    user.setPassword(encodedPassword);
    return userRepository.save(user);
  }

  public Optional<User> findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  /**
   * Retrieves all registered users.
   */
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  /**
   * Deletes a user by their ID.
   */
  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }
}