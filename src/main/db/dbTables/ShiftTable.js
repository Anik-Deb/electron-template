import { client } from '../Client';

export async function createShiftTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Shifts (
            id SERIAL PRIMARY KEY,
            shift_name VARCHAR(50) NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Shift table created or already exists.');
  } catch (error) {
    console.error('Error creating Shift table:', error);
  }
}
