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
