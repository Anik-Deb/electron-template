import { client } from '../Client';

const PerformanceReviewService = {
  // Retrieve all performance reviews
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Performance_Reviews;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching performance reviews:', error);
      throw new Error('Failed to fetch performance reviews');
    }
  },

  // Retrieve a specific performance review by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Performance_Reviews 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Performance review not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching performance review:', error);
      throw new Error('Failed to fetch performance review');
    }
  },

  // Add a new performance review
  add: async (review) => {
    try {
      // Validate required fields
      if (!review.employee_id || !review.review_date || !review.rating || !review.reviewer_id) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Performance_Reviews (
          employee_id, review_date, rating, comments, reviewer_id
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
      `;

      const values = [
        review.employee_id,
        review.review_date,
        review.rating,
        review.comments,
        review.reviewer_id,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating performance review:', error);
      throw new Error('Failed to create performance review');
    }
  },

  // Update a specific performance review by ID
  update: async (id, updates) => {
    try {
      // Check if the performance review exists
      const review = await PerformanceReviewService.get(id);
      if (!review) {
        throw new Error('Performance review not found');
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
        UPDATE Performance_Reviews 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Performance review not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating performance review:', error);
      throw new Error('Failed to update performance review');
    }
  },

  // Delete a specific performance review by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Performance_Reviews 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Performance review not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting performance review:', error);
      throw new Error('Failed to delete performance review');
    }
  },

  // Delete all performance reviews
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Performance_Reviews;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all performance reviews:', error);
      throw new Error('Failed to delete all performance reviews');
    }
  },
};

export default PerformanceReviewService;