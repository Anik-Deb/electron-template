import { client } from '../Client'; // Assuming you're using CommonJS in Electron

const PartnerPaymentsService = {
  // Retrieve all partner payments with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Partner_Payments 
        ORDER BY id;
      `;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error('Error fetching partner payments:', error);
      throw new Error('Failed to fetch partner payments');
    }
  },

  // Retrieve a specific partner payment by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Partner_Payments 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Partner payment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching partner payment:', error);
      throw new Error('Failed to fetch partner payment');
    }
  },

  // Add a new partner payment
  add: async (partnerPayment) => {
    try {
      // Validate required fields
      if (
        !partnerPayment.service_provider_id ||
        !partnerPayment.payment_method_id ||
        !partnerPayment.payment_date ||
        !partnerPayment.payment_amount
      ) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Partner_Payments (
          service_provider_id, payment_method_id, payment_date, payment_amount
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;

      const params = [
        partnerPayment.service_provider_id,
        partnerPayment.payment_method_id,
        partnerPayment.payment_date,
        partnerPayment.payment_amount,
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding partner payment:', error);
      throw new Error('Failed to add partner payment');
    }
  },

  // Update an existing partner payment
  update: async ({ id, updates }) => {
    try {
      // Check if the partner payment exists
      const partnerPayment = await PartnerPaymentsService.get(id);
      if (!partnerPayment) {
        throw new Error('Partner payment not found');
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
        UPDATE Partner_Payments 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error( 'Partner payment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating partner payment:', error);
      throw new Error('Failed to update partner payment' );
    }
  },

  // Permanently delete a partner payment
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Partner_Payments 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Partner payment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting partner payment:', error);
      throw new Error('Failed to delete partner payment');
    }
  },

  // Delete multiple partner payments by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No partner payment IDs provided' );
      }

      const query = `
        DELETE FROM Partner_Payments 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error( 'No partner payments found for deletion' );
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple partner payments:', error);
      throw new Error('Failed to delete partner payments' );
    }
  },
};

export default PartnerPaymentsService; // Export for use in Electron's main or renderer process
