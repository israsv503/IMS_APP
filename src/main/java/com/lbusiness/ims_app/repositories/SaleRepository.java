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
  @Query(value = "SELECT s.sold_by AS seller, " +
      "SUM(s.sale_price * s.quantity) AS total_sales, " +
      "SUM((s.sale_price - i.cost_price) * s.quantity) AS net_profit " +
      "FROM sales s " +
      "JOIN inventory_items i ON s.inventory_item_id = i.id " +
      "WHERE s.payment_status = 'PAID' " + // The critical filter
      "GROUP BY s.sold_by", nativeQuery = true)
  List<Object[]> getPerformanceReport();

}
