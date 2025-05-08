import { client } from '../Client';

export async function createEmailTemplateTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Email_Templates (
          id SERIAL PRIMARY KEY, -- Auto-incrementing ID for each email template
          name VARCHAR(255) NOT NULL, -- Name of the email template
          subject VARCHAR(255), -- Subject line of the email template
          body TEXT -- Body content of the email template
      );
  `;

  try {
    await client.query(createTableQuery);
    // console.log('Email template table created or already exists.');
  } catch (error) {
    console.log('Error creating email template table:', error);
  }
}
