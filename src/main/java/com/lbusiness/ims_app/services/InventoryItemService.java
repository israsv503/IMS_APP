package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.InventoryItem;
import com.lbusiness.ims_app.repositories.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class InventoryItemService {

  @Autowired
  private InventoryItemRepository inventoryItemRepository;

  public List<InventoryItem> getAllInventory() {
    return inventoryItemRepository.findAll();
  }

  public InventoryItem saveItem(InventoryItem newItem) {
    // 1. Check if an item with this SKU already exists
    return inventoryItemRepository.findBySku(newItem.getSku())
        .map(existingItem -> {
          // 2. If it exists, just increase the quantity
          existingItem.setQuantity(existingItem.getQuantity() + newItem.getQuantity());
          return inventoryItemRepository.save(existingItem);
        })
        .orElseGet(() -> {
          // 3. If it doesn't exist, save it as a new row
          return inventoryItemRepository.save(newItem);
        });
  }

  /**
   * Deletes an inventory item from the database by its unique ID.
   * This operation is final and will remove the stock record.
   * * @param id The ID of the inventory item to be removed.
   */
  public void deleteItem(Long id) {
    inventoryItemRepository.deleteById(id);
  }
}
