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

    this.totalspentEl= document.getElementById('total-spent');
    this.budgetcapEl = document.getElementById('budget-cap');
    this.budgetProgressEl = document.getElementById('budget-progress');
  },

  //This binds user interaction event listeners.

  bindEvents() {
    //Form Submission
    if (this.form) {
      this.form.addEventListener('input', e => {
        State.setSearch(e.target.value, true);
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

  //Display inline errors if validation fails
  this.showErrors(validation.errors);

  if(validation.isValid) {
    State.addRecord(formData);
    this.form.reset();
    this.clearErrors();
  }
},

//This displays the validation error messages under respective inputs.

showErrors(errors) {
  if(this.descError) this.descError.textContent = errors.description || '';
  if(this.amountError) this.amountError.textContent = errors.amount || '';
  if(this.dateError) this.dateError.textContent = errors.date || '';
  if(this.categoryError) this.category.textContent = errors.category || ''; 
},

//This clears all validation error messages.

clearErrors() {
  this.showErrors({description: '', amount: '', date: '', category: ''});
},

// This masters function called reactively whenever State changes.

render(state) {
  // This filters records using SearchModule and state criteria
  const filteredRecords = SearchModule.filteredRecords(state.records, {
   query: state.searchQuery,
   caseInsensitive: state.caseInsensitive,
   category: state.categoryFilter
  });
  
  //2. Render statistics and summary cards
  this.rendersummary(state.records);

  //3. This renders transaction table
  this.renderTable(filteredRecords, state.searchQuery);
},

//this updates financial summary metrics and progress indicators.

renderSummmary(records) {
  const totalSpent = records.reduce((sum, rec) => sum + Number(rec.amount), 0);

  if(this.totalSpentEl) {
    this.totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
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
        <td>${highlightedDesc}</td>
        <td>$${Number(rec.amount).toFixed(2)}</td>
        <td><span class="badge category-${rec.category.toLowerCase()}">${highlightedCategory}</span>
        <td>${rec.date}</td>
        <td>
          <button class="btn-icon delete-btn" data-id="${rec.id}" aria-label="Delete transaction">🗑️</button>
        </td>
        </tr>
    `;
   }).join('');
  }
};







  
