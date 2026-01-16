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

  public InventoryItem saveItem(InventoryItem item) {
    return inventoryItemRepository.save(item);
  }
}
