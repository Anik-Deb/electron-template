import { client } from '../Client';

export async function createLoyaltyProgramServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Loyalty_Program (
              id SERIAL PRIMARY KEY,
              user_id INT NOT NULL UNIQUE, -- Ensures one-to-one relationship
              points_balance INT DEFAULT 0 CHECK (points_balance >= 0), -- Loyalty points balance
              tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
              join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Date the user joined the loyalty program
              last_activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Last activity date
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL,
              FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE -- Links to the User table
          );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Cash Transaction Item table created or already exists.');
  } catch (error) {
    console.error('Error creating Loyalty Program Item table:', error);
  }
}
