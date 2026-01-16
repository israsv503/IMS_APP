package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.models.Sale;
import com.lbusiness.ims_app.services.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

  @Autowired
  private SaleService saleService;

  @GetMapping
  public List<Sale> getAll() {
    return saleService.getAllSales();
  }

  @PostMapping
  public Sale create(@RequestBody Sale sale) {
    return saleService.processSale(sale);
  }
}