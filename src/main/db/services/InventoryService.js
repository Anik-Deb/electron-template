import { client } from '../Client';

const InventoryService = {
  getAll: async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await client.query('SELECT * FROM Inventory');
      return result.rows;
    } catch (error) {
      // console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      if (!id) {
        throw new Error('Invalid ID provided');
      }

      const result = await client.query(
        'SELECT * FROM Inventory WHERE id = $1',
        [id]
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw error;
    }
  },

  add: async (item) => {
    try {
      const result = await client.query(
        'INSERT INTO Inventory (name, type, quantity) VALUES ($1, $2, $3) RETURNING *',
        [item.name, item.type, item.quantity]
      );
      // console.log('Inventory Item Created:', result.rows[0]);
      return result.rows[0]; // Return the added item data (serializable)
    } catch (error) {
      console.log('Error adding Inventory item:', error);
      throw error;
    }
  },

  update: async (item) => {
    const { id, quantity, ...updates } = item; // Extract id, quantity, and other fields
    if (!id) {
      throw new Error('ID is required for updating an Inventory item');
    }

    try {
      // Step 1: Fetch the current quantity
      const fetchQuery = `
            SELECT quantity 
            FROM Inventory 
            WHERE id = $1
        `;
      const fetchResult = await client.query(fetchQuery, [id]);

      if (fetchResult.rows.length === 0) {
        throw new Error('Inventory item not found');
      }

      const currentQuantity = fetchResult.rows[0].quantity;
      let newQuantity;
      // Step 2: Calculate the new quantity
      if (!quantity) {
        newQuantity = currentQuantity - 1; // Default to 0 if quantity is not provided
      } else {
        newQuantity = quantity; // Default to 0 if quantity is not provided
      }

      if (newQuantity < 0) {
        throw new Error('Quantity cannot be negative');
      }

      // Step 3: Add the new quantity to updates
      updates.quantity = newQuantity;

      // Step 4: Dynamically construct the SET clause and values
      const setClauses = [];
      const values = [];
      let index = 1; // PostgreSQL parameterized query index starts at 1

      for (const [key, value] of Object.entries(updates)) {
        setClauses.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      if (setClauses.length === 0) {
        throw new Error('No fields provided to update');
      }

      // Add the ID as the last parameter
      values.push(id);

      // Construct the update query
      const updateQuery = `
            UPDATE Inventory 
            SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $${index} 
            RETURNING *
        `;

      const result = await client.query(updateQuery, values);

      if (result.rows.length > 0) {
        // console.log('Inventory Item Updated:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Inventory Item not found');
        return null;
      }
    } catch (error) {
      console.log('Error updating Inventory item:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const result = await client.query(
        'DELETE FROM Inventory WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length > 0) {
        return `Deleted Item id ${result.rows[0].id}`;
        // console.log('Inventory Item Deleted:', result.rows[0]);
      } else {
        throw new Error('Inventory item not found');
        // console.log('Inventory Item not found');
      }
    } catch (error) {
      console.log('Error deleting Inventory item:', error);
      throw error;
    }
  },

  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        // console.log('No IDs provided for deletion.');
        return 0;
      }

      // Prepare the query with placeholders
      const query = `
        DELETE FROM Inventory
        WHERE id = ANY($1::int[])
      `;

      // Execute the query
      const result = await client.query(query, [ids]);
      // console.log(`Deleted ${result.rowCount} Inventory items.`);
      return result.rowCount;
    } catch (error) {
      console.log('Error deleting Inventory items:', error);
      throw error;
    }
  },
};

export default InventoryService;
