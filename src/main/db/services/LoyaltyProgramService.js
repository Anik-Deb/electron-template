import { client } from '../Client';

const LoyaltyProgramService = {
  // Retrieve all loyalty programs (for all users)
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Loyalty_Program;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching loyalty programs:', error);
      throw new Error('Failed to fetch loyalty programs');
    }
  },

  // Retrieve a specific loyalty program by user ID
  get: async (user_id) => {
    try {
      const query = `
        SELECT * 
        FROM Loyalty_Program 
        WHERE user_id = $1;
      `;

      const result = await client.query(query, [user_id]);

      if (result.rows.length === 0) {
        throw new Error('Loyalty program for the user not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching loyalty program for user:', error);
      throw new Error('Failed to fetch loyalty program for user');
    }
  },

  // Add a new loyalty program for a user
  add: async (loyaltyProgram) => {
    try {
      // Validate required fields
      if (!loyaltyProgram.user_id) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Loyalty_Program (
          user_id, points_balance, tier, join_date 
        ) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
      `;

      const values = [
        loyaltyProgram.user_id,
        loyaltyProgram.points_balance || 0, // Default to 0 points
        loyaltyProgram.tier || 'bronze', // Default to 'bronze' tier
        loyaltyProgram.join_date || new Date(), // Use current timestamp as default join date
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      throw new Error('Failed to create loyalty program');
    }
  },

  // Update a specific loyalty program by user ID
  update: async (user_id, updates) => {
    try {
      // Check if the loyalty program exists
      const loyaltyProgram = await LoyaltyProgramService.get(user_id); 
      if (!loyaltyProgram) {
        throw new Error('Loyalty program for the user not found');
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

      // Add the user_id as the last value for the WHERE clause
      values.push(user_id);

      const query = `
        UPDATE Loyalty_Program 
        SET ${setClause.join(', ')} 
        WHERE user_id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Loyalty program for the user not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating loyalty program:', error);
      throw new Error('Failed to update loyalty program');
    }
  },

  // Delete a specific loyalty program by user ID
  delete: async (user_id) => {
    try {
      const query = `
        DELETE FROM Loyalty_Program 
        WHERE user_id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [user_id]);

      if (result.rows.length === 0) {
        throw new Error('Loyalty program for the user not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting loyalty program:', error);
      throw new Error('Failed to delete loyalty program');
    }
  },

  // Delete all loyalty programs 
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Loyalty_Program;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all loyalty programs:', error);
      throw new Error('Failed to delete all loyalty programs');
    }
  },
};

export default LoyaltyProgramService;