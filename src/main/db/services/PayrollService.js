import { client } from '../Client';

const PayrollService = {
  // Retrieve all payroll records
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Payroll;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      throw new Error('Failed to fetch payroll records');
    }
  },

  // Retrieve a specific payroll record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Payroll 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Payroll record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching payroll record:', error);
      throw new Error('Failed to fetch payroll record');
    }
  },

  // Add a new payroll record
  add: async (payroll) => {
    try {
      // Validate required fields
      if (!payroll.employee_id || !payroll.pay_period_start || !payroll.pay_period_end 
          || !payroll.gross_salary || !payroll.deductions || !payroll.payment_date) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Payroll (
          employee_id, pay_period_start, pay_period_end, gross_salary, deductions, payment_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        payroll.employee_id,
        payroll.pay_period_start,
        payroll.pay_period_end,
        payroll.gross_salary,
        payroll.deductions,
        payroll.payment_date,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating payroll record:', error);
      throw new Error('Failed to create payroll record');
    }
  },

  // Update a specific payroll record by ID
  update: async (id, updates) => {
    try {
      // Check if the payroll record exists
      const payroll = await PayrollService.get(id);
      if (!payroll) {
        throw new Error('Payroll record not found');
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

      // Add the id as the last value for the WHERE clause
      values.push(id);

      const query = `
        UPDATE Payroll 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Payroll record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating payroll record:', error);
      throw new Error('Failed to update payroll record');
    }
  },

  // Delete a specific payroll record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Payroll 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Payroll record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting payroll record:', error);
      throw new Error('Failed to delete payroll record');
    }
  },

  // Delete all payroll records
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Payroll;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all payroll records:', error);
      throw new Error('Failed to delete all payroll records');
    }
  },
};

export default PayrollService;