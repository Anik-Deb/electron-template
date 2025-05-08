import { client } from '../Client';

export async function createTasksTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Task (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),  -- Custom ENUM type for role
                priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),  -- Custom ENUM type for role
                due_date TIMESTAMP,
                assigned_to INT NOT NULL, -- Employee responsible
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Relationships
                FOREIGN KEY (assigned_to) REFERENCES Employees(id) ON DELETE CASCADE
            );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Tasks table created or already exists.');
  } catch (error) {
    console.error('Error creating Tasks table:', error);
  }
}
