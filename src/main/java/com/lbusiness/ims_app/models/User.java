package com.lbusiness.ims_app.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

/**
 * Entity representing a system user (Partner/Admin).
 * Stores credentials and assigned roles for authentication.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String password; // Will be stored as an encrypted hash

  @Column(unique = true, nullable = false)
  private String email;

  /**
   * Set of roles (e.g., ROLE_USER, ROLE_ADMIN).
   * Used by Spring Security to authorize specific actions.
   */
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
  private Set<String> roles;
}
