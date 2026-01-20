/**
 * Security Check: Verifies if a user session exists.
 * Redirects to login page if no authenticated user is found.
 */
function checkAuth() {
  const user = sessionStorage.getItem("loggedUser");
  if (!user) {
    window.location.href = "login.html";
  } else {
    const userData = JSON.parse(user);
    // Display the partner's name in the navbar
    document.getElementById("userWelcome").innerText = "Logged in as: " + userData.username;
  }
}

// Run the check before anything else
checkAuth();

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

// Window.onload function
window.onload = () => {
  fetchStats();
  fetchInventory();
  loadCategories(); // New call
  fetchSales();
  fetchPerformanceReport();
};

// Function to fetch the inventory list and inject it into the inventory table
async function fetchInventory() {
  try {
    const response = await fetch("http://localhost:8080/api/inventory");
    const inventory = await response.json();

    const tableBody = document.getElementById("inventoryTableBody");
    tableBody.innerHTML = ""; // Clear current rows

    inventory.forEach((item) => {
      // Check if stock is low (threshold of 3)
      const isLowStock = item.quantity <= 3;
      const stockClass = isLowStock ? "text-danger fw-bold" : "text-dark";
      const alertBadge = isLowStock ? '<span class="badge bg-danger ms-1">Low!</span>' : "";

      const row = `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.product.brand}</td>
                    <td><span class="badge bg-secondary">${item.sku}</span></td>
                    <td>${item.specifications}</td>
                    <td class="${stockClass}">${item.quantity} ${alertBadge}</td>
                    <td>$${item.costPrice.toFixed(2)}</td>
                    <td>
                      <button class="btn btn-sm btn-primary" onclick="sellItem(${item.id})">Sell 1</button>
                      <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})">Delete</button>     
                    </td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
}

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



/**
 * Records a sale by linking the current logged-in partner's name.
 * Automatically pulls the username from sessionStorage for audit purposes.
 * @param {number} inventoryItemId - The ID of the item being sold.
 */
async function sellItem(inventoryItemId) {
    const price = prompt("Enter Sale Price:");
    if (price === null || price === "") return;

    // Retrieve the user object from session storage
    const sessionUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    const currentUsername = sessionUser ? sessionUser.username : "Unknown";

    const saleData = {
        inventoryItem: { id: inventoryItemId },
        salePrice: parseFloat(price),
        soldBy: currentUsername // Automatically assigned based on login
    };

    try {
        const response = await fetch('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            alert(`Sale recorded successfully by ${currentUsername}!`);
            fetchStats();
            fetchInventory();
        } else {
            alert('Error recording sale. Please check stock levels.');
        }
    } catch (error) {
        console.error('Error during sale:', error);
    }
}

// Loading Categories
async function loadCategories() {
  const select = document.getElementById("prodCategory");
  select.innerHTML = '<option value="">Loading categories...</option>'; // Visual feedback

  try {
    const response = await fetch("http://localhost:8080/api/categories");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const categories = await response.json();
    console.log("Categories found:", categories); // This will show in your F12 Console

    select.innerHTML = '<option value="">Select a Category</option>';

    if (categories.length === 0) {
      select.innerHTML = '<option value="">No categories found in DB</option>';
    } else {
      categories.forEach((cat) => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
      });
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    select.innerHTML = '<option value="">Error loading data</option>';
  }
}

// Event Listener for the new Product Form
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const productData = {
    name: document.getElementById("prodName").value,
    brand: document.getElementById("prodBrand").value,
    description: document.getElementById("prodDescription").value,
    category: { id: document.getElementById("prodCategory").value },
  };

  const response = await fetch("http://localhost:8080/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (response.ok) {
    alert("Product created! Now you can add inventory for it.");
    location.reload();
  } else {
    alert("Error creating product. Please try again.");
  }
});

/**
 * Sends a DELETE request to the API to remove a specific inventory record.
 * Includes a user confirmation guardrail to prevent accidental data loss.
 * * @param {number} id - The ID of the inventory item to delete.
 */
async function deleteItem(id) {
  // Professional UX: Always confirm before destructive actions
  if (
    !confirm(
      "Are you sure you want to delete this item? This will remove all stock records for this SKU."
    )
  ) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/inventory/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      // Refreshing the UI ensures the user sees the immediate impact on stock/profit
      fetchStats();
      fetchInventory();
    } else {
      alert("Failed to delete the item. Please try again.");
    }
  } catch (error) {
    console.error("Error during deletion:", error);
  }
}

/**
 * Clears the user's session data and redirects to the login page.
 * This effectively "signs out" the partner and protects the dashboard.
 */
function logout() {
    // Professional practice: Clear the specific session key
    sessionStorage.removeItem('loggedUser');
    
    // Redirect the user back to the gatekeeper
    window.location.href = 'login.html';
}

/**
 * Fetches the most recent sales from the API and displays them.
 * Provides transparency for partners to see recent business activity.
 */
async function fetchSales() {
    try {
        const response = await fetch('http://localhost:8080/api/sales');
        const sales = await response.json();
        const tableBody = document.getElementById('salesTableBody');
        tableBody.innerHTML = '';

        // Show the last 5 sales (reversed to show newest first)
        sales.reverse().slice(0, 5).forEach(sale => {
            const row = `
                <tr>
                    <td>${sale.inventoryItem.product.name}</td>
                    <td class="text-success fw-bold">$${sale.salePrice.toFixed(2)}</td>
                    <td>${sale.soldBy}</td>
                    <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching sales:', error);
    }
}

/**
 * Fetches and displays the profit contribution of each partner.
 */
async function fetchPerformanceReport() {
    try {
        const response = await fetch('http://localhost:8080/api/sales/report');
        const data = await response.json();
        const reportDiv = document.getElementById('performanceReport');
        reportDiv.innerHTML = '';

        data.forEach(stat => {
            const card = `
                <div class="col-md-4">
                    <div class="card border-left-primary h-100 py-2">
                        <div class="card-body">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                ${stat.seller}</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                Profit: $${parseFloat(stat.net_profit).toFixed(2)}
                            </div>
                            <small class="text-muted">Total Rev: $${parseFloat(stat.total_sales).toFixed(2)}</small>
                        </div>
                    </div>
                </div>
            `;
            reportDiv.innerHTML += card;
        });
    } catch (error) {
        console.error('Error fetching report:', error);
    }
}




