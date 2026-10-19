# Student finance tracker - CampusWallet
# It is a responsive, modular web application designed to help university students monitor their daily expenses, manage monthly budget limits, and test regular expressins.

The key features are:

1. Spending Dashboard: Real time summary cards tracking total amount spent, total records and the remaining budget.
2. Expense Management: Add, validate, and delete financial transactions.
3. Regex search and Filtering: this filters transaction history using powerful regular expressions with a case-insensitive toggle.
4. Multi-criteria sorting: sorts records instantly by date(oldest or newest), cost(high/low), or description(A-Z/Z-A)
5. Settings and Data backup: it configures custom monthly budgets, choose currencies.
6.Local persistence: automatically saves data to browser LocalStorage with an initial fallback to sample seed data
(`seed.json`).

## The architecture of the application.

*HTML 
*CSS
*Javascript:
   *app.js: this is the application entry point.
   *state.js: this is the central state management and reactive subscriptions.
   *storage.js: handles localstorage and data persistence.
   *ui.js: DOM mainpulation, event binding, and rendering ledgers.
   "search.js: safe regex compilation and filters records.
   *validators.js: this enforces strict input validation logic.


   ##How to run locally

   1. Clone or download this repository to your local machine:
   (in your terminal write)
    git clone https://github.com/abenigne/student-finance_tracker.git

  2. Afer cloning, open your project folder in Visual Studio Code. 
  3.Run the project using a liv server extension (such as Live Server in VS Code) or open index.html directly in your browser.
    
    The demonstation video's link is on Youtube; this is the link
    https://youtu.be/I1mzIQMtP5A