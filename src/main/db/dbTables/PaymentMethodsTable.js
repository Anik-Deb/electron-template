import { client } from '../Client';

export async function createPaymentMethodsTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Payment_Methods (
              id SERIAL PRIMARY KEY,
              partner_id INT,
              invoice_id INT NOT NULL,
              service_name VARCHAR(100) NOT NULL, -- 
              amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
              payment_type VARCHAR(20), --(pos machine name, cash)
              payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
              payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              description TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
          );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Bookings table created or already exists.');
  } catch (error) {
    console.error('Error creating payment methods table:', error);
  }
}
