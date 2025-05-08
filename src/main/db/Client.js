/* Without created database */
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// Load configuration and send it to renderer
const configPath = path.join(app.getPath('userData'), 'db.json');

// Path to the default config file in the app's resources
const defaultConfigFilePath = path.resolve(
  app.getAppPath(),
  'config/config.json'
);

function getConfig() {
  try {
    // Ensure the directory for the config file exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // If the path is a directory, remove it (prevent conflict)
    if (fs.existsSync(configPath) && fs.lstatSync(configPath).isDirectory()) {
      fs.rmdirSync(configPath); // Remove the directory if it exists
    }

    // Now ensure db.json is treated as a file
    if (fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
      // File exists, read and return its contents
      const data = fs.readFileSync(configPath, 'utf8');
      // // console.log('Config data loaded:', JSON.parse(data));
      return JSON.parse(data);
    } else {
      // If db.json does not exist, create it from default config
      const defaultData = fs.readFileSync(defaultConfigFilePath, 'utf8');
      fs.writeFileSync(configPath, defaultData, 'utf8');
      // console.log('Config file created from default data at:', configPath);
      return JSON.parse(defaultData);
    }
  } catch (error) {
    console.error('Error handling config file:', error);
  }
}

// Call the function to handle config file
const configData = getConfig();
// // console.log('config data:', configData);
let client;
if (configData.serverCredential) {
  client = new Client(configData.serverCredential);
}

export { client };

/* In Future: New Version*/
// import { Client } from 'pg';
// import fs from 'fs';
// import path from 'path';
// import { app } from 'electron';

// // Load configuration and send it to renderer
// const configPath = path.join(app.getPath('userData'), 'db.json');

// // Path to the default config file in the app's resources
// const defaultConfigFilePath = path.resolve(
//   app.getAppPath(),
//   'config/config.json'
// );

// function getConfig() {
//   try {
//     // Ensure the directory for the config file exists
//     const configDir = path.dirname(configPath);
//     if (!fs.existsSync(configDir)) {
//       fs.mkdirSync(configDir, { recursive: true });
//     }

//     // If the path is a directory, remove it (prevent conflict)
//     if (fs.existsSync(configPath) && fs.lstatSync(configPath).isDirectory()) {
//       fs.rmdirSync(configPath); // Remove the directory if it exists
//     }

//     // Now ensure db.json is treated as a file
//     if (fs.existsSync(configPath) && fs.lstatSync(configPath).isFile()) {
//       // File exists, read and return its contents
//       const data = fs.readFileSync(configPath, 'utf8');
//       return JSON.parse(data);
//     } else {
//       // If db.json does not exist, create it from default config
//       const defaultData = fs.readFileSync(defaultConfigFilePath, 'utf8');
//       fs.writeFileSync(configPath, defaultData, 'utf8');
//       return JSON.parse(defaultData);
//     }
//   } catch (error) {
//     console.error('Error handling config file:', error);
//   }
// }

// // Call the function to handle config file
// const configData = getConfig();
// let client = null;

// if (configData && configData.databaseUrl && configData.databaseUrl.url) {
//   client = new Client({ connectionString: configData.databaseUrl.url });
//   console.log('PostgreSQL Client instance created.');
// }

// export { client };
