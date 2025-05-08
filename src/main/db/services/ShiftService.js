import { client } from '../Client';

const ShiftService = {
  // Retrieve all shifts
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Shifts;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw new Error('Failed to fetch shifts');
    }
  },

  // Retrieve a specific shift by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Shifts 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Shift not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching shift:', error);
      throw new Error('Failed to fetch shift');
    }
  },

  // Add a new shift
  add: async (shift) => {
    try {
      // Validate required fields
      if (!shift.shift_name || !shift.start_time || !shift.end_time) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Shifts (
          shift_name, start_time, end_time
        ) 
        VALUES ($1, $2, $3) 
        RETURNING *;
      `;

      const values = [
        shift.shift_name,
        shift.start_time,
        shift.end_time,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating shift:', error);
      throw new Error('Failed to create shift');
    }
  },

  // Update a specific shift by ID
  update: async (id, updates) => {
    try {
      // Check if the shift exists
      const shift = await ShiftService.get(id);
      if (!shift) {
        throw new Error('Shift not found');
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
        UPDATE Shifts 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Shift not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating shift:', error);
      throw new Error('Failed to update shift');
    }
  },

  // Delete a specific shift by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Shifts 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Shift not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting shift:', error);
      throw new Error('Failed to delete shift');
    }
  },

  // Delete all shifts
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Shifts;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all shifts:', error);
      throw new Error('Failed to delete all shifts');
    }
  },
};

export default ShiftService;