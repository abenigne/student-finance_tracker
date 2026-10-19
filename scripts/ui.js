//This is to handle DOM manipulation, rendering transaction ledgers, statistics updates, form error feedback, and interactive event listeners.

import { State } from './state.js';
import { SearchModule } from './search.js';
import { Validators } from './validators.js';

export const UIModule = {
  //This initializes the UI module, caching DOM nodes and registering event listeners.
   
  init() {
    this.cacheDOM();
    this.bindEvents();

    //Subscribe UI to State changes so re-renders happen reactively
    State.subscribe(state => this.render(state));
    this.render(State);
  },

  //This caches the key Dom elements for performance.
  cacheDOM( ) {
    this.form = document.getElementById('transaction-form');
    this.descInput = document.getElementById('description');
    this.amountInput = document.getElementById('amount');
    this.dateInput = document.getElementById('date');
    this.categorySelect = document.getElementById('category');

    this.descError = document.getElementById('description-error');
    this.amountError = document.getElementById('amount-error');
    this.dateError = document.getElementById('date-error');
    this.categoryError = document.getElementById('category-error') ;

    this.tableBody = document.getElementById('transactions-table-body');
    this.searchInput = document.getElementById('search-input');
    this.categoryFilter = document.getElementById('category-filter');
    this.caseToggle = document.getElementById('search-case-toggle');
    this.sortSelect = document.getElementById('sort-select');

    this.totalspentEl= document.getElementById('total-spent');
    this.budgetcapInput = document.getElementById('budget-cap-input');
    this.currencySelect = document.getElementById('currency-select');
    this.exportBtn = document.getElementById('btn-export-json');
    this.importFile = document.getElementById('file-import-json');

    this.navToggle = document.getElementById('nav-toggle');
    this.primaryNav = document.getElementById('primary-nav');
  },

  //This binds user interaction event listeners.

  bindEvents() {
    //Form Submission
    if (this.form) {
      this.form.addEventListener('submit', e => {
        e.preventDefault();
        this.handleformsubmit();
      });
    }
    //this validates the numbers as the user types.
    if (this.amountInput) {
      this.amountInput.addEventListener('input', () => {
        const res = Validators.validateAmount(this.amountInput.value);
        if (this.amountError) {
           this.amountError.textContent = res.message;
        }
      });
    }

    //This delegates delete and edit actions on Transaction Table
     if (this.tableBody) {
        this.tableBody.addEventListener('click', e => {
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
              const id = deleteBtn.dataset.id;
              if (confirm('Are you sure you want to delete this transaction?')) {
                State.deleteRecord(id);
              }
            }
        });
    }

    if (this.navToggle && this.primaryNav) {
      this.navToggle.addEventListener('click', () => {
        const isOpen = this.primaryNav.classList.toggle('open');
        this.navToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    //this is  live validation for description
    if (this.descInput) {
       this.descInput.addEventListener('input', () => {
         const res = Validators.validateDescription(this.descInput.value);
         if (this.descError) this.descError.textContent = res.message;
        });
      }
    //live validation for amount
    if (this.amountInput) {
       this.amountInput.addEventListener('input', () => {
        const res = Validators.validateAmount(this.amountInput.value);
        if (this.amountError) this.amountError.textContent = res.message;
       });
    }
    //live validation for date
    if (this.dateInput) {
       this.dateInput.addEventListener('change', () => {
         const res = Validators.validateDate(this.dateInput.value);
         if (this.dateError) this.dateError.textContent = res.message;
        });
    }
    //this is for search input & case toggle
    if (this.searchInput) {
       this.searchInput.addEventListener('input', () => {
         const ignoreCase = this.caseToggle ? this.caseToggle.checked : true;
         State.setSearch(this.searchInput.value, ignoreCase);
     });
    }
    if(this.caseToggle) {
      this.caseToggle.addEventListener('change', () => {
        const query = this.searchInput ? this.searchInput.value : '';
        State.setSearch(query, this.caseToggle.checked);
      });
    }
    //Sort select
    if (this.sortSelect){
       this.sortSelect.addEventListener('change', () => {
        State.setSort(this.sortSelect.value);
       });
    }
    //Budget Cap Input
    if (this.budgetCapInput) {
       this.budgetCapInput.addEventListener('input', () => {
         State.setBudgetCap(this.budgetCapInput.value);
       });
    }
    //currency select
    if (this.currencySelect) {
      this.currencySelect.addEventListener('change', () => {
        State.setCurrency(this.currencySelect.value);
      });
    }
    // Export JSON backup
    if (this.exportBtn) {
       this.exportBtn.addEventListener('click', () => {
        this.handleExport();
      });
    }
    //Importing JSON backup
    if (this.importFile) {
      this.importFile.addEventListener('change', e => {
        this.handleImport(e);
      });
    }
  },
//This validates and processes transaction form submission.

handleformsubmit() {
  const formData = {
    description: this.descInput.value,
    amount: this.amountInput.value,
    date: this.dateInput.value,
    category: this.categorySelect.value
  };

  const validation = Validators.validateAll(formData);

  //This renders error messages under input fields
  if(this.descError) this.descError.textContent = validation.errors.description;
  if(this.amountError) this.amountError.textContent = validation.errors.amount;
  if(this.dateError) this.dateError.textContent = validation.errors.date;
  if(this.categoryError) this.categoryError.textContent = validation.errors.category; 

  //this blocks submission if invalid
  if(!validation.isValid) {
    return;  //this stops execution so invalid data is not saved
  }

  State.addRecord(formData);
  this.form.reset();
  this.clearErrors();
},

//This clears all validation error messages.

clearErrors() {
if (this.descError) this.descError.textContent = '';
if(this.amountError) this.amountError.textContent = '';
if(this.dateError) this.dateError.textContent = '';
if(this.categoryError) this.categoryError.textContent = '';
},

handleExport() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(State.records, null, 2));
  const  dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "campuswallet_backup.json")
   document.body.appendChild(dlAnchorElem);
   dlAnchorElem.click();
   dlAnchorElem.remove();
},

handleImport(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (Array.isArray(imported)) {
        State.importRecords(imported);
        alert('Backup imported successfully!');
      } else {
        alert('Invalid backup file format.');
      }
    } catch (err) {
      alert('Error parsing JSON file.');
    }
  };
  reader.readAsText(file);
},

// This masters function called reactively whenever State changes.

render(state) {
  // This filters records using SearchModule and state criteria
  let filteredRecords = SearchModule.filterRecords(state.records, {
   query: state.searchQuery,
   caseInsensitive: state.caseInsensitive,
   category: 'ALL'
  });

  //this applies sorting based on user selection.
  filteredRecords.sort((a, b) => {
     if (state.sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
     if (state.sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
     if (state.sortBy === 'amount-desc') return b.amount -a.amount;
     if (state.sortBy === 'amount-asc') return a.amount-b.amount;
     if (state.sortBy === 'desc-asc') return a.description.localeCompare(b.description);
     if (state.sortBy ==='desc-desc') return b.description.localeCompare(a.description);
     return 0;
    
   });
 
   //2. Render statistics and summary cards
  this.renderSummary(state.records);

  //3. This renders transaction table
  this.renderTable(filteredRecords, state.searchQuery);
},

//this updates financial summary metrics and progress indicators.

renderSummary(records) {
  const totalSpent = records.reduce((sum, rec) => sum + Number(rec.amount), 0);
  const totalRecords = records.length;
  const budgetCap = State.budgetCap || 500;
  const remaining = budgetCap - totalSpent;

  if(this.totalSpentEl) {
    this.totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
  }
  
  const statCountEl = document.getElementById('stat-count');
  if (statCountEl) {
    statCountEl.textContent = totalRecords;
  }

  const budgetStatusEl = document.getElementById('start-cap-status');
  if (budgetStatusEl) {
     budgetStatusEl.textContent = `$${Math.abs(remaining).toFixed(2)} ${remaining >=0 ? 'Left' : 'Over '
     }`;
  }
},

//This renders the transaction items into the HTML table body with search highlighting.

renderTable(records, searchQuery) {
  if (!this.tableBody) return ;

  if(records.length ===0) {
    this.tableBody.innerHTML =`
       <tr>
         <td colspan="5" class="empty-state">No financial transactions found.</td>
       </tr>
    `;
    return;
  }

  this.tableBody.innerHTML = records.map(rec => {
    const highlightedDesc = SearchModule.highlightMatch(rec.description, searchQuery);
    const highlightedCategory = SearchModule.highlightMatch(rec.category, searchQuery);

    return `
      <tr>
        <td>${rec.date}</td>
        <td>${highlightedDesc}</td>
        <td><span class="badge category-${rec.category.toLowerCase()}">${highlightedCategory}</span>
        <td>$${Number(rec.amount).toFixed(2)}</td>
        <td>
          <button class="btn-icon delete-btn" data-id="${rec.id}" aria-label="Delete transaction">🗑️</button>
        </td>
        </tr>
    `;
   }).join('');
  }
};







  
   