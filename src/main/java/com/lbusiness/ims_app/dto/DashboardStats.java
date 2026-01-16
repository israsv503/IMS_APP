package com.lbusiness.ims_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
  private long totalItems;
  private double totalInventoryValue; // Sum of cost price * quantity
  private double totalRevenue; // Sum of all sale prices
  private double totalProfit; // Revenue - Cost of sold items
}