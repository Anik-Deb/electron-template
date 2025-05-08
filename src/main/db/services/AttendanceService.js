import { client } from '../Client';

const AttendanceService = {
  // Retrieve all attendance records for a specific employee
  getAll: async (employee_id = {}) => {
    try {
      const query = `
        SELECT * 
        FROM Attendance 
        WHERE employee_id = $1 
        ORDER BY clock_in DESC ;
      `;

      const result = await client.query(query, [employee_id]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw new Error('Failed to fetch attendance records');
    }
  },

  // Retrieve a specific attendance record by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Attendance 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Attendance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      throw new Error('Failed to fetch attendance record');
    }
  },

  // Add a new attendance record
  add: async (attendance) => {
    try {
      // Validate required fields
      if (!attendance.employee_id || !attendance.clock_in) {
        throw new Error('Missing required fields: employee_id, clock_in');
      }

      const query = `
        INSERT INTO Attendance (
          employee_id, clock_in, clock_out, hours_worked
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;

      const params = [
        attendance.employee_id,
        attendance.clock_in,
        attendance.clock_out || null,
        attendance.hours_worked || null,
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding attendance record:', error);
      throw new Error('Failed to add attendance record');
    }
  },

  // Update an existing attendance record
  update: async (id, updates) => {
    try {
      // Check if the attendance record exists
      const attendance = await AttendanceService.get(id);
      if (!attendance) {
        throw new Error('Attendance record not found');
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
        UPDATE Attendance 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Attendance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw new Error('Failed to update attendance record');
    }
  },

  // Delete an attendance record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Attendance 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Attendance record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw new Error('Failed to delete attendance record');
    }
  },

  // Delete multiple attendance records by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No attendance record IDs provided');
      }

      const query = `
        DELETE FROM Attendance 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No attendance records found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple attendance records:', error);
      throw new Error('Failed to delete attendance records');
    }
  },
};

export default AttendanceService;
