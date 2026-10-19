//some regex patterns
const DESC_REGEX =/^\S(?:.*\S)?$/;  //This forbids leading or trailing whitespace on non-empty strings
const AMOUNT_REGEX = /^(0|[1-9]\d*)(\.\d{1,2})?$/;  // This allows positive number with up to 2 decimal places
const DATE_REGEX = /^\d{4}-(0[1-9] |1[0-2])-(0[1-9]|[12]\d|3[01])$/; //This is the YYYY-MM-DD format
const ALLOWED_CATEGORIES = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];

export const Validators = {
    /**
     * this validates the transaction description text.
    */
 validateDescription(desc) {
   if (!desc || typeof desc !== 'string') {
     return { valid: false, message: 'Description is required.'};
   }
   const trimmed = desc.trim();
   if (trimmed.length=== 0) {
     return {valid: false, message: 'Description cannot be empty or whitespace only.' };
   }
   if (!DESC_REGEX.test(desc)) {
      return { valid: false, message:'Description cannot have leading or trailing whitespace.' };
    }
   if (desc.length > 120) {
     return {valid: false, message: 'Description must not exceed 120 characters.'};
    }
    return { valid: true, message: ''};
},

/**
 * This validates financial cost amounts using strict decimal regex.
 */
validateAmount(amountStr) {
  if (amountStr === '' || amountStr === null || amountStr === undefined) {
    return { valid: false, message: 'Cost amount is required.'};
}
const val = String(amountStr).trim();
const num = parseFloat(val);
if (isNaN(num) || num<=0) {
    return { valid: false, message: 'Amount must be greater than 0.'};
}
if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(val)) {
  return { valid: false, message: 'Enter a valid cost with up to 2 decimal places.'};
}
if (num > 1000000) {
    return { valid: false, message: 'Cost exceeds maximum allowable threshold.' };
}
return { valid: true, message: '' };
},

/**
 * Validates ISO date string format and calendar validity.
 */
validateDate(dateStr) {
  if (!dateStr || typeof dateStr!== 'string') {
    return { valid: false, message: 'Date is required.' };
  }
  if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(dateStr)) {
    return { valid: false, message: 'Invalid date format. Use YYYY-MM-DD.'};
  }

  // This verifies the real calendar date
  const inputDate = new Date(dateStr);
  const today = new Date();
  if (inputDate > today) {
     return { valid: false, message: 'Future dates (e.g 2038) are not allowed.'};
  }
    return { valid: true, message:''};
},
validateCategory(category) {
   if (!category || ! ALLOWED_CATEGORIES.includes(category)) {
      return { valid: false, message: 'Please select a valid category.'};
   }
   return { valid: true, message: ''};
   },


/**
 * This will run all validation checks simultaneously and returns collective status.
 */
validateAll(formData) {
    const descRes = this.validateDescription(formData.description);
    const amountRes = this.validateAmount(formData.amount);
    const dateRes = this.validateDate(formData.date);
    const categoryRes = this. validateCategory(formData.category);

    const isValid = descRes.valid && amountRes.valid && dateRes.valid && categoryRes.valid;

    return {
        isValid,
        errors: {
            description: descRes.message,
            amount: amountRes.message,
            date: dateRes.message,
            category: categoryRes.message
        }
    };
  }
};
