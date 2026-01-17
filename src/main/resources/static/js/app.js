async function fetchStats() {
  try {
    const response = await fetch("http://localhost:8080/api/dashboard/stats");
    const data = await response.json();

    // Update the HTML elements with data from the API
    document.getElementById("totalItems").innerText = data.totalItems;
    document.getElementById(
      "totalValue"
    ).innerText = `$${data.totalInventoryValue.toFixed(2)}`;
    document.getElementById(
      "totalRevenue"
    ).innerText = `$${data.totalRevenue.toFixed(2)}`;
    document.getElementById(
      "totalProfit"
    ).innerText = `$${data.totalProfit.toFixed(2)}`;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    alert("Could not connect to the backend. Is it running?");
  }
}

// Load stats when the page opens
window.onload = fetchStats;


// Function to fetch the inventory list and inject it into the inventory table

async function fetchInventory() {
  try {
    const response = await fetch("http://localhost:8080/api/inventory");
    const inventory = await response.json();

    const tableBody = document.getElementById("inventoryTableBody");
    tableBody.innerHTML = ""; // Clear current rows

    inventory.forEach((item) => {
      const row = `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.product.brand}</td>
                    <td><span class="badge bg-secondary">${item.sku}</span></td>
                    <td>${item.specifications}</td>
                    <td>
                        <span class="fw-bold ${
                          item.quantity < 3 ? "text-danger" : "text-dark"
                        }">
                            ${item.quantity}
                        </span>
                    </td>
                    <td>$${item.costPrice.toFixed(2)}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" onclick="sellItem(${item.id})"> Sell 1      
                    </td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
}

// Update the window.onload to call both functions
window.onload = () => {
  fetchStats();
  fetchInventory();
};

// The Add Product Form Logic
document
  .getElementById("inventoryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent page reload

    const newItem = {
      product: { id: document.getElementById("formProductId").value },
      sku: document.getElementById("formSku").value,
      specifications: document.getElementById("formSpecs").value,
      quantity: parseInt(document.getElementById("formQuantity").value),
      costPrice: parseFloat(document.getElementById("formCost").value),
    };

    try {
      const response = await fetch("http://localhost:8080/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        alert("Item added successfully!");
        location.reload(); // Refresh to show new data
      } else {
        alert("Error saving item. Check if Product ID exists.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });


  // This function will ask you for the price the item is being sold for and then talk to the SaleController
  async function sellItem(inventoryItemId) {
    const price = prompt("Enter Sale Price:");

    if (price === null || price === "") return; // User cancelled

    const saleData = {
      inventoryItem: { id: inventoryItemId },
      salePrice: parseFloat(price),
      soldBy: "AdminUser", 
    };

    try {
      const response = await fetch("http://localhost:8080/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        alert("Sale recorded successfully!");
        fetchStats(); // Refresh the dashboard numbers
        fetchInventory(); // Refresh the table quantities
      } else {
        const error = await response.json();
        alert(
          "Error recording sale: " + (error.message || "Check stock levels.")
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
