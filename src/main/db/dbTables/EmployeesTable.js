import { client } from '../Client';

export async function createEmployeesTable() {
  const createTableQuery = `
       CREATE TABLE IF NOT EXISTS Employees (
                id SERIAL PRIMARY KEY,
                user_id INT,
                position VARCHAR(50) NOT NULL,
                salary DECIMAL(10, 2) NOT NULL,
                hire_date DATE NOT NULL,
                termination_date DATE,
                department VARCHAR(50),
                nid TEXT,
                certifications TEXT[], -- Array of certifications
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Employee table created or already exists.');
  } catch (error) {
    console.error('Error creating Employee table:', error);
  }
}
