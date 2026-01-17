package com.lbusiness.ims_app.repositories;

import com.lbusiness.ims_app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Data access layer for User entities.
 * Includes a method to find users by username for the login process.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
}