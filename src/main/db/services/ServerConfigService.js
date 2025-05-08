import fs from 'fs';
import path from 'path';
import { client } from '../Client';
import { Client } from 'pg';
import { app } from 'electron';

// Load configuration and send it to renderer
const configPath = path.join(app.getPath('userData'), 'db.json');

const ServerConfigService = {
  getAll: async () => {
    try {
      const configData = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

      if (typeof configData.serverCredential !== 'object') {
        throw new Error('Invalid config format: expected an object.');
      }
      return configData.serverCredential || null; // Return the object or null if not set
    } catch (error) {
      // console.log('Error from get server configuration:', error);
    }
  },

  get: async () => {
    try {
      const configData = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

      if (typeof configData.serverCredential !== 'object') {
        throw new Error('Invalid config format: expected an object.');
      }
      return configData.serverCredential || null; // Return the object or null if not set
    } catch (error) {
      // console.log('Error from get server configuration:', error);
    }
  },
  add: async (config) => {
    try {
      // If config.url is provided, validate the URL and update the file
      if (config.url) {
        // Validate the URL by attempting a connection
        const client = new Client({
          connectionString: config.url,
        });

        try {
          await client.connect(); // Test the connection
          await client.end(); // Close the connection

          // Load existing config file or create a new object
          const configData = fs.existsSync(configPath)
            ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            : {};

          if (typeof configData !== 'object') {
            throw new Error('Invalid config format: expected an object.');
          }

          // Update the databaseUrl in the config file
          configData.databaseUrl = { url: config.url };
          fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

          return {
            status: 200,
            message:
              'Database URL validated and configuration updated successfully!',
          };
        } catch (error) {
          console.error('Error validating database URL:', error);
          return {
            status: 400,
            message: 'Invalid database URL!',
          };
        }
      }

      // Proceed with the original logic if no URL is provided
      const newConfig = {
        user: config?.user,
        host: config?.host,
        database: config?.database,
        password: config?.password,
        port: config?.port,
      };

      // Connect to the server without a database to check if the connection works
      const serverClient = new Client({
        user: newConfig.user,
        host: newConfig.host,
        database: 'postgres', // Use the default 'postgres' database to connect
        password: newConfig.password,
        port: newConfig.port,
      });

      await serverClient.connect();

      // Check if the database exists
      const res = await serverClient.query(
        `SELECT 1 FROM pg_database WHERE datname = '${newConfig.database}'`
      );

      // If the database exists, connect to it, otherwise create it
      if (res.rows.length > 0) {
        serverClient.end();
        const dbClient = new Client(newConfig);
        await dbClient.connect();
      } else {
        // Database does not exist, create it
        await serverClient.query(`CREATE DATABASE "${newConfig.database}"`);
        serverClient.end();
        const dbClient = new Client(newConfig);
        await dbClient.connect();
      }

      // Load existing config file or create a new object
      const configData = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

      if (typeof configData !== 'object') {
        throw new Error('Invalid config format: expected an object.');
      }

      // Update the serverCredential object
      configData.serverCredential = newConfig;

      // Save the updated configuration to the file
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

      // Close the serverClient if still open
      serverClient.end();

      return {
        status: 200,
        message: 'Server configuration updated successfully!',
      };
    } catch (error) {
      console.error('Error handling database connection:', error);
      return { message: 'Connection Failed!' };
    }
  },
  update: async (config) => {
    try {
      console.log('config url:', config?.url);
      // If config.url is provided, validate the URL and update the file
      if (config.url) {
        // Validate the URL by attempting a connection
        const client = new Client({
          connectionString: config.url,
        });

        try {
          await client.connect(); // Test the connection
          await client.end(); // Close the connection

          // Load existing config file or create a new object
          const configData = fs.existsSync(configPath)
            ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            : {};

          if (typeof configData !== 'object') {
            throw new Error('Invalid config format: expected an object.');
          }

          // Update the databaseUrl in the config file
          configData.databaseUrl = { url: config.url };
          fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

          return {
            status: 200,
            message:
              'Database URL validated and configuration updated successfully!',
          };
        } catch (error) {
          console.error('Error validating database URL:', error);
          return {
            status: 400,
            message: 'Invalid database URL!',
          };
        }
      }

      // Proceed with the original logic if no URL is provided
      const newConfig = {
        user: config?.user,
        host: config?.host,
        database: config?.database,
        password: config?.password,
        port: config?.port,
      };

      // Connect to the server without a database to check if the connection works
      const serverClient = new Client({
        user: newConfig.user,
        host: newConfig.host,
        database: 'postgres', // Use the default 'postgres' database to connect
        password: newConfig.password,
        port: newConfig.port,
      });

      await serverClient.connect();

      // Check if the database exists
      const res = await serverClient.query(
        `SELECT 1 FROM pg_database WHERE datname = '${newConfig.database}'`
      );

      // If the database exists, connect to it, otherwise create it
      if (res.rows.length > 0) {
        serverClient.end();
        const dbClient = new Client(newConfig);
        await dbClient.connect();
      } else {
        // Database does not exist, create it
        await serverClient.query(`CREATE DATABASE "${newConfig.database}"`);
        serverClient.end();
        const dbClient = new Client(newConfig);
        await dbClient.connect();
      }

      // Load existing config file or create a new object
      const configData = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

      if (typeof configData !== 'object') {
        throw new Error('Invalid config format: expected an object.');
      }

      // Update the serverCredential object
      configData.serverCredential = newConfig;

      // Save the updated configuration to the file
      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

      // Close the serverClient if still open
      serverClient.end();

      return {
        status: 200,
        message: 'Server configuration updated successfully!',
      };
    } catch (error) {
      console.error('Error handling database connection:', error);
      return { status: 400, message: 'Connection Failed!' };
    }
  },
  delete: () => {
    try {
      const configData = fs.existsSync(configPath)
        ? JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        : {};

      if (typeof configData !== 'object') {
        throw new Error('Invalid config format: expected an object.');
      }

      // Remove the serverCredential object
      delete configData.serverCredential;

      fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
      // console.log('Server configuration has been deleted.');

      client.end(); // Close the existing connection
      const newClient = new Client({}); // Fallback to an empty config or default if needed
      newClient
        .connect()
        .then(() => {
          // console.log('Reconnected to the database with fallback settings.');
        })
        .catch((err) => {
          console.error('Error reconnecting to database:', err.stack);
        });
      return true;
    } catch (error) {
      console.error('Error resetting config.json:', error);
    }
  },
};

export default ServerConfigService;
