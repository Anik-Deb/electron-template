import fs from 'fs';
import path from 'path';
import { app } from 'electron';

// Load configuration and send it to renderer
const configPath = path.join(app.getPath('userData'), 'db.json');

// const configPath = path.resolve(app.getAppPath(), 'config/config.json');
// Load the configuration from config.json
function loadDBConfig() {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData)?.serverCredential;
  } catch (err) {
    console.error('Error loading database config:', err);
    return {};
  }
}

export const configData = loadDBConfig();
