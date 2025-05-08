import { client } from '../Client';

const PosMachineService = {
  // Retrieve all POS machines
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Pos_Machine;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching POS machines:', error);
      throw error;
    }
  },

  // Retrieve a specific POS machine by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Pos_Machine 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('POS machine not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching POS machine:', error);
      throw error;
    }
  },

  // Add a new POS machine
  add: async (posMachine) => {
    try {
      // Validate required fields
      if (!posMachine.name) {
        throw new Error('POS machine name is required');
      }

      const query = `
        INSERT INTO Pos_Machine (
          name, location, is_active
        ) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `;

      const values = [
        posMachine.name,
        posMachine.location || null, // Default to null if not provided
        posMachine.is_active || true, // Default to true if not provided
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating POS machine:', error);
      throw error;
    }
  },

  // Update a specific POS machine by ID
  update: async ({ id, updates }) => {
    try {
      // Check if the POS machine exists
      const posMachine = await PosMachineService.get(id);
      if (!posMachine) {
        throw new Error('POS machine not found');
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
        UPDATE Pos_Machine 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('POS machine not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating POS machine:', error);
      throw error;
    }
  },

  // Delete a specific POS machine by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Pos_Machine 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('POS machine not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting POS machine:', error);
      throw error;
    }
  },

  // Delete multiple POS machines by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No POS machine IDs provided' );
      }

      const query = `
        DELETE FROM Pos_Machine 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No POS machines found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple POS machines:', error);
      throw error;
    }
  },
};

export default PosMachineService;
