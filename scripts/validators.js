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
const stringVal = String(amountStr).trim();
if (!AMOUNT_REGEX.test(stringVal)) {
    return { valid: false, message: 'Invalid format. Enter a positive number with max 2 decimal places.'};
}
const num = parseFloat(stringVal);
if (isNaN(num) || num<=0) {
    return { valid: false, message: 'Cost must be strictly greater than 0.'};
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
  if (!DATE_REGEX.test(dateStr)) {
    return { valid: false, message: 'Invalid date format. Use YYYY-MM-DD.'};
  }

  // This verifies the real calendar date
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month -1, day);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month -1 ||
    dateObj.getDate() !==day
  ) {
    return { valid: false, message: 'Provided date does not exist in the calendar.'};
    }
    return { valid: true, message:''};
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
