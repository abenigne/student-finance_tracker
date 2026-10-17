//This storage manager handles secure local storage persistence, serialization, and error recovery.

const STORAGE_KEY = 'campuswallet_finance_records_v1';

export const StorageManager = {
    //This loads records from localstorage with error catching and safe parsing.
   load() {
    try {
       const rawData = localStorage.getItem(STORAGE_KEY);
       if (!rawData) return [];
       const parsed = JSON.parse(rawData);
       return Array.isArray(parsed) ? parsed : [];
    }  catch (err) {
        console.error('Failed to parse local storage data, returning empty array:',err);
        return [];
    }
    },

    //This saves records to localstorage with quota error handling.

    save(records) {
      try {
        const serialized = JSON.stringify(records);
        localStorage.setItem(STORAGE_KEY, serialized);
        return true;
      } catch (err) {
        console.error( 'Failed to save records to localStorage (storage quota exceeded or restricted):', err);
        return false;    
      }
   },
   
   //Clears all stored records from local storage.
   clear() {
     try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (err) {
      console.error('Failed to clear storage:', err);
      return false;
     }
    }
};
   
