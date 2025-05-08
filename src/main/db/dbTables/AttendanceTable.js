import { client } from '../Client';

export async function createAttendanceTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Attendance (
            id SERIAL PRIMARY KEY,
            employee_id INT NOT NULL,
            clock_in TIMESTAMP NOT NULL,
            clock_out TIMESTAMP,
            hours_worked DECIMAL(5, 2),
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Attendance table created or already exists.');
  } catch (error) {
    console.error('Error creating Attendance table:', error);
  }
}
