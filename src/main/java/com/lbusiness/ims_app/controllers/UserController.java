package com.lbusiness.ims_app.controllers;


import com.lbusiness.ims_app.services.UserService;
import com.lbusiness.ims_app.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}