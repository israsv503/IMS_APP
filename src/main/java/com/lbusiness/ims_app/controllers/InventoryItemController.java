package com.lbusiness.ims_app.controllers;

import com.lbusiness.ims_app.models.InventoryItem;
import com.lbusiness.ims_app.services.InventoryItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryItemController {

  @Autowired
  private InventoryItemService inventoryItemService;

  // GET: http://localhost:8080/api/inventory
  @GetMapping
  public List<InventoryItem> getAll() {
    return inventoryItemService.getAllInventory();
  }

  // POST: http://localhost:8080/api/inventory
  @PostMapping
  public InventoryItem create(@RequestBody InventoryItem item) {
    return inventoryItemService.saveItem(item);
  }

}
