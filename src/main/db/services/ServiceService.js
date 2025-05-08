import { client } from '../Client';

const ServiceService = {
  // Retrieve all services
  getAll: async (ids) => {
    try {
      console.log('ids:', ids);

      // Construct the query to filter by IDs
      const query = `SELECT * FROM Services WHERE id = ANY($1::int[]);`;
      const result = await client.query(query, [ids]);

      return result.rows;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Retrieve a specific service by ID
  get: async (id) => {
    try {
      const query = `SELECT * FROM Services WHERE id = $1;`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Service is not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Add a new service
  add: async (service) => {
    try {
      if (!service.id || !service.service_name) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Services (id, service_name, service_provider_id, default_price, provider_rate, hotel_rate)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [
        service.id,
        service.service_name,
        service.service_provider_id || null,
        service.default_price || 0.0,
        service.provider_rate || 0.0,
        service.hotel_rate || 0.0,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update a specific service by ID
  update: async (id, updates) => {
    try {
      const service = await ServiceService.get(id);
      if (!service) {
        throw new Error('Service not found');
      }

      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      values.push(id);
      const query = `
        UPDATE Services 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Delete a specific service by ID
  delete: async (id) => {
    try {
      const query = `DELETE FROM Services WHERE id = $1 RETURNING *;`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Delete all services
  deleteAll: async ({ ids }) => {
    try {
      const query = `DELETE FROM Services;`;
      await client.query(query);
      return { message: 'All services deleted successfully' };
    } catch (error) {
      console.error('Error deleting all services:', error);
      throw error;
    }
  },
};

export default ServiceService;
