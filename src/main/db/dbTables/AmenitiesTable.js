import { client } from '../Client';

export async function createAmenitiesTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Amenities (
            id SERIAL PRIMARY KEY, -- Unique identifier for each amenity (auto-incremented).
            amenity_name VARCHAR(100) NOT NULL UNIQUE, -- Name of the amenity (e.g., Free Wi-Fi, Air Conditioning).
            description TEXT, -- Additional details about the amenity.
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created.
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record was last updated.
          );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Room table created or already exists.');
  } catch (error) {
    console.error('Error creating Room table:', error);
  }
}
