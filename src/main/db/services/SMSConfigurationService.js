import { client } from '../Client';
// import { request } from 'http';

const SMSConfigurationsService = {
  /**
   * Fetch all SMS configurations from the database.
   * @returns {Promise<Array>} - Array of SMS configurations.
   */
  getAll: async () => {
    try {
      const result = await client.query('SELECT * FROM SMS_Configurations');
      return result.rows;
    } catch (error) {
      console.log('Error fetching SMS configurations:', error);
      throw error;
    }
  },

  /**
   * Fetch a specific SMS configuration by its ID.
   * @param {number} id - The ID of the SMS configuration.
   * @returns {Promise<Object|null>} - The SMS configuration object or null if not found.
   */
  get: async (id) => {
    try {
      const result = await client.query(
        'SELECT * FROM SMS_Configurations WHERE id = $1',
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error fetching SMS configuration:', error);
      throw error;
    }
  },

  /**
   * Add a new SMS configuration to the database.
   * @param {Object} smsConfig - The SMS configuration object.
   * @param {string} smsConfig.api_key - The API key.
   * @param {string} smsConfig.senderid - The sender id.
   * @returns {Promise<Object>} - The newly created SMS configuration.
   */
  add: async (smsConfig) => {
    try {
      // If the API key is valid, proceed with inserting into the database
      const result = await client.query(
        `INSERT INTO SMS_Configurations 
         (api_key, senderid) 
         VALUES ($1, $2) 
         RETURNING *`,
        [smsConfig.api_key, smsConfig.senderid] // Corrected parameters
      );
      return result.rows[0];
    } catch (error) {
      console.log('Error adding SMS configuration:', error);
      throw new Error(error);
    }
  },

  /**
   * Update an existing SMS configuration.
   * @param {Object} smsConfig - The SMS configuration object.
   * @param {number} smsConfig.id - The ID of the SMS configuration to update.
   * @param {string} smsConfig.api_key - The updated API key.
   * @param {string} smsConfig.senderid - The updated sender id.
   * @returns {Promise<Object|null>} - The updated SMS configuration or null if not found.
   */
  update: async (smsConfig) => {
    const { id, ...updates } = smsConfig;
    try {
      console.log('update:', updates);
      // If the API key is valid, proceed with updating the database
      const result = await client.query(
        `UPDATE SMS_Configurations 
         SET api_key = $1, senderid = $2 
         WHERE id = $3 
         RETURNING *`,
        [updates.api_key, updates.senderid, id] // Corrected parameters
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error updating SMS configuration:', error);
      throw error;
    }
  },

  /**
   * Delete a specific SMS configuration by its ID.
   * @param {number} id - The ID of the SMS configuration to delete.
   * @returns {Promise<Object|null>} - The deleted SMS configuration or null if not found.
   */
  delete: async (id) => {
    try {
      const result = await client.query(
        'DELETE FROM SMS_Configurations WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error deleting SMS configuration:', error);
      throw error;
    }
  },

  /**
   * Delete multiple SMS configurations by their IDs.
   * @param {Array<number>} ids - Array of IDs to delete.
   * @returns {Promise<number>} - The number of deleted SMS configurations.
   */
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        console.log('No IDs provided for deletion.');
        return 0;
      }

      const result = await client.query(
        `DELETE FROM SMS_Configurations 
         WHERE id = ANY($1::int[]) 
         RETURNING *`,
        [ids]
      );
      return result.rowCount;
    } catch (error) {
      console.log('Error deleting SMS configurations:', error);
      throw error;
    }
  },
};

export default SMSConfigurationsService;
