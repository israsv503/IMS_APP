/**
 * Security Check: Verifies if a user session exists.
 * Redirects to login page if no authenticated user is found.
 */
function checkAuth() {
  const user = sessionStorage.getItem("loggedUser");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userData = JSON.parse(user);

  // Check if the user has Admin privileges
  const isAdmin = userData.roles.includes("ROLE_ADMIN");
  const adminLink = document.getElementById("adminLink");

  // Logic for the navigation link visibility
  if (adminLink) {
    if (isAdmin) {
      adminLink.style.display = "block"; // Show to Admins
    } else {
      adminLink.style.display = "none"; // Hide from Partners
    }
  }

  // SECURITY GUARDRAIL: Prevent manual URL entry to admin page
  if (window.location.pathname.includes("administration.html") && !isAdmin) {
    console.warn(
      "Security Alert: Unauthorized access attempt to Administration page.",
    );
    window.location.href = "index.html"; // Redirect intruders to Dashboard
  }

  const welcomeEl = document.getElementById("userWelcome");
  if (welcomeEl) {
    welcomeEl.innerText = "Logged in as: " + userData.username;
  }
}

// Run the check before anything else
checkAuth();

/**
 * Page Router:
 * Ensures functions only run if the required HTML elements exist on the current page.
 */
window.onload = () => {
  checkAuth();

  const path = window.location.pathname;
  const page = path.split("/").pop();

  if (page === "index.html" || page === "") {
    fetchStats();
    fetchSales();
    fetchPerformanceReport();
  } else if (page === "inventory.html") {
    fetchInventory();
    loadCategories();
  } else if (page === "administration.html") {
    fetchUsers(); // New logic for the Users page
    fetchManagementCategories();
  } else if (page === "sales.html") {
    fetchFullSalesHistory();
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
                      <button class="btn btn-sm btn-primary" onclick="openSaleModal(${item.id}, '${item.product.name}', ${item.quantity})">Sell</button>
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
    // Show last 5 sales with enhanced details
    sales.reverse().slice(0, 5).forEach((sale) => {
        // Logic to color-code the status
        const statusClass =
          sale.paymentStatus === "PAID" ? "bg-success" : "bg-warning text-dark";

        const row = `
                <tr>
                    <td>
                        <div class="fw-bold">${sale.inventoryItem.product.name}</div>
                        <div class="text-muted small">Qty: ${sale.quantity}</div>
                    </td>
                    <td>
                        <div class="text-success fw-bold">$${(sale.salePrice * sale.quantity).toFixed(2)}</div>
                        <span class="badge ${statusClass} x-small">${sale.paymentStatus}</span>
                    </td>
                    <td>
                        <div class="small">${sale.soldBy}</div>
                        <div class="text-muted" style="font-size: 0.7rem;" title="${sale.notes || ""}">
                            ${sale.notes ? sale.notes.substring(0, 15) + "..." : ""}
                        </div>
                    </td>
                    <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                </tr>
            `;
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

/**
 * Fetches all system users and displays them in the management table.
 * Includes a delete button for administrative control.
 */
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:8080/api/users');
        const users = await response.json();
        const tableBody = document.getElementById('userTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-info text-dark">${user.roles.join(', ')}</span></td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Remove Access</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

/**
 * Administrative action to delete a user account.
 */
async function deleteUser(id) {
    if (!confirm("Are you sure you want to remove this user's access?")) return;
    try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("User removed.");
            fetchUsers(); // Refresh the list
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}


/**
 * Handles the administrative creation of new partner accounts.
 * Includes validation checks and proactive error feedback.
 */
const userRegForm = document.getElementById("userRegistrationForm");
if (userRegForm) {
    userRegForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // 1. Gather data from the form
        const username = document.getElementById("regUsername").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        // 2. Simple Frontend Validation (Guardrail)
        if (password.length < 6) {
            alert("Security Error: Password must be at least 6 characters long.");
            return;
        }

        const userData = { username, email, password };

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                // Success Scenario
                alert(`Success! Partner account for '${username}' has been created.`);
                
                // Professional Touch: Reset the form and reload to show the new user in the table
                userRegForm.reset();
                location.reload(); 
            } else {
                // Error Scenario (usually 400 Bad Request from our Controller)
                const errorMsg = await response.text();
                alert(`Registration Failed: ${errorMsg || "Username or Email is already taken."}`);
            }
        } catch (error) {
            console.error("Critical registration error:", error);
            alert("Network Error: Could not reach the server. Please try again later.");
        }
    });
}


/**
 * Opens the Sales Modal and populates it with item data.
 */
function openSaleModal(id, name, stock) {
    document.getElementById('saleItemId').value = id;
    document.getElementById('saleItemName').innerText = name;
    document.getElementById('maxStock').innerText = stock;
    document.getElementById('saleQty').max = stock; // Browser-side safety check
    
    const modal = new bootstrap.Modal(document.getElementById('saleModal'));
    modal.show();
}

/**
 * Handles the submission of the Sales Form.
 */
document.getElementById('saleForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const sessionUser = JSON.parse(sessionStorage.getItem('loggedUser'));
    
    const saleData = {
        inventoryItem: { id: document.getElementById('saleItemId').value },
        quantity: parseInt(document.getElementById('saleQty').value),
        salePrice: parseFloat(document.getElementById('salePrice').value),
        paymentStatus: document.getElementById('saleStatus').value,
        notes: document.getElementById('saleNotes').value,
        soldBy: sessionUser ? sessionUser.username : "Unknown"
    };

    try {
        const response = await fetch('http://localhost:8080/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            alert("Transaction completed successfully!");
            location.reload();
        } else {
            const error = await response.text();
            alert("Error: " + error);
        }
    } catch (err) {
        console.error("Sale Error:", err);
    }
});


/**
 * Fetches the entire sales history for the Sales Ledger page.
 */
async function fetchFullSalesHistory() {
    try {
        const response = await fetch('http://localhost:8080/api/sales');
        const sales = await response.json();
        const tableBody = document.getElementById('fullSalesTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        sales.reverse().forEach(sale => {
            const isPending = sale.paymentStatus !== 'PAID';
            const statusBadge = isPending ? 'bg-warning text-dark' : 'bg-success';
            
            const row = `
                <tr>
                    <td>${new Date(sale.saleDate).toLocaleDateString()}</td>
                    <td>${sale.inventoryItem.product.name}</td>
                    <td>${sale.quantity}</td>
                    <td class="fw-bold">$${(sale.salePrice * sale.quantity).toFixed(2)}</td>
                    <td>${sale.soldBy}</td>
                    <td><span class="badge ${statusBadge}">${sale.paymentStatus}</span></td>
                    <td class="small text-muted">${sale.notes || '-'}</td>
                    <td>
                        ${isPending ? `<button class="btn btn-sm btn-outline-success" onclick="updateToPaid(${sale.id})">Mark Paid</button>` : '<span class="text-success small">✔ Settled</span>'}
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (err) { console.error("History fetch error:", err); }
}

/**
 * Sends a request to change a sale status to PAID.
 * This will trigger the Dashboard stats to update because they finally pass the .filter()
 */
async function updateToPaid(saleId) {
    if (!confirm("Confirm payment received? This will update business profits.")) return;

    try {
        // We use a PUT or PATCH request here
        const response = await fetch(`http://localhost:8080/api/sales/${saleId}/status?newStatus=PAID`, {
            method: 'PUT'
        });

        if (response.ok) {
            alert("Payment recorded! Dashboard totals have been updated.");
            fetchFullSalesHistory();
        }
    } catch (err) { console.error("Update error:", err); }
}

/**
 * Fetches categories for the Management page
 */
async function fetchManagementCategories() {
    const tableBody = document.getElementById('categoryTableBody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:8080/api/categories');
        const categories = await response.json();
        tableBody.innerHTML = '';
        categories.forEach(cat => {
            tableBody.innerHTML += `
                <tr>
                    <td>${cat.name}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${cat.id})">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

/**
 * Saves a new category to the DB
 */
async function saveCategory() {
    const name = document.getElementById('newCatName').value;
    if (!name) return;

    try {
        const response = await fetch('http://localhost:8080/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            location.reload();
        }
    } catch (err) { console.error(err); }
}

/**
 * Deletes a category after user confirmation.
 * @param {number} id - The unique ID of the category to remove.
 */
async function deleteCategory(id) {
    // Professional safety check: never delete without asking!
    if (!confirm("Are you sure? This will remove the category permanently. If products are linked to it, the system will block the deletion for safety.")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Refresh the table to show it's gone
            fetchManagementCategories(); 
        } else {
            // This catches the 'Foreign Key' error
            const errorMsg = await response.text();
            alert("Could not delete: " + (errorMsg || "This category is likely being used by existing products."));
        }
    } catch (err) {
        console.error("Critical error during category deletion:", err);
        alert("Network Error: Could not reach the server.");
    }
}
