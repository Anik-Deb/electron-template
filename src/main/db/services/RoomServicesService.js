import { client } from '../Client';

const RoomServicesService = {
  getAll: async () => {
    try {
      const query = `
      SELECT * 
      FROM Services;
    `;

      const result = await client.query(query);
      return result.rows;
      // const query = `
      //   SELECT
      //     Services.*,
      //     Service_Providers.service_provider_name,
      //     Service_Providers.contact_person,
      //     Service_Providers.contact_phone,
      //     Service_Providers.contact_email,
      //     Service_Providers.address,
      //     Service_Providers.current_balance
      //   FROM Services
      //   INNER JOIN Service_Providers
      //     ON Services.service_provider_id = Service_Providers.id
      // `;
    } catch (error) {
      console.error('Error fetching services with providers:', error);
      throw error;
    }
  },
  // Retrieve a specific room service by ID along with the provider's details
  get: async (id) => {
    try {
      const query = `SELECT * FROM Services WHERE id = $1;`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Service is not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching room service:', error);
      throw error;
    }
  },

  // Add a new room service
  // add: async (service) => {
  //   try {
  //     // Validate required fields
  //     if (!service.service_name || !service.default_price) {
  //       throw new Error('Missing required fields');
  //     }
  //     if (service.default_price < 0) {
  //       throw new Error('Default price cannot be negative');
  //     }

  //     // Optional field validation for provider_rate and hotel_rate
  //     if (service.provider_rate && service.provider_rate < 0) {
  //       throw new Error('Provider rate cannot be negative');
  //     }
  //     if (service.hotel_rate && service.hotel_rate < 0) {
  //       throw new Error('Hotel rate cannot be negative');
  //     }

  //     const query = `
  //       INSERT INTO Services (
  //         service_name, service_provider_id, default_price, provider_rate, hotel_rate
  //       )
  //       VALUES ($1, $2, $3, $4, $5)
  //       RETURNING *;
  //     `;

  //     const values = [
  //       service.service_name,
  //       service.service_provider_id || null,
  //       service.default_price || 0,
  //       service.provider_rate || null,
  //       service.hotel_rate || null,
  //     ];

  //     const result = await client.query(query, values);
  //     return result.rows[0]; // Return the inserted service
  //   } catch (error) {
  //     console.error('Error creating room service:', error);
  //     throw new Error('Failed to create room service');
  //   }
  // },
  //  add: async (service) => {  (Adjusted Database Interaction)
  add: async (service) => {
    try {
      // Validate required fields
      if (!service.service_name || !service.default_price) {
        throw new Error('Missing required fields');
      }
      if (service.default_price < 0) {
        throw new Error('Default price cannot be negative');
      }

      const query = `
        INSERT INTO Services (
          service_name, service_provider_id, default_price, provider_rate, hotel_rate
        ) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const values = [
        service.service_name,
        service.service_provider_id || null, // Optional service provider
        service.default_price || 0,
        service.provider_rate || 0, // Optional field
        service.hotel_rate || 0, // Optional field
      ];
      const result = await client.query(query, values);
      // console.log("result add", result);
      return result.rows[0]; // Return the inserted service
    } catch (error) {
      console.error('Error creating room service:', error);
      throw error;
    }
  },

  update: async ({ id, updates }) => {
    try {
      // console.log("updates before", updates)
      // Check if the service exists
      const existingService = await client.query(
        'SELECT * FROM Services WHERE id = $1',
        [id]
      );
      if (existingService.rows.length === 0) {
        throw new Error('Service not found');
      }

      // Validate updates
      if (updates.service_name !== undefined && !updates.service_name) {
        throw new Error('Service name cannot be empty');
      }

      if (updates.default_price !== undefined && updates.default_price < 0) {
        throw new Error('Default price cannot be negative');
      }
      if (updates.provider_rate !== undefined && updates.provider_rate < 0) {
        throw new Error('Provider rate cannot be negative');
      }
      if (updates.hotel_rate !== undefined && updates.hotel_rate < 0) {
        throw new Error('Hotel rate cannot be negative');
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
        UPDATE Services 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);
      // console.log("result update", result);

      if (result.rows.length === 0) {
        throw new Error('Service not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error('Failed to update service');
    }
  },
  // Delete a specific room service by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Services 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Services not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting room service:', error);
      throw new Error('Failed to delete room service');
    }
  },

  // Delete multiple room services by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No Room Services IDs provided');
      }

      const query = `
      DELETE FROM Services 
      WHERE id = ANY($1::INT[]) 
      RETURNING *;
    `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No Room Services found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple room service:', error);
      throw new Error('Failed to delete room services');
    }
  },
};

export default RoomServicesService;
