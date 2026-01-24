# IMS - Reselling Business Management System

[![Project Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-green.svg)](https://github.com/your-username/ims-project)

A professional-grade **Inventory Management System (IMS)** designed for a reselling partnership. This application manages high-value stock, tracks individual partner sales performance, and implements secure, role-based access control.

---

## 🚀 The Mission

This project was born from a real-world need: managing a growing reselling business with three partners. It has evolved from a simple inventory list into a **Multi-Page Web Application** focused on data integrity, security, and administrative oversight.

## 🛠 Tech Stack

* **Backend:** Java 17, Spring Boot, Spring Security (BCrypt Hashing)
* **Database:** PostgreSQL
* **Frontend:** Vanilla JavaScript, HTML5, Bootstrap 5 (Responsive UI)
* **Architecture:** Multi-Page Application (MPA) with RESTful API endpoints

---

## 💎 Key Features & Engineering Highlights

### 1. Security & Authentication

* **Password Hashing:** Implemented **BCrypt** to ensure user credentials are never stored in plain text.
* **Session Management:** Secure login/logout flow using browser `sessionStorage`.
* **RBAC (Role-Based Access Control):** * **Admin:** Full access to Inventory, Sales Reports, and a dedicated **User Management** module.
  * **Partner:** Access limited to inventory management and personal sales tracking.

### 2. Business Intelligence (Reporting)

* **Performance Reports:** Uses complex SQL Joins to aggregate data, showing real-time profit and revenue contribution for each specific partner.
* **Dynamic Dashboard:** High-level summary cards showing total inventory value and net profit.

### 3. Inventory & Operations

* **Proactive Low Stock Alerts:** Automated UI indicators (red badges) when stock falls below 3 units.
* **Real-time Search:** Optimized search bar to filter hundreds of SKUs by brand or model instantly.
* **Audit Trail:** Automatically attributes every sale to the logged-in user who processed it.

---

## 🛣 Project Roadmap (SDLC in Progress)

As an engineering student, I am managing this project through the full **Software Development Life Cycle**.
* [x] **Phase 1:** Core CRUD for Inventory (Completed)
* [x] **Phase 2:** User Authentication & Security (Completed)
* [x] **Phase 3:** Administrative Modules & Multi-Page Refactor (Current)
* [ ] **Phase 4:** Cloud Migration to **AWS (Elastic Beanstalk & RDS)**
* [ ] **Phase 5:** Financial Analytics (Graphs & Charts via Chart.js)

---

## ⚙️ How to Run

1. **Prerequisites:** Java 17, PostgreSQL, Maven.
2. **Database:** Create a database named `ims_db`.
3. **Configuration:**
   * Create `src/main/resources/application.properties`.
   * Configure `spring.datasource.url`, `username`, and `password`.
   * Add `app.default.admin.password` and `app.default.partner.password` as environment variables.
4. **Run:** `mvn spring-boot:run`

---

## 👨‍💻 Developer Note

This project demonstrates my ability to handle **Technical Debt** (evidenced by the refactor from SPA to MPA for scalability) and my commitment to **Clean Code** through Javadoc documentation and modular JavaScript.
