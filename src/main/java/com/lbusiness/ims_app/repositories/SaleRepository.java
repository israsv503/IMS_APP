package com.lbusiness.ims_app.repositories;

import com.lbusiness.ims_app.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

  /**
   * Professional Query to Group total sales and profit by the partner's name.
   * We use a List of Maps to send structured data to the frontend.
   */
  @Query(value = "SELECT sold_by as seller, SUM(sale_price) as total_sales, " +
      "SUM(sale_price - cost_price) as net_profit " +
      "FROM sales s JOIN inventory_items i ON s.inventory_item_id = i.id " +
      "GROUP BY sold_by", nativeQuery = true)
  List<Map<String, Object>> getSalesPerformanceReport();

}
