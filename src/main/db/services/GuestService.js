import { client } from '../Client';

const GuestService = {
  // Retrieve all guest records
  getAll: async () => {
    try {
      const query = `
        SELECT 
          Guest.*, 
          Users.first_name, 
          Users.last_name, 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone,
          Users.address_1,
          Users.address_2,
          Users.date_of_birth, 
          Users.profile_picture_url,
          Users.role 
        FROM Guest 
        INNER JOIN Users ON Guest.user_id = Users.id;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching guest records:', error);
      throw error;
    }
  },

  // Retrieve a specific guest record by ID
  get: async (id) => {
    // console.log('id', id);
    try {
      const query = `
      SELECT 
        Guest.*, 
            Users.first_name, 
            Users.last_name, 
            Users.email, 
            Users.phone, 
            Users.emergency_contact_phone,
            Users.address_1,
            Users.address_2,
            Users.date_of_birth, 
            Users.profile_picture_url,
            Users.role 
      FROM Guest 
      INNER JOIN Users ON Guest.user_id = Users.id 
      WHERE Guest.id = $1;
    `;
      const result = await client.query(query, [id]);
      // console.log('guest:', result);
      if (result.rows.length === 0) {
        throw new Error('Guest not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching guest:', error);
      // throw new Error('Failed to fetch guest');
      throw error;
    }
  },

  // Add a new guest record
  add: async (guest) => {
    try {
      // Validate required fields
      if (!guest.user_id || !guest.secondary_contact) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Guest (
          user_id, passport_or_national_number, nid, nationality, secondary_contact, relation, job_title, company_name
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;

      const values = [
        guest.user_id,
        guest.passport_or_national_number || null, // Fixed field name
        guest.nid || null,
        guest.nationality || null,
        guest.secondary_contact,
        guest.relation || null,
        guest.job_title || null,
        guest.company_name || null,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating guest record:', error);
      throw error;
    }
  },

  // Update a specific guest record by ID
  update: async ({ id, updates }) => {
    // console.log('id', id);
    // console.log('updates', updates);
    try {
      // Check if the guest record exists
      const guest = await GuestService.get(id);
      // console.log('guest by id', guest);
      if (!guest) {
        throw new Error('Guest record not found');
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
        UPDATE Guest 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Guest record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating guest record:', error);
      throw error;
    }
  },

  // Delete a specific guest record by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Guest 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Guest record not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting guest record:', error);
      throw error;
    }
  },

  // Delete all guest records
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No Guest IDs provided');
      }

      const query = `
        DELETE FROM Guest 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No guests found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple guests:', error);
      throw error;
    }
  },
};

export default GuestService;
