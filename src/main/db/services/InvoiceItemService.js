import { client } from '../Client';

const InvoiceItemService = {
  // Retrieve all invoice items
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Invoice_Items;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log('Error fetching invoice items:', error);
      throw error;
    }
  },

  // Retrieve a specific invoice item by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Invoice_Items 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Invoice item not found');
      }

      return result.rows[0];
    } catch (error) {
      console.log('Error fetching invoice item:', error);
      throw error;
    }
  },

  // Add a new invoice item
  add: async (invoiceItem) => {
    try {
      // Validate required fields
      if (
        !invoiceItem.invoice_id ||
        !invoiceItem.service_type ||
        !invoiceItem.service_id ||
        !invoiceItem.quantity ||
        !invoiceItem.unit_price ||
        !invoiceItem.total_price
      ) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Invoice_Items (
          invoice_id, service_type, service_id, quantity, unit_price, total_price
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        invoiceItem.invoice_id,
        invoiceItem.service_type,
        invoiceItem.service_id,
        invoiceItem.quantity,
        invoiceItem.unit_price,
        invoiceItem.total_price,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.log('Error creating invoice item:', error);
      throw error;
    }
  },

  // Update a specific invoice item by ID
  update: async (id, updates) => {
    try {
      // Check if the invoice item exists
      const invoiceItem = await InvoiceItemService.get(id);
      if (!invoiceItem) {
        throw new Error('Invoice item not found');
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
        UPDATE Invoice_Items 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Invoice item not found');
      }

      return result.rows[0];
    } catch (error) {
      console.log('Error updating invoice item:', error);
      throw error;
    }
  },

  // Delete a specific invoice item by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Invoice_Items 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Invoice item not found');
      }

      return result.rows[0];
    } catch (error) {
      console.log('Error deleting invoice item:', error);
      throw error;
    }
  },

  // Delete all invoice items
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Invoice_Items;
      `;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.log('Error deleting all invoice items:', error);
      throw error;
    }
  },
};

export default InvoiceItemService;
