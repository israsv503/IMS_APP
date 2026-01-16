package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.Product;
import com.lbusiness.ims_app.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
  @Autowired
  private ProductRepository productRepository;

  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }

  public Product saveProduct(Product product) {
    return productRepository.save(product);
  }
}
