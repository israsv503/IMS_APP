package com.lbusiness.ims_app.dto;

import lombok.Data;

/**
 * Data Transfer Object for login attempts.
 * Captures the username and password from the frontend request.
 */
@Data
public class LoginRequest {
  private String username;
  private String password;
}