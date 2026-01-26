package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.models.Sale;
import com.lbusiness.ims_app.services.SaleService;
import com.lbusiness.ims_app.repositories.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

  @Autowired
  private SaleService saleService;

  @Autowired
  private SaleRepository saleRepository;

  @GetMapping
  public List<Sale> getAll() {
    return saleService.getAllSales();
  }

  @PostMapping
  public Sale create(@RequestBody Sale sale) {
    return saleService.processSale(sale);
  }

  /**
   * Endpoint to fetch the performance report for all partners.
   * Converts Object[] results into Maps with named properties for frontend.
   */
  @GetMapping("/report")
  public List<Map<String, Object>> getReport() {
    List<Object[]> results = saleRepository.getPerformanceReport();
    List<Map<String, Object>> report = new ArrayList<>();
    
    for (Object[] row : results) {
      Map<String, Object> map = new HashMap<>();
      map.put("seller", row[0]);           // s.sold_by
      map.put("total_sales", row[1]);      // SUM(s.sale_price * s.quantity)
      map.put("net_profit", row[2]);       // SUM((s.sale_price - i.cost_price) * s.quantity)
      report.add(map);
    }
    
    return report;
  }

  /**
   * Updates the payment status of an existing transaction (e.g., Credit -> Paid).
   */
  @PatchMapping("/{id}/payment-status")
  public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody String newStatus) {
      Sale sale = saleRepository.findById(id).orElseThrow();
      sale.setPaymentStatus(newStatus);
      saleRepository.save(sale);
      return ResponseEntity.ok().build();
  }


  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String newStatus) {
    Sale sale = saleService.getAllSales().stream()
        .filter(s -> s.getId().equals(id))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Sale not found"));

    sale.setPaymentStatus(newStatus);
    saleRepository.save(sale); // Ensure SaleRepository is @Autowired here
    return ResponseEntity.ok().build();
  }
}