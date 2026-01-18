/**
 * Handles the login form submission.
 * Validates credentials against the API and manages session storage.
 */
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const user = await response.json();

      // Professional practice: Save user info to session storage
      // This allows the browser to remember who is logged in
      sessionStorage.setItem("loggedUser", JSON.stringify(user));

      // Redirect to the dashboard
      window.location.href = "index.html";
    } else {
      // Show the error message to the user
      document.getElementById("loginError").classList.remove("d-none");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Could not connect to the authentication server.");
  }
});
