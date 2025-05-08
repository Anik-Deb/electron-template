import { client } from '../Client';

const LeaveRequestService = {
  // Retrieve all leave requests
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Leave_Requests;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw new Error('Failed to fetch leave requests');
    }
  },

  // Retrieve a specific leave request by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Leave_Requests 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Leave request not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching leave request:', error);
      throw new Error('Failed to fetch leave request');
    }
  },

  // Add a new leave request
  add: async (leaveRequest) => {
    try {
      // Validate required fields
      if (!leaveRequest.employee_id || !leaveRequest.leave_type 
          || !leaveRequest.start_date || !leaveRequest.end_date) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Leave_Requests (
          employee_id, leave_type, start_date, end_date, status, reason 
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        leaveRequest.employee_id,
        leaveRequest.leave_type,
        leaveRequest.start_date,
        leaveRequest.end_date,
        leaveRequest.status || 'pending', // Default to 'pending' if not provided
        leaveRequest.reason, 
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw new Error('Failed to create leave request');
    }
  },

  // Update a specific leave request by ID
  update: async (id, updates) => {
    try {
      // Check if the leave request exists
      const leaveRequest = await LeaveRequestService.get(id);
      if (!leaveRequest) {
        throw new Error('Leave request not found');
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
        UPDATE Leave_Requests 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Leave request not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw new Error('Failed to update leave request');
    }
  },

  // Delete a specific leave request by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Leave_Requests 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Leave request not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting leave request:', error);
      throw new Error('Failed to delete leave request');
    }
  },

  // Delete all leave requests
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Leave_Requests;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all leave requests:', error);
      throw new Error('Failed to delete all leave requests');
    }
  },
};

export default LeaveRequestService;