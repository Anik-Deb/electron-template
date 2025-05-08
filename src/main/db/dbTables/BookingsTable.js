import { client } from '../Client';

export async function createBookingsTable() {
  const createTableQuery = `
       CREATE TABLE IF NOT EXISTS Bookings (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            room_id INT NOT NULL,
            check_in_date DATE NOT NULL,
            check_out_date DATE,
            total_price DECIMAL(15, 2) NOT NULL CHECK (total_price >= 0),
            status VARCHAR(20) DEFAULT 'booked' CHECK (status IN ('booked', 'checked', 'canceled', 'checked_out')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (room_id) REFERENCES Rooms(id),
            CHECK (check_out_date > check_in_date)
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Bookings table created or already exists.');
  } catch (error) {
    console.error('Error creating Bookings table:', error);
  }
}
