import { client } from '../Client';

const EmployeesService = {
  // Retrieve all employees
  getAll: async ({ department, role } = {}) => {
    try {
      let query = `
        SELECT 
          Employees.*, 
          Users.first_name, 
          Users.last_name, 
          Users.email, 
          Users.phone, 
          Users.emergency_contact_phone,
          Users.address_1,
          Users.date_of_birth, 
          Users.profile_picture_url,
          Users.role 
        FROM Employees 
        INNER JOIN Users ON Employees.user_id = Users.id
      `;

      const params = [];
      const conditions = [];

      if (department) {
        conditions.push(`Employees.department = $${params.length + 1}`);
        params.push(department);
      }

      if (role) {
        conditions.push(`TRIM(Users.role) = $${params.length + 1}`);
        params.push(role);
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      query += ` ORDER BY Employees.hire_date DESC`;

      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error; // Let caller handle errors
    }
  },

  // Retrieve a specific employee by ID
  get: async (id) => {
    try {
      const query = `
      SELECT 
        Employees.*, 
            Users.first_name, 
            Users.last_name, 
            Users.email, 
            Users.phone, 
            Users.emergency_contact_phone,
            Users.address_1,
            Users.address_2,
            Users.date_of_birth, 
            Users.profile_picture_url,
            Users.role 
      FROM Employees 
      INNER JOIN Users ON Employees.user_id = Users.id 
      WHERE Employees.id = $1;
    `;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Employee not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching employee:', error);
      // throw new Error('Failed to fetch employee');
      throw error;
    }
  },

  // Add a new employee
  add: async (employee) => {
    try {
      // Validate required fields
      if (
        !employee.user_id ||
        !employee.position ||
        !employee.salary ||
        !employee.hire_date
      ) {
        throw new Error(
          'Missing required fields: user_id, position, salary, hire_date'
        );
      }

      const query = `
        INSERT INTO Employees (
          user_id, position, salary, hire_date, termination_date, department, nid, certifications
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *;
      `;

      const params = [
        employee.user_id,
        employee.position,
        employee.salary,
        employee.hire_date,
        employee.termination_date || null,
        employee.department || null,
        employee.nid || null,
        employee.certifications || [], // Default to an empty array if not provided
      ];

      const result = await client.query(query, params);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding employee:', error);
      // throw new Error('Failed to add employee');
      throw error;
    }
  },

  // Update an existing employee
  update: async ({ id, updates }) => {
    try {
      // Check if the employee exists
      const employee = await EmployeesService.get(id);
      if (!employee) {
        throw new Error('Employee not found');
      }

      // Build the dynamic query for fields to update
      const setClause = [];
      const values = [];
      let index = 1;

      for (const [key, value] of Object.entries(updates)) {
        setClause.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }

      // Add the id as the last value for the WHERE clause
      values.push(id);

      const query = `
        UPDATE Employees 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Employee not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating employee:', error);
      // throw new Error('Failed to update employee');
      throw error;
    }
  },

  // Delete an employee by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Employees 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Employee not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting employee:', error);
      // throw new Error('Failed to delete employee');
      throw error;
    }
  },

  // Delete multiple employees by IDs
  deleteAll: async (ids) => {
    try {
      if (ids.length === 0) {
        throw new Error('No employee IDs provided');
      }

      const query = `
        DELETE FROM Employees 
        WHERE id = ANY($1::INT[]) 
        RETURNING *;
      `;

      const result = await client.query(query, [ids]);

      if (result.rows.length === 0) {
        throw new Error('No employees found for deletion');
      }

      return result.rows;
    } catch (error) {
      console.error('Error deleting multiple employees:', error);
      // throw new Error('Failed to delete employees');
      throw error;
    }
  },
};

export default EmployeesService;
