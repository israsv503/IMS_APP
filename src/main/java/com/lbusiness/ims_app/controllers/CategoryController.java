package com.lbusiness.ims_app.controllers;


import com.lbusiness.ims_app.models.Category;
import com.lbusiness.ims_app.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*") // Allows the  frontend to talk to the backend
public class CategoryController {

  @Autowired
  private CategoryService categoryService;

  @GetMapping
  public List<Category> getAll() {
    return categoryService.getAllCategories();
  }

  @PostMapping
  public Category create(@RequestBody Category category) {
    return categoryService.saveCategory(category);
  }
}
