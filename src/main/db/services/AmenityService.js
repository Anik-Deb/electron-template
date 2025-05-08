import { client } from '../Client';

const AmenityService = {
  // Retrieve all amenities
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Amenities;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw new Error('Failed to fetch amenities');
    }
  },

  // Retrieve a specific amenity by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Amenities 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Amenity not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching amenity:', error);
      throw new Error('Failed to fetch amenity');
    }
  },

  // Add a new amenity
  add: async (amenity) => {
    try {
      // Validate required fields
      if (!amenity.amenity_name) {
        throw new Error('Amenity name is required');
      }

      const query = `
        INSERT INTO Amenities (
          amenity_name, description
        ) 
        VALUES ($1, $2) 
        RETURNING *;
      `;

      const values = [
        amenity.amenity_name,
        amenity.description || null, // Default to null if not provided
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating amenity:', error);
      throw new Error('Failed to create amenity');
    }
  },

  // Update a specific amenity by ID
  update: async ({ id, updates }) => {
    try {
      // Check if the amenity exists
      const room = await AmenityService.get(id);
      if (!room) {
        throw new Error('Amenity not found');
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
        UPDATE Amenities 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Amenity not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating amenity:', error);
      throw new Error('Failed to update amenity');
    }
  },

  // Delete a specific amenity by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Amenities 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Amenity not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting amenity:', error);
      throw new Error('Failed to delete amenity');
    }
  },

  // Delete multiple amenities by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No amenity IDs provided');
      }

      const query = `
      DELETE FROM Amenities 
      WHERE id = ANY($1::INT[]) 
      RETURNING *;
    `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        // throw new Error('No amenity found for deletion');
        throw new Error('No amenity found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple amenities:', error);
      throw new Error('Failed to delete amenities');
    }
  },
};

export default AmenityService;
