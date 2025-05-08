import { client } from '../Client'; // Assuming you're using CommonJS in Electron

const ServiceProvidersService = {
  // Retrieve all service providers with pagination
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Service_Providers 
        ORDER BY id ;
      `;
      const result = await client.query(query);

      return result.rows;
    } catch (error) {
      console.error('Error fetching service providers:', error);
      throw error;
    }
  },

  // Retrieve a specific service provider by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Service_Providers 
        WHERE id = $1;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Service provider not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching service provider:', error);
      throw error;
    }
  },

  // Add a new service provider
  add: async (serviceProvider) => {
    try {
      // Validate required fields
      if (!serviceProvider.service_provider_name) {
        throw new Error('Missing required field: service_provider_name');
      }

      const query = `
        INSERT INTO Service_Providers (
          service_provider_name, contact_person, contact_phone, contact_email, address, current_balance
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const params = [
        serviceProvider.service_provider_name,
        serviceProvider.contact_person || null,
        serviceProvider.contact_phone || null,
        serviceProvider.contact_email || null,
        serviceProvider.address || null,
        serviceProvider.current_balance || 0.0,
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding service provider:', error);
      throw error;
    }
  },

  // Update an existing service provider
  update: async ({ id, updates }) => {
    try {
      // Check if the service provider exists
      const serviceProvider = await ServiceProvidersService.get(id);
      if (!serviceProvider) {
        throw new Error('Service provider not found');
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
        UPDATE Service_Providers 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Service provider not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating service provider:', error);
      throw error;
    }
  },

  // Permanently delete a service provider
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Service_Providers 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Service provider not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting service provider:', error);
      throw error;
    }
  },

  // Delete multiple service providers by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No service provider IDs provided');
      }

      const query = `
        DELETE FROM Service_Providers 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No service providers found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple service providers:', error);
      throw error;
    }
  },
};

export default ServiceProvidersService; // Export for use in Electron's main or renderer process
