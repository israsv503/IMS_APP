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
    // Safety check: only update welcome text if the element exists on this page
    const welcomeEl = document.getElementById("userWelcome");
    if (welcomeEl) {
      welcomeEl.innerText = "Logged in as: " + userData.username;
    }
  }
}

// Run the check before anything else
checkAuth();

/**
 * Page Router:
 * Ensures functions only run if the required HTML elements exist on the current page.
 */
window.onload = () => {
  // 1. Dashboard Logic (index.html)
  // We check for 'totalItems' as a signal that we are on the Dashboard
  if (document.getElementById("totalItems")) {
    fetchStats();
    fetchSales();
    fetchPerformanceReport();
  }

  // 2. Inventory Logic (inventory.html)
  // We check for 'inventoryTableBody' as a signal we are on the Inventory page
  if (document.getElementById("inventoryTableBody")) {
    fetchInventory();
    loadCategories(); // Categories needed for modals on this page
  }
};

// --- API Functions

async function fetchStats() {
  try {
    const response = await fetch("http://localhost:8080/api/dashboard/stats");
    const data = await response.json();

    document.getElementById("totalItems").innerText = data.totalItems;
    document.getElementById("totalValue").innerText =
      `$${data.totalInventoryValue.toFixed(2)}`;
    document.getElementById("totalRevenue").innerText =
      `$${data.totalRevenue.toFixed(2)}`;
    document.getElementById("totalProfit").innerText =
      `$${data.totalProfit.toFixed(2)}`;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
}

async function fetchInventory() {
  try {
    const response = await fetch("http://localhost:8080/api/inventory");
    const inventory = await response.json();
    const tableBody = document.getElementById("inventoryTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    inventory.forEach((item) => {
      const isLowStock = item.quantity <= 3;
      const stockClass = isLowStock ? "text-danger fw-bold" : "text-dark";
      const alertBadge = isLowStock
        ? '<span class="badge bg-danger ms-1">Low!</span>'
        : "";

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

// Add Inventory Form Logic
const inventoryForm = document.getElementById("inventoryForm");
if (inventoryForm) {
  inventoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

// Global Search Logic (New addition for organized navigation)
document.getElementById("searchInput")?.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll("#inventoryTableBody tr");
  rows.forEach((row) => {
    const brand = row.cells[1].textContent.toLowerCase();
    const sku = row.cells[2].textContent.toLowerCase();
    row.style.display =
      brand.includes(searchTerm) || sku.includes(searchTerm) ? "" : "none";
  });
});

async function sellItem(inventoryItemId) {
  const price = prompt("Enter Sale Price:");
  if (price === null || price === "") return;
  const sessionUser = JSON.parse(sessionStorage.getItem("loggedUser"));
  const currentUsername = sessionUser ? sessionUser.username : "Unknown";
  const saleData = {
    inventoryItem: { id: inventoryItemId },
    salePrice: parseFloat(price),
    soldBy: currentUsername,
  };
  try {
    const response = await fetch("http://localhost:8080/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData),
    });
    if (response.ok) {
      alert(`Sale recorded!`);
      location.reload(); // Refreshing to update both Stats and Tables
    }
  } catch (error) {
    console.error("Error during sale:", error);
  }
}

async function loadCategories() {
  const select = document.getElementById("prodCategory");
  if (!select) return;
  try {
    const response = await fetch("http://localhost:8080/api/categories");
    const categories = await response.json();
    select.innerHTML = '<option value="">Select a Category</option>';
    categories.forEach((cat) => {
      select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Product Form Logic
const productForm = document.getElementById("productForm");
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
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
      alert("Product created!");
      location.reload();
    }
  });
}

async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;
  try {
    const response = await fetch(`http://localhost:8080/api/inventory/${id}`, {
      method: "DELETE",
    });
    if (response.ok) location.reload();
  } catch (error) {
    console.error("Error during deletion:", error);
  }
}

function logout() {
  sessionStorage.removeItem("loggedUser");
  window.location.href = "login.html";
}

async function fetchSales() {
  try {
    const response = await fetch("http://localhost:8080/api/sales");
    const sales = await response.json();
    const tableBody = document.getElementById("salesTableBody");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    sales
      .reverse()
      .slice(0, 5)
      .forEach((sale) => {
        const row = `<tr><td>${sale.inventoryItem.product.name}</td><td class="text-success fw-bold">$${sale.salePrice.toFixed(2)}</td><td>${sale.soldBy}</td><td>${new Date(sale.saleDate).toLocaleDateString()}</td></tr>`;
        tableBody.innerHTML += row;
      });
  } catch (error) {
    console.error("Error fetching sales:", error);
  }
}

async function fetchPerformanceReport() {
  try {
    const response = await fetch("http://localhost:8080/api/sales/report");
    const data = await response.json();
    const reportDiv = document.getElementById("performanceReport");
    if (!reportDiv) return;
    reportDiv.innerHTML = "";
    data.forEach((stat) => {
      const card = `<div class="col-md-4"><div class="card border-left-primary h-100 py-2"><div class="card-body"><div class="text-xs font-weight-bold text-primary text-uppercase mb-1">${stat.seller}</div><div class="h5 mb-0 font-weight-bold text-gray-800">Profit: $${parseFloat(stat.net_profit).toFixed(2)}</div><small class="text-muted">Total Rev: $${parseFloat(stat.total_sales).toFixed(2)}</small></div></div></div>`;
      reportDiv.innerHTML += card;
    });
  } catch (error) {
    console.error("Error fetching report:", error);
  }
}
