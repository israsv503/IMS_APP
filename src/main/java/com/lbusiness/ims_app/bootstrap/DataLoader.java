package com.lbusiness.ims_app.bootstrap;

import com.lbusiness.ims_app.models.User;
import com.lbusiness.ims_app.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Set;

/**
 * Component that runs at application startup.
 * Used to initialize default user accounts for the reselling business.
 * Uses environment variables to securely initialize default partner accounts.
 */
@Component
public class DataLoader implements CommandLineRunner {

  @Autowired
  private UserService userService;

  // These values are pulled from your local (ignored) application.properties
  @Value("${app.default.admin.password}")
  private String adminPassword;

  @Value("${app.default.partner.password}")
  private String partnerPassword;

  @Override
  public void run(String... args) throws Exception {
    // Only create users if the database is empty
    if (userService.findByUsername("admin").isEmpty()) {

      // Account for The Admin
      User admin = new User();
      admin.setUsername("admin");
      admin.setPassword(adminPassword); // This will be hashed by the service. // Pulls from properties
      admin.setEmail("admin@resell.sv");
      admin.setRoles(Set.of("ROLE_ADMIN"));
      userService.registerUser(admin);

      // Account for Partner 1
      User partner1 = new User();
      partner1.setUsername("partner1");
      partner1.setPassword(partnerPassword); // This will be hashed by the service. // Pulls from properties
      partner1.setEmail("p1@resell.sv");
      partner1.setRoles(Set.of("ROLE_USER"));
      userService.registerUser(partner1);

      System.out.println("Default partner accounts initialized using secure properties.");
    }
  }
}