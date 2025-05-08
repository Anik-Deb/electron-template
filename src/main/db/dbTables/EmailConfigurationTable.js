import { client } from '../Client';

export async function createEmailConfigurationTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Email_Configurations (
          id SERIAL PRIMARY KEY, -- Auto-incrementing ID for each email configuration
          smtp_user_email VARCHAR(255) NOT NULL, -- SMTP user email
          smtp_password VARCHAR(255) NOT NULL, -- SMTP password
          smtp_server INT NOT NULL, -- SMTP server port or identifier
          imap_user_email VARCHAR(255) NOT NULL, -- IMAP user email
          imap_password VARCHAR(255) NOT NULL, -- IMAP password
          imap_server INT NOT NULL -- IMAP server port or identifier
      );
  `;

  try {
    await client.query(createTableQuery);
    // console.log('Email configuration table created or already exists.');
  } catch (error) {
    console.log('Error creating email configuration table:', error);
  }
}
