import { client } from '../Client';

export async function createCashFlowServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Cash_Flow (
              id SERIAL PRIMARY KEY,
              date DATE NOT NULL UNIQUE, -- Ensures only one entry per day
              opening_balance DECIMAL(15, 2) NOT NULL CHECK (opening_balance >= 0), -- Positive or zero
              total_income DECIMAL(15, 2) NOT NULL CHECK (total_income >= 0), -- Positive or zero
              total_expenses DECIMAL(15, 2) NOT NULL CHECK (total_expenses >= 0), -- Positive or zero
              closing_balance DECIMAL(15, 2) NOT NULL CHECK (closing_balance >= 0), -- Positive or zero
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the record was last updated
          );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Cash Flow Item table created or already exists.');
  } catch (error) {
    console.error('Error creating Cash Flow Item table:', error);
  }
}
