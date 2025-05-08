import { client } from '../Client';

export async function createInvoiceServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Invoices (
                id SERIAL PRIMARY KEY,
                booking_id INT NOT NULL,
                total_amount DECIMAL(15, 2) NOT NULL CHECK (total_amount >= 0),
                vat_amount DECIMAL(15, 2) DEFAULT 0.00 CHECK (vat_amount >= 0), -- VAT amount as a fixed value
                discount DECIMAL(15, 2) DEFAULT 0.00 CHECK (discount >= 0),
                net_amount DECIMAL(15, 2) DEFAULT 0.00 CHECK (net_amount >= 0),
                amount_paid DECIMAL(15, 2) DEFAULT 0.00 CHECK (amount_paid >= 0),
                balance_due DECIMAL(15, 2) DEFAULT 0.00 CHECK (balance_due >= 0),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT NULL,
                FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE
            );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Invoice Item table created or already exists.');
  } catch (error) {
    console.error('Error creating Invoice Item table:', error);
  }
}
