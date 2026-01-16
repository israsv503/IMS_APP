package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.dto.DashboardStats;
import com.lbusiness.ims_app.services.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

  @Autowired
  private SaleService saleService;

  @GetMapping("/stats")
  public DashboardStats getStats() {
    return saleService.getDashboardStats();
  }
}