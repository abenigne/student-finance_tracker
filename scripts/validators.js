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
   if (!DESC_REGEX.test(desc));
      return { valid: false, message:'Description cannot have leading or trailing whitespace.' };
    }
   if (desc.length > 120) {
    return { valid: false, message: 'Description must not exceed 120 characters'};
    }
    
}