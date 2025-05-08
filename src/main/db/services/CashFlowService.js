import { client } from '../Client';

const CashFlowService = {
  // Retrieve all cash flow entries
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Cash_Flow 
        ORDER BY date DESC;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching cash flow entries:', error);
      throw new Error('Failed to fetch cash flow entries');
    }
  },

  // Retrieve cash flow entry for a specific date
  get: async (date) => { 
    try {
      const query = `
        SELECT * 
        FROM Cash_Flow 
        WHERE date = $1;
      `;

      const result = await client.query(query, [date]);

      if (result.rows.length === 0) {
        throw new Error('Cash flow entry for the given date not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching cash flow entry:', error);
      throw new Error('Failed to fetch cash flow entry');
    }
  },

  // Add a new cash flow entry
  add: async (cashFlow) => {
    try {
      // Validate required fields
      if (!cashFlow.date || !cashFlow.opening_balance || !cashFlow.total_income 
          || !cashFlow.total_expenses || !cashFlow.closing_balance) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Cash_Flow (
          date, opening_balance, total_income, total_expenses, closing_balance
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `;

      const values = [
        cashFlow.date,
        cashFlow.opening_balance,
        cashFlow.total_income,
        cashFlow.total_expenses,
        cashFlow.closing_balance,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating cash flow entry:', error);
      throw new Error('Failed to create cash flow entry');
    }
  },

  // Update cash flow entry for a specific date
  update: async (date, updates) => {
    try {
      // Check if the cash flow entry exists
      const cashFlow = await CashFlowService.get(date); 
      if (!cashFlow) {
        throw new Error('Cash flow entry for the given date not found');
      }

      // Build the dynamic query for fields to update
      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      // Add the date as the last value for the WHERE clause
      values.push(date);

      const query = `
        UPDATE Cash_Flow 
        SET ${setClause.join(', ')} 
        WHERE date = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Cash flow entry for the given date not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating cash flow entry:', error);
      throw new Error('Failed to update cash flow entry');
    }
  },

  // Delete cash flow entry for a specific date
  delete: async (date) => {
    try {
      const query = `
        DELETE FROM Cash_Flow 
        WHERE date = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [date]);

      if (result.rows.length === 0) {
        throw new Error('Cash flow entry for the given date not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting cash flow entry:', error);
      throw new Error('Failed to delete cash flow entry');
    }
  },

  // Delete all cash flow entries
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Cash_Flow;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all cash flow entries:', error);
      throw new Error('Failed to delete all cash flow entries');
    }
  },
};

export default CashFlowService;