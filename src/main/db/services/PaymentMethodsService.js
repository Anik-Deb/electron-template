import { client } from '../Client'; // Assuming you're using CommonJS in Electron

const PaymentMethodsService = {
  // Retrieve all payment methods with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Payment_Methods 
        ORDER BY id ;
      `;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  },

  // Retrieve a specific payment method by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Payment_Methods 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Payment method not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching payment method:', error);
      throw new Error('Failed to fetch payment method');
    }
  },

  // Add a new payment method
  add: async (paymentMethod) => {
    try {
      if (
        !paymentMethod.invoice_id ||
        !paymentMethod.service_name ||
        !paymentMethod.amount
      ) {
        throw new Error(
          'Missing required fields: invoice_id, service_name, or amount'
        );
      }

      const query = `
        INSERT INTO Payment_Methods (
          partner_id, invoice_id, service_name, amount, payment_type, payment_status, payment_date, description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;

      const params = [
        paymentMethod.partner_id || null,
        paymentMethod.invoice_id,
        paymentMethod.service_name,
        paymentMethod.amount,
        paymentMethod.payment_type || null,
        paymentMethod.payment_status || 'pending',
        paymentMethod.payment_date || new Date(),
        paymentMethod.description || null,
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error('Failed to add payment method');
    }
  },

  // Update an existing payment method
  update: async ({ id, updates }) => {
    try {
      const paymentMethod = await PaymentMethodsService.get(id);
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }

      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      values.push(id);

      const query = `
        UPDATE Payment_Methods 
        SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Payment method not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw new Error('Failed to update payment method');
    }
  },

  // Permanently delete a payment method
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Payment_Methods 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Payment method not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw new Error('Failed to delete payment method');
    }
  },

  // Delete multiple payment methods by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No payment method IDs provided');
      }

      const query = `
        DELETE FROM Payment_Methods 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No payment methods found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple payment methods:', error);
      throw new Error('Failed to delete payment methods');
    }
  },
};

export default PaymentMethodsService;
