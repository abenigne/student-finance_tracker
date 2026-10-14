# Student Finance Tracker (CampusWallet)
**Author:** Benigne Ingabire Akayesu  
**Course:** Building Responsive UI (ALU - September 2026 Term)  
**Theme:** Student Finance Tracker  
**Live Deployment:** [CampusWallet GitHub Pages](https://abenigne.github.io/student-finance-tracker/)

---

## M1: Specification, Wireframes & Architecture

### 1. Visual Layout & Component Wireframes
The application is structured around four primary interactive views designed for seamless responsive scaling:
* **Spending Pulse Dashboard:** Aggregates total expenditure, record counts, dominant spending category, and an interactive 7-day spending trend chart.
* **Transaction Ledger:** A robust table that auto-transforms into stacked interactive cards on mobile viewports (<768px). Features real-time regex search with match highlighting and multi-criteria sorting.
* **Expense Entry Form:** A clean input interface for logging or editing student expenses with instant inline regex validation feedback.
* **Settings & Budget Hub:** Manages monthly budget targets with dynamic ARIA live region announcements, multi-currency conversion rates (USD, EUR, RWF), and JSON backup import/export round-trips.

### 2. Data Model Schema
Each transaction record is stored with a unique identifier and ISO timestamps:
```json
{
  "id": "rec_1728730000000",
  "description": "Organic chemistry lab manual",
  "amount": 89.99,
  "category": "Books",
  "date": "2026-10-14",
  "createdAt": "2026-10-14T08:00:00.000Z",
  "updatedAt": "2026-10-14T08:00:00.000Z"
}