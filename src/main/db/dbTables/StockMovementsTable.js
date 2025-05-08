import { client } from '../Client';

export async function createServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS StockMovements (
              id SERIAL PRIMARY KEY,
              service_name VARCHAR(100) NOT NULL UNIQUE,
              price DECIMAL(15, 2) NOT NULL CHECK (price >= 0),
              partner_id INT UNIQUE,
              description TEXT,
              is_active BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Bookings table created or already exists.');
  } catch (error) {
    console.error('Error creating Stock Movements table:', error);
  }
}
