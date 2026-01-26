package com.lbusiness.ims_app.services;

import com.lbusiness.ims_app.models.InventoryItem;
import com.lbusiness.ims_app.models.Sale;
import com.lbusiness.ims_app.repositories.InventoryItemRepository;
import com.lbusiness.ims_app.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lbusiness.ims_app.dto.DashboardStats;
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

  @Transactional
  public Sale processSale(Sale sale) {
    // 1. Find the item being sold
    InventoryItem item = inventoryItemRepository.findById(sale.getInventoryItem().getId())
        .orElseThrow(() -> new RuntimeException("Item not found"));

    // 2. NEW: Check if we have enough stock for the requested QUANTITY
    if (item.getQuantity() < sale.getQuantity()) {
      throw new RuntimeException("Insufficient stock! Only " + item.getQuantity() + " available.");
    }

    // 3. Decrease the inventory by the specific amount sold
    item.setQuantity(item.getQuantity() - sale.getQuantity());
    inventoryItemRepository.save(item);

    // 4. Save the sale record (Quantity, Status, and Notes are now included)
    return saleRepository.save(sale);
  }

  public DashboardStats getDashboardStats() {
    List<Sale> allSales = saleRepository.findAll();
    List<InventoryItem> allInventory = inventoryItemRepository.findAll();

    double inventoryValue = allInventory.stream()
        .mapToDouble(item -> item.getCostPrice() * item.getQuantity())
        .sum();

    // UPDATED REVENUE: Only count sales where status is 'PAID'
    double revenue = allSales.stream()
        .filter(sale -> "PAID".equals(sale.getPaymentStatus())) // Filter logic
        .mapToDouble(sale -> sale.getSalePrice() * sale.getQuantity())
        .sum();

    // UPDATED COST: Only count cost for the items we actually got paid for
    double costOfSoldItems = allSales.stream()
        .filter(sale -> "PAID".equals(sale.getPaymentStatus())) // Filter logic
        .mapToDouble(sale -> sale.getInventoryItem().getCostPrice() * sale.getQuantity())
        .sum();

    double profit = revenue - costOfSoldItems;

    return new DashboardStats(
        inventoryItemRepository.count(),
        inventoryValue,
        revenue,
        profit);
  }
}