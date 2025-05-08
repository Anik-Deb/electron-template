import { client } from '../Client';

const RoomMaintenanceService = {
  // Retrieve all room maintenance records
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Room_Maintenance;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching room maintenance records:', error);
      throw new Error('Failed to fetch room maintenance records');
    }
  },

  // Retrieve a specific room maintenance record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Room_Maintenance 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Room maintenance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching room maintenance record:', error);
      throw new Error('Failed to fetch room maintenance record');
    }
  },

  // Add a new room maintenance record
  add: async (maintenance) => {
    try {
      // Validate required fields
      if (!maintenance.room_id || !maintenance.maintenance_type || !maintenance.start_date) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Room_Maintenance (
          room_id, maintenance_type, start_date, end_date, status, description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        maintenance.room_id,
        maintenance.maintenance_type,
        maintenance.start_date,
        maintenance.end_date, 
        maintenance.status || 'scheduled', // Default to 'scheduled' if not provided
        maintenance.description,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating room maintenance record:', error);
      throw new Error('Failed to create room maintenance record');
    }
  },

  // Update a specific room maintenance record by ID
  update: async (id, updates) => {
    try {
      // Check if the room maintenance record exists
      const maintenance = await RoomMaintenanceService.get(id);
      if (!maintenance) {
        throw new Error('Room maintenance record not found');
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
        UPDATE Room_Maintenance 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Room maintenance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating room maintenance record:', error);
      throw new Error('Failed to update room maintenance record');
    }
  },

  // Delete a specific room maintenance record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Room_Maintenance 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Room maintenance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting room maintenance record:', error);
      throw new Error('Failed to delete room maintenance record');
    }
  },

  // Delete all room maintenance records
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Room_Maintenance;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all room maintenance records:', error);
      throw new Error('Failed to delete all room maintenance records');
    }
  },
};

export default RoomMaintenanceService;