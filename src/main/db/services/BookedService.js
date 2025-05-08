import { client } from '../Client';

const BookedServicesService = {
  // Retrieve all booked services for a specific booking
  getAll: async (booking_id) => {
    try {
      const query = `
        SELECT * 
        FROM Booked_Services 
        WHERE booking_id = $1 
        ORDER BY created_at DESC ;
      `;

      const result = await client.query(query, [booking_id]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching booked services:', error);
      throw new Error('Failed to fetch booked services');
    }
  },

  // Retrieve a specific booked service by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Booked_Services 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Booked service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching booked service:', error);
      throw new Error('Failed to fetch booked service');
    }
  },

  // Add a new booked service
  add: async (bookedService) => {
    try {
      // Validate required fields
      if (!bookedService.booking_id || !bookedService.service_id || !bookedService.quantity || !bookedService.total_price) {
        throw new Error('Missing required fields: booking_id, service_id, quantity, total_price');
      }

      const query = `
        INSERT INTO Booked_Services (
          booking_id, service_id, quantity, total_price
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;

      const params = [
        bookedService.booking_id,
        bookedService.service_id,
        bookedService.quantity,
        bookedService.total_price,
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding booked service:', error);
      throw new Error('Failed to add booked service');
    }
  },

  // Update an existing booked service
  update: async (id, updates) => {
    try {
      // Check if the booked service exists
      const bookedService = await BookedServicesService.get(id);
      if (!bookedService) {
        throw new Error('Booked service not found');
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
        UPDATE Booked_Services 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Booked service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating booked service:', error);
      throw new Error('Failed to update booked service');
    }
  },

  // Delete a booked service by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Booked_Services 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Booked service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting booked service:', error);
      throw new Error('Failed to delete booked service');
    }
  },

  // Delete multiple booked services by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No booked service IDs provided');
      }

      const query = `
        DELETE FROM Booked_Services 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No booked services found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple booked services:', error);
      throw new Error('Failed to delete booked services');
    }
  },
};

export default BookedServicesService;