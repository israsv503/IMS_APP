package com.lbusiness.ims_app.services;


import com.lbusiness.ims_app.models.Category;
import com.lbusiness.ims_app.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

  @Autowired
  private CategoryRepository categoryRepository;

  public List<Category> getAllCategories() {
    return categoryRepository.findAll();
  }

  public Category saveCategory(Category category) {
    return categoryRepository.save(category);
  }
}
