import { client } from '../Client';

export async function createSMSConfigurationTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS SMS_Configurations (
          id SERIAL PRIMARY KEY,
          api_key VARCHAR(100) NOT NULL, -- Adjusted for fixed-length API keys
          senderid VARCHAR(50) NOT NULL -- Sender ID for SMS
      );
  `;

  try {
    await client.query(createTableQuery);
    // console.log('SMS Configurations table created or already exists.');
  } catch (error) {
    console.log('Error creating SMS Configurations table:', error);
  }
}
