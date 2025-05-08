import { client } from '../Client';

export async function createRoomMaintenanceTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Room_Maintenance (
            id SERIAL PRIMARY KEY,
            room_id INT NOT NULL,
            maintenance_type VARCHAR(20) CHECK (maintenance_type IN ('cleaning', 'repair', 'renovation')) NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP,
            status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed')),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE
        );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Room table created or already exists.');
  } catch (error) {
    console.error('Error creating Room Maintenance table:', error);
  }
}
