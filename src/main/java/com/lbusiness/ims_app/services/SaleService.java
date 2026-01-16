package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.InventoryItem;
import com.lbusiness.ims_app.models.Sale;
import com.lbusiness.ims_app.repositories.InventoryItemRepository;
import com.lbusiness.ims_app.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lbusiness.ims_app.dto.DashboardStats;
import com.lbusiness.ims_app.models.Product;

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

  // Methods for the results sent to the Dashboard
  public DashboardStats getDashboardStats() {
    List<Sale> allSales = saleRepository.findAll();
    List<InventoryItem> allInventory = inventoryItemRepository.findAll();

    // Calculate Total Inventory Value (Stock on hand)
    double inventoryValue = allInventory.stream()
        .mapToDouble(item -> item.getCostPrice() * item.getQuantity())
        .sum();

    // Calculate Revenue
    double revenue = allSales.stream()
        .mapToDouble(Sale::getSalePrice)
        .sum();

    // Calculate Total Cost of Sold Items to find Profit
    double costOfSoldItems = allSales.stream()
        .mapToDouble(sale -> sale.getInventoryItem().getCostPrice())
        .sum();

    double profit = revenue - costOfSoldItems;

    return new DashboardStats(
        inventoryItemRepository.count(),
        inventoryValue,
        revenue,
        profit);
  }
}
