import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

// Path to the config file
const configPath = path.join(app.getPath('userData'), 'db.json');

const ensureConfigDirectoryExists = () => {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
};

const readConfigFile = () => {
  if (fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
    const configData = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configData);
  }
  return null;
};

const authenticateWithLocalFile = (config, data) => {
  if (
    config.userCredential &&
    config.userCredential.email === data.email &&
    config.userCredential.password === data.password
  ) {
    return {
      email: data.email,
      role: 'superAdmin',
      redirectURL: '/server-configuration',
    };
  }
  return false;
};

const authenticateWithDatabase = async (config, data) => {
  const client = new Client({
    host: config.serverCredential.host,
    user: config.serverCredential.user,
    password: config.serverCredential.password,
    database: config.serverCredential.database,
    port: config.serverCredential.port,
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT password, role FROM Users WHERE email = $1`,
      [data.email]
    );

    if (res.rows.length > 0) {
      const dbPassword = res.rows[0].password;

      // Use bcrypt to compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(data.password, dbPassword);
      if (isMatch) {
        return {
          email: data.email,
          role: res.rows[0]?.role,
          redirectURL: '/',
        };
      }
    }

    // Return false if authentication fails
    return false;
  } catch (dbError) {
    console.error('Database error:', dbError);
    return false;
  } finally {
    await client.end();
  }
};

const Login = async (data) => {
  try {
    ensureConfigDirectoryExists();
    const config = readConfigFile();

    if (!config) {
      return false;
    }

    if (!config.serverCredential) {
      return authenticateWithLocalFile(config, data);
    } else {
      return await authenticateWithDatabase(config, data);
    }
  } catch (error) {
    console.error('Error during login process:', error);
    return false;
  }
};

export default Login;
