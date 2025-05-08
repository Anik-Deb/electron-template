import { client } from '../Client';
import nodemailer from 'nodemailer';

async function verifySMTPAccount(smtpConfig) {
  // Create a transporter object using the provided SMTP configuration
  let transporter = nodemailer.createTransport(smtpConfig);

  try {
    // Verify connection configuration
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return error;
  }
}

const EmailConfigurationService = {
  getAll: async () => {
    try {
      const result = await client.query('SELECT * FROM email_configurations');
      // console.log('All Email Configurations:', result.rows);
      return result.rows;
    } catch (error) {
      console.log('Error fetching email configurations:', error);
      throw error;
    }
  },

  get: async (id) => {
    try {
      const result = await client.query(
        'SELECT * FROM email_configurations WHERE id = $1',
        [id]
      );
      if (result.rows.length > 0) {
        // console.log('Email Configuration Found:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email configuration not found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching email configuration:', error);
      throw error;
    }
  },
  add: async (config) => {
    const smtpConfig = {
      host: config.smtp_post,
      port: 587,
      secure: false,
      auth: {
        user: config.smtp_user_email,
        pass: config.smtp_password,
      },
    };

    console.log('config for email account action:', config);
    try {
      // Step 1: Verify the SMTP Account
      const verificationResult = await verifySMTPAccount(smtpConfig);
      if (!verificationResult.success) {
        return { success: false, message: 'SMTP verification failed.' };
      }

      // Step 2: Check if the record exists
      const checkQuery = `
        SELECT id FROM email_configurations WHERE smtp_user_email = $1;
      `;
      const checkResult = await client.query(checkQuery, [
        config.smtp_user_email,
      ]);

      let result;
      if (checkResult.rows.length > 0) {
        // Step 3: Update existing record
        const updateQuery = `
          UPDATE email_configurations
          SET 
            smtp_password = $2,
            smtp_server = $3,
            imap_user_email = $4,
            imap_password = $5,
            imap_server = $6
          WHERE smtp_user_email = $1
          RETURNING *;
        `;
        result = await client.query(updateQuery, [
          config.smtp_user_email,
          config.smtp_password,
          config.smtp_server,
          config.imap_user_email,
          config.imap_password,
          config.imap_server,
        ]);
      } else {
        // Step 4: Insert new record
        const insertQuery = `
          INSERT INTO email_configurations (
            smtp_user_email, smtp_password, smtp_server, 
            imap_user_email, imap_password, imap_server
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        result = await client.query(insertQuery, [
          config.smtp_user_email,
          config.smtp_password,
          config.smtp_server,
          config.imap_user_email,
          config.imap_password,
          config.imap_server,
        ]);
      }

      // console.log('Email configuration saved:', result.rows[0]);
      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.log('Error adding/updating email configuration:', error);
      throw error;
    }
  },
  update: async (config) => {
    const { id, ...updates } = config;
    try {
      const result = await client.query(
        `UPDATE email_configurations 
         SET smtp_user_email = $1, smtp_password = $2, smtp_server = $3, 
             imap_user_email = $4, imap_password = $5, imap_server = $6 
         WHERE id = $7 
         RETURNING *`,
        [
          updates.smtp_user_email,
          updates.smtp_password,
          updates.smtp_server,
          updates.imap_user_email,
          updates.imap_password,
          updates.imap_server,
          id,
        ]
      );
      if (result.rows.length > 0) {
        // console.log('Email Configuration Updated:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email configuration not found');
        return null;
      }
    } catch (error) {
      console.log('Error updating email configuration:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const result = await client.query(
        'DELETE FROM email_configurations WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length > 0) {
        // console.log('Email Configuration Deleted:', result.rows[0]);
        return result.rows[0];
      } else {
        // console.log('Email configuration not found');
        return null;
      }
    } catch (error) {
      console.log('Error deleting email configuration:', error);
      throw error;
    }
  },
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        // console.log('No IDs provided for deletion.');
        return 0;
      }

      const query = `
        DELETE FROM email_configurations
        WHERE id = ANY($1::int[])
        RETURNING *
      `;
      const result = await client.query(query, [ids]);
      // console.log(`Deleted ${result.rowCount} email configurations.`);
      return result.rowCount;
    } catch (error) {
      console.log('Error deleting email configurations:', error);
      throw error;
    }
  },
};

export default EmailConfigurationService;
