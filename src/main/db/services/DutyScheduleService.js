import { client } from '../Client';

const DutyScheduleService = {
  // Retrieve all duty schedules
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Duty_Schedules;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching duty schedules:', error);
      throw new Error('Failed to fetch duty schedules');
    }
  },

  // Retrieve a specific duty schedule by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Duty_Schedules 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Duty schedule not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching duty schedule:', error);
      throw new Error('Failed to fetch duty schedule');
    }
  },

  // Add a new duty schedule
  add: async (schedule) => {
    try {
      // Validate required fields
      if (!schedule.employee_id || !schedule.shift_id || !schedule.duty_date) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Duty_Schedules (
          employee_id, shift_id, duty_date, status 
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;

      const values = [
        schedule.employee_id,
        schedule.shift_id,
        schedule.duty_date,
        schedule.status || 'scheduled', // Default to 'scheduled' if not provided
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating duty schedule:', error);
      throw new Error('Failed to create duty schedule');
    }
  },

  // Update a specific duty schedule by ID
  update: async (id, updates) => {
    try {
      // Check if the duty schedule exists
      const schedule = await DutyScheduleService.get(id);
      if (!schedule) {
        throw new Error('Duty schedule not found');
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
        UPDATE Duty_Schedules 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Duty schedule not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating duty schedule:', error);
      throw new Error('Failed to update duty schedule');
    }
  },

  // Delete a duty schedule by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Duty_Schedules 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Duty schedule not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting duty schedule:', error);
      throw new Error('Failed to delete duty schedule');
    }
  },

  // Delete multiple duty schedules by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No duty schedule IDs provided');
      }

      const query = `
        DELETE FROM Duty_Schedules 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No duty schedules found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple duty schedules:', error);
      throw new Error('Failed to delete duty schedules');
    }
  },
};

export default DutyScheduleService;