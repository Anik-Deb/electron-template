import { client } from '../Client';

const InvoiceService = {
  // Retrieve all invoices
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Invoices;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.log('Error fetching invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  },

  // Retrieve a specific invoice by ID\
  get: async (id) => {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const column = id.booking_id ? 'booking_id' : 'id';
      const value = id.booking_id || id;

      // Fetch the invoice
      const invoiceQuery = `SELECT * FROM Invoices WHERE ${column} = $1;`;
      const invoiceResult = await client.query(invoiceQuery, [value]);

      if (invoiceResult.rows.length === 0) {
        throw new Error('Invoice not found');
      }

      const invoice = invoiceResult.rows[0];

      // Fetch related invoice items
      const invoiceItemsQuery = `
          SELECT * FROM Invoice_Items 
          WHERE invoice_id = $1;
        `;
      const invoiceItemsResult = await client.query(invoiceItemsQuery, [
        invoice.id,
      ]);

      // Attach the invoice items to the invoice object
      invoice.invoiceItems = invoiceItemsResult.rows;

      return invoice;
    } catch (error) {
      console.log('Error fetching invoice:', error.message);
      throw error;
    }
  },

  // Version:2
  // get: async (id) => {
  //   try {
  //     if (!id) {
  //       throw new Error('ID is required');
  //     }

  //     const column = id.booking_id ? 'booking_id' : 'id';
  //     const value = id.booking_id || id;

  //     const query = `SELECT * FROM Invoices WHERE ${column} = $1;`;
  //     const result = await client.query(query, [value]);

  //     if (result.rows.length === 0) {
  //       throw new Error('Invoice not found');
  //     }

  //     return result.rows[0];
  //   } catch (error) {
  //     console.log('Error fetching invoice:', error.message);
  //     throw error;
  //   }
  // },

  // Add a new invoice
  add: async (invoice) => {
    try {
      console.log('invoice:', invoice);
      // Validate required fields
      if (!invoice.booking_id || !invoice.total_amount) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Invoices (
          booking_id, total_amount, discount, net_amount, amount_paid, balance_due, 
          status
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *;
      `;

      const values = [
        invoice.booking_id,
        invoice.total_amount,
        invoice.discount || 0.0, // Use default discount if not provided
        invoice.net_amount || 0.0,
        invoice.amount_paid || 0.0, // Use default amount_paid if not provided
        invoice.balance_due,
        invoice.status || 'pending', // Use default status if not provided
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.log('Error creating invoice:', error);
      throw error;
    }
  },

  // Update a specific invoice by ID
  update: async ({ id, updates }) => {
    console.log('updates:', updates);
    try {
      // Check if the invoice exists
      const invoice = await InvoiceService.get(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // If total_amount is provided in updates, add it to the existing total_amount
      if (updates?.total_amount !== undefined) {
        updates.total_amount =
          parseFloat(invoice?.total_amount) + parseFloat(updates?.total_amount);

        // Ensure total_amount does not go below 0 (optional)
        if (updates?.total_amount < 0) {
          throw new Error('Total amount cannot be negative');
        }
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
        UPDATE Invoices 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Invoice not found');
      }

      return result.rows[0];
    } catch (error) {
      console.log('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete a specific invoice by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Invoices 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Invoice not found');
      }

      return result.rows[0];
    } catch (error) {
      console.log('Error deleting invoice:', error);
      throw error;
    }
  },

  // Delete all invoices
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Invoices;
      `;

      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.log('Error deleting all invoices:', error);
      throw error;
    }
  },
};

export default InvoiceService;
