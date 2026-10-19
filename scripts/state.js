// This maintains central application state, reactive subscriptions and mutation actions.
 import { StorageManager }  from './storage.js';


 class AppState {
    constructor() {
        this.records = [];
        this.budgetCap = 500;
        this.currency = 'USD';
        this.searchQuery = '';
        this.caseInsensitive = true;
        this.sortBy = 'date-desc';
        this.listeners = [];
    }
    //this initializes state by loading from local storage or falling back to seed.json
     
    async init() {
        let stored = StorageManager.load();
        if (!stored || stored.length === 0) {
          try {
            const response = await fetch('seed.json');
            if (response.ok) {
              stored = await response.json();
              StorageManager.save(stored);
            }
          } catch (err) {
            console.warn('Could not load seed.json automatically:', err);
            stored = [];
          }
        }
        this.records = stored;
        this.notify();
    }
    //This registers a callback listener for reactive updates
    subscribe(listener) {
      if (typeof listener === 'function'){
        this.listeners.push(listener);
      }
    }
    // This notifies all registered UI listeners of state changes

    notify() {
      this.listeners.forEach(listener => listener(this));
    }
     
    setInitialRecords(records) {
      this.records = records;
      this.notify();
    }
    // This for adding a new expense record

    addRecord(data) {
      const newRecord = {
        id: 'rec_' + Date.now(),
        description: data.description.trim(),
        amount: parseFloat(data.amount),
        category: data.category,
        date:data.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.records.unshift(newRecord);
      this.persistAndNotify();
    }
    

    //this is to update an existing expense record by ID

    updateRecord(id, data) {
        this.records = this.records.map(rec => {
            if (rec.id ===id) {
                return {
                    ...rec,
                    description: data.description.trim(),
                    amount: parseFloat(data.amount),
                    category: data.category,
                    date: data.date,
                    updatedAt: new Date().toISOString()
                };
            }
            return rec;
        });
        this.persistAndNotify();
    }
    // Deletes a record by ID

    deleteRecord(id) {
       this.records = this.records.filter(r => r.id !==id);
       this.persistAndNotify();
    }
    // This is used to set the monthly budget spending limit

    setBudgetCap(cap) {
        this.budgetCap = parseFloat(cap) || 0;
        this.notify();
    }
     
    //This sets the display the currency
    setCurrency(curr) {
        this.currency = curr;
        this.notify();
    }

    // Updates search query parameters

    setSearch(query, caseInsensitive) {
      this.searchQuery = query;
      this.caseInsensitive = caseInsensitive;
      this.notify();
    }

    // This sets the sorting criteria
    setSort(sortBy) {
        this.sortBy = sortBy;
        this.notify();
    }
    //This imports a batch of records
     importRecords(newRecords) {
        this.records = newRecords;
        this.persistAndNotify ();
     }
     //This persists changes to storage and notifies UI
     
     persistAndNotify() {
        StorageManager.save(this.records);
        this.notify();
    }
}

export const State = new AppState();




  