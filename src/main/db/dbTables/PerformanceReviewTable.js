import { client } from '../Client';

export async function createPerformanceReviewsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS Performance_Reviews (
      id SERIAL PRIMARY KEY,
      employee_id INT NOT NULL,
      review_date DATE NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comments TEXT,
      reviewer_id INT NOT NULL,
      FOREIGN KEY (employee_id) REFERENCES Employees(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES Employees(id) ON DELETE NO ACTION
    );
  `;

  try {
    await client.query(createTableQuery);
    // console.log('Performance Reviews table created successfully');
  } catch (error) {
    console.error('Error creating Performance Reviews table:', error.message);
    throw error;
  }
}
