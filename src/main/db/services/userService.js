import { client } from '../Client'; // Assuming you're using CommonJS in Electron
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt hashing

const UsersService = {
  // Retrieve all users with pagination and optional role filter
  getAll: async ({ role } = {}) => {
    try {
      let query = `SELECT * FROM Users WHERE is_deleted = FALSE`;
      const params = [];

      if (role) {
        query += ` AND role = $1`;
        params.push(role);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Retrieve a specific user by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Users 
        WHERE id = $1 AND is_deleted = FALSE;
      `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = result.rows[0];
      // Do not return the password hash for security reasons
      // delete user.password;

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      // throw new Error('Failed to fetch user');
      throw error;
    }
  },

  // Add a new user
  add: async (user) => {
    try {
      if (!user.first_name || !user.last_name || !user.email || !user.phone) {
        throw new Error('Missing required fields: first_name, last_name, email, phone');
      }

      let hashedPassword = user.password ? await bcrypt.hash(user.password, SALT_ROUNDS) : null;

      const query = `
        INSERT INTO Users (
          first_name, last_name, email, password, phone, emergency_contact_phone, 
          address_1, address_2, date_of_birth, profile_picture_url, role, updated_at
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP) 
        RETURNING *;
      `;

      const params = [
        user.first_name,
        user.last_name,
        user.email,
        hashedPassword,
        user.phone,
        user.emergency_contact_phone || null,
        user.address_1 || null,
        user.address_2 || null,
        user.date_of_birth || null,
        user.profile_picture_url || null,
        user.role?.toLowerCase() || 'guest',
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  // Update an existing user
  update: async ({ id, updates }) => {
    try {
      // console.log('id:', id);
      // Check if the user exists and is not soft-deleted
      const user = await UsersService.get(id);
      if (!user) {
        // throw new Error('User not found');
        throw new Error('User not found');
      }
      // console.log('updates', updates);
      // If password is being updated, hash it using bcrypt
      if (updates?.password) {
        updates.password = await bcrypt.hash(updates?.password, SALT_ROUNDS);
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
        UPDATE Users 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} AND is_deleted = FALSE 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        // throw new Error('User not found or already deleted');
        throw new Error('User not found ord already deleted');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Permanently delete a user
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Users 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        // throw new Error('User not found');
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
      // throw new Error('Failed to delete user');
    }
  },

  // Delete multiple users by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        // throw new Error('No user IDs provided');
        throw new Error('No user IDs provided');
      }

      const query = `
        DELETE FROM Users 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        // throw new Error('No users found for deletion');
        throw new Error('No users found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple users:', error);
      throw error;
      // throw new Error('Failed to delete users');
    }
  },
};

export default UsersService; // Export for use in Electron's main or renderer process
