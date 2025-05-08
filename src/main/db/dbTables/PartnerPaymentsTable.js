import { client } from '../Client';

export async function createPartnerPaymentsTable() {
  const createTableQuery = `
          CREATE TABLE IF NOT EXISTS Partner_Payments (
              id SERIAL PRIMARY KEY,
              service_provider_id INT,
              payment_method_id INT,
              payment_date DATE,
              payment_amount DECIMAL(10, 2),

              FOREIGN KEY (service_provider_id) REFERENCES Service_Providers(id),
              FOREIGN KEY (payment_method_id) REFERENCES Payment_Methods(id)

          );
    `;

  try {
    await client.query(createTableQuery);
    // console.log('Payment Item table created or already exists.');
  } catch (error) {
    console.error('Error creating Partner Payment Item table:', error);
  }
}