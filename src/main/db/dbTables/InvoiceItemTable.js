import { client } from '../Client';

export async function createInvoiceItemServiceTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Invoice_Items (
              id SERIAL PRIMARY KEY,
              invoice_id INT NOT NULL,
              service_type VARCHAR(20) CHECK (service_type IN ('room', 'service')) NOT NULL,
              service_id INT NOT NULL,  -- Which service is consumed or Room id
              quantity INT NOT NULL CHECK (quantity > 0), -- How many services are consumed
              unit_price DECIMAL(15, 2) NOT NULL CHECK (unit_price >= 0),
              total_price DECIMAL(15, 2) NOT NULL CHECK (total_price >= 0),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL,
              FOREIGN KEY (invoice_id) REFERENCES Invoices(id) ON DELETE CASCADE
        );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Invoice Item table created or already exists.');
  } catch (error) {
    console.error('Error creating Invoice Item table:', error);
  }
}
