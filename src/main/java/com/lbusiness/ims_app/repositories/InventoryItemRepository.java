package com.lbusiness.ims_app.repositories;


import com.lbusiness.ims_app.models.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
  Optional<InventoryItem> findBySku(String sku); // This allows us to look up by SKU
}
