import { client } from '../Client';

export async function createRoomsTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rooms (
          id SERIAL PRIMARY KEY, -- Unique identifier for each room (auto-incremented).
          room_number VARCHAR(10) NOT NULL UNIQUE, -- Room number (e.g., 101, 102). Must be unique.
          type_name VARCHAR(50) NOT NULL, -- Name of the room type (e.g., Standard, Deluxe).
          description TEXT, -- Additional details about the room.
          status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'checked', 'maintenance')), -- Current status of the room.
          base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0), -- Base price per night.
          capacity INT NOT NULL CHECK (capacity > 0), -- Maximum number of guests the room can accommodate.
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

//  Junction Table for Many-to-Many Relationship
export async function createRooms_AmenitiesTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS room_amenities (
            room_id INT NOT NULL, -- Foreign key referencing the 'rooms' table.
            amenity_id INT NOT NULL, -- Foreign key referencing the 'Amenities' table.
            PRIMARY KEY (room_id, amenity_id), -- Composite primary key to ensure uniqueness.
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE, -- Ensures referential integrity. If a room is deleted, associated amenities are also deleted.
            FOREIGN KEY (amenity_id) REFERENCES Amenities(id) ON DELETE CASCADE -- Ensures referential integrity. If an amenity is deleted, associated rooms are also deleted.
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Room table created or already exists.');
  } catch (error) {
    console.error('Error creating Room table:', error);
  }
}
