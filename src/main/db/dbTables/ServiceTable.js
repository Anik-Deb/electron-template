import { client } from '../Client';

export async function createServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Services (
                id SERIAL PRIMARY KEY, -- Auto-increment unique identifier
                service_name VARCHAR(255) NOT NULL, -- Name of the service
                service_provider_id INT, -- Links the service to the provider who offers it
                default_price DECIMAL(15, 2) NOT NULL, -- The standard price for this service
                provider_rate DECIMAL(15, 2) NULL,  -- Nullable column
                hotel_rate DECIMAL(15, 2) NULL,     -- Nullable column  
                is_active BOOLEAN DEFAULT true,
                CONSTRAINT fk_service_provider
                FOREIGN KEY (service_provider_id)
                REFERENCES Service_Providers(id)
                ON DELETE SET NULL -- Optional: Set to NULL if the referenced provider is deleted
              );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Bookings table created or already exists.');
  } catch (error) {
    console.error('Error creating Service table:', error);
  }
}
