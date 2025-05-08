import { client } from '../Client';

export async function createServiceProvidersTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Service_Providers (
              id SERIAL PRIMARY KEY,
              service_provider_name VARCHAR(50) NOT NULL, -- Name of the service provider
              contact_person VARCHAR(60), -- Contact person at the service provider
              contact_phone VARCHAR(15), -- Contact phone number
              contact_email VARCHAR(255), -- Contact email address
              address TEXT, -- Address of the service provider
              current_balance DECIMAL(15, 2) -- The current balance owed to the service provider
          );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Bookings table created or already exists.');
  } catch (error) {
    console.error('Error creating Service Providers table:', error);
  }
}
