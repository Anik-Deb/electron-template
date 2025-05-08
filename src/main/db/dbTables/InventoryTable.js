import { client } from '../Client';

export async function createInventoryTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Inventory (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            type VARCHAR(50) NOT NULL, -- Renamed column
            quantity INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Inventory table created or already exists.');
  } catch (error) {
    console.log('Error creating Inventory table:', error);
  }
}

