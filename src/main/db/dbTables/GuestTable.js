import { client } from '../Client';

export async function createGuestTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Guest (
            id SERIAL PRIMARY KEY,
            user_id INT,
            passport_or_national_number VARCHAR(50),
            nid TEXT,
            nationality VARCHAR(50),
            secondary_contact VARCHAR(20) NOT NULL,
            relation VARCHAR(50),
            job_title VARCHAR(50),
            company_name VARCHAR(100),
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Guest table created or already exists.');
  } catch (error) {
    console.error('Error creating Guest table:', error);
  }
}
