package com.lbusiness.ims_app.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "inventory_item_id", nullable = false)
  private InventoryItem inventoryItem;

  @Column(nullable = false)
  private Double salePrice;

  @Column(nullable = false)
  private LocalDateTime saleDate;

  // We will link this to the User entity later when we do Security
  private String soldBy;

  // --- NEW BUSINESS FIELDS ---

  @Column(nullable = false)
  private Integer quantity; // To handle selling multiple pairs at once

  @Column(nullable = false)
  private String paymentStatus; // e.g., "PAID" or "CREDIT"

  @Column(columnDefinition = "TEXT")
  private String notes; // To store the "Why" behind credit or special sales

  @PrePersist
  protected void onCreate() {
    this.saleDate = LocalDateTime.now(); // Automatically sets the date when saved
  }
}