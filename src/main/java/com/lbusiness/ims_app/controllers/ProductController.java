package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.models.Product;
import com.lbusiness.ims_app.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
  @Autowired
  private ProductService productService;

  // GET: http://localhost:8080/api/products
  @GetMapping
  public List<Product> getAll() {
    return productService.getAllProducts();
  }

  // POST: http://localhost:8080/api/products
  @PostMapping
  public Product create(@RequestBody Product product) {
    return productService.saveProduct(product);
  }
}
