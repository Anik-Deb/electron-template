import { client } from '../Client';

export async function createLeaveRequestTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Leave_Requests (
            id SERIAL PRIMARY KEY, -- SERIAL for auto-increment in PostgreSQL
            employee_id INT NOT NULL,
            leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('vacation', 'sick', 'personal')), -- Use CHECK instead of ENUM
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')), -- Use CHECK instead of ENUM
            reason TEXT,
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Leave Request table created or already exists.');
  } catch (error) {
    console.error('Error creating Leave Request table:', error);
  }
}
