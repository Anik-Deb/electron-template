import { client } from '../Client';

const TaskService = {
  // Retrieve all tasks
  getAll: async () => {
    try {
      const query = `
        SELECT * 
        FROM Task;
      `;

      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  // Retrieve a specific task by ID
  get: async (id) => {
    try {
      const query = `
        SELECT * 
        FROM Task 
        WHERE id = $1;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching task:', error);
      throw new Error('Failed to fetch task');
    }
  },

  // Add a new task
  add: async (task) => {
    try {
      // Validate required fields
      if (!task.title || !task.assigned_to) {
        throw new Error('Missing required fields');
      }

      const query = `
        INSERT INTO Task (
          title, description, status, priority, due_date, assigned_to
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *;
      `;

      const values = [
        task.title,
        task.description,
        task.status || 'pending', // Default to 'pending' if not provided
        task.priority || 'medium', // Default to 'medium' if not provided
        task.due_date,
        task.assigned_to,
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  // Update a specific task by ID
  update: async (id, updates) => {
    try {
      // Check if the task exists
      const task = await TaskService.get(id);
      if (!task) {
        throw new Error('Task not found');
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
        UPDATE Task 
        SET ${setClause.join(', ')} 
        WHERE id = $${index} 
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  },

  // Delete a specific task by ID
  delete: async (id) => {
    try {
      const query = `
        DELETE FROM Task 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  },

  // Delete all tasks
  deleteAll: async () => {
    try {
      const query = `
        DELETE FROM Task;
      `;

      const result = await client.query(query);

      return result.rows; 
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      throw new Error('Failed to delete all tasks');
    }
  },
};

export default TaskService;