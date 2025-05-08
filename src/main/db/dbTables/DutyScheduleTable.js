import { client } from '../Client';

export async function createDutyScheduleTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Duty_Schedules (
              id SERIAL PRIMARY KEY,
              employee_id INT NOT NULL,
              shift_id INT NOT NULL,
              duty_date DATE NOT NULL,
              status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
              FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
              FOREIGN KEY (shift_id) REFERENCES Shifts(id)
          );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Duty Schedule table created or already exists.');
  } catch (error) {
    console.error('Error creating Duty Schedule table:', error);
  }
}
