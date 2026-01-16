package com.lbusiness.ims_app.repositories;


import com.lbusiness.ims_app.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  // JpaRepository gives us save(), findAll(), findById(), delete() for free!
}
