package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.InventoryItem;
import com.lbusiness.ims_app.models.Sale;
import com.lbusiness.ims_app.repositories.InventoryItemRepository;
import com.lbusiness.ims_app.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SaleService {

  @Autowired
  private SaleRepository saleRepository;

  @Autowired
  private InventoryItemRepository inventoryItemRepository;

  public List<Sale> getAllSales() {
    return saleRepository.findAll();
  }

  @Transactional // Ensures that if one part fails, the whole process rolls back
  public Sale processSale(Sale sale) {
    // 1. Find the item being sold
    InventoryItem item = inventoryItemRepository.findById(sale.getInventoryItem().getId())
        .orElseThrow(() -> new RuntimeException("Item not found"));

    // 2. Check if we have enough stock
    if (item.getQuantity() < 1) {
      throw new RuntimeException("Out of stock!");
    }

    // 3. Decrease the inventory quantity
    item.setQuantity(item.getQuantity() - 1);
    inventoryItemRepository.save(item);

    // 4. Save the sale record
    return saleRepository.save(sale);
  }
}
