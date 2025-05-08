import { client } from '../Client';

export async function createPayrollTable() {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS Payroll (
            id SERIAL PRIMARY KEY,
            employee_id INT NOT NULL,
            pay_period_start DATE NOT NULL,
            pay_period_end DATE NOT NULL,
            gross_salary DECIMAL(15, 2) NOT NULL,
            deductions DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
            net_salary DECIMAL(15, 2) GENERATED ALWAYS AS (gross_salary - deductions) STORED,
            payment_date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
            CHECK (pay_period_end >= pay_period_start)
        );
    `;


  try {
    await client.query(createTableQuery);
    // console.log('Payroll table created or already exists.');
  } catch (error) {
    console.error('Error creating Payroll table:', error);
  }
}
