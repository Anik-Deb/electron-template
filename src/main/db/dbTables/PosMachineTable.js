import { client } from '../Client';

export async function createPosMachineTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Pos_Machine  (
            id SERIAL PRIMARY KEY,  -- Unique identifier for the POS machine
            name VARCHAR(50) NOT NULL,  -- Name or identifier of the POS machine
            location VARCHAR(255),  -- Location where the POS machine is installed
            is_active BOOLEAN DEFAULT TRUE,  -- Whether the POS machine is active
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the POS machine was added
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the POS machine was last updated
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Room table created or already exists.');
  } catch (error) {
    console.error('Error creating Room table:', error);
  }
}
