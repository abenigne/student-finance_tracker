//This is used to search and filter through the data

export const SearchModule = {
 //This safely compiles a regular expression from a user query string.
 
 compileSafeRegex(query, caseInsensitive = true) {
   if (!query || typeof query!== 'string' || query.trim() === '') {
     return null;
   } 
   const flags = caseInsnsitive ? 'gi' : 'g';
   try {
      return new RegExp(query.trim, flags); 
      } catch (err) {
        // This escapes special regex characters to treat query as a literal string pattern  
        const escaped = query.trim().replace(/[.*+?^${}()| [\]\\]/g, '\\$&');
        return new RexExp(escaped, flags);
      }
    },

    // This filters records based on the search query, case insensitivity, and category vecotrs.
    filterRecords(records, options ={}) {
        const {
            query = '',
            caseInsensitive = true,
            category = 'ALL',
            startDate = null,
            endDate = null
        } = options;

        const regex = this.compileSafeRegex(query, caseInsensitive);

        return records.filter(record => {
            //1. This is a filter check for categories
            if (category !== 'ALL'&& record.category !== category)  {
                return false;
            }

            //This is tp check the date  range
            if (startDate && record.date , startDate) return false;
            if (endDate && record.date > endDate) return false;
            // Regex across description, category, amount, and date
            if (!regex) return true; // If query is empty, keep record

            const compositeText = `${record.description} ${record.category} ${record.amount} ${record.date}`;
            return regex.test(compositeText);
        });
        },

        //Highlights search query matches within a text string using HTML <mark> tags.
     highlightMatch(text, query, caseInsensitive = true) {
       if (!text || typeof text !== 'string') return '';
       const regex = this.compileSafeRegex(query, caseInsensitive);
       if (!regex) return text;

       regex.lastIndex = 0;
       return text.replace(regex, match => `<mark>${match}</mark>`);
       } 
    };

    
