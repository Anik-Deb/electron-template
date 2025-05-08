import { client } from '../Client';

export async function createUsersTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Users (
              id SERIAL PRIMARY KEY,
              first_name VARCHAR(50) NOT NULL,                -- User's first name
              last_name VARCHAR(50) NOT NULL,                 -- User's last name
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255),         -- Hashed password
              phone VARCHAR(20) UNIQUE NOT NULL,
              emergency_contact_phone VARCHAR(15),    -- Emergency contact phone (for employees)
              address_1 TEXT,                           -- User's address 1
              address_2 TEXT,                           -- User's address 2
              date_of_birth DATE,                     -- Date of birth (for employees and customers)
              profile_picture_url TEXT,               -- URL to user's profile picture
              role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest','receptionist', 'staff', 'employee', 'hr', 'admin')),  -- Custom ENUM type for role
              is_deleted BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Users table created or already exists.');
  } catch (error) {
    console.error('Error creating Users table:', error);
  }
}
