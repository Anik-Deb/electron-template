import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { entities } from '../lib/utils';

// Capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to generate API methods
const createApiMethods = (entity, prefix = '') => {
  return {
    [`get${capitalize(entity)}s`]: (item) =>
      ipcRenderer.invoke(`get-${entity}s`, item),
    [`get${capitalize(entity)}`]: (id) =>
      ipcRenderer.invoke(`get-${entity}`, id),
    [`add${capitalize(entity)}`]: (item) =>
      ipcRenderer.invoke(`add-${entity}`, item),
    [`update${capitalize(entity)}`]: (item) =>
      ipcRenderer.invoke(`update-${entity}`, item),
    [`delete${capitalize(entity)}`]: (id) =>
      ipcRenderer.invoke(`delete-${entity}`, id),
    [`deleteAll${capitalize(entity)}`]: (ids) =>
      ipcRenderer.invoke(`delete-all-${entity}`, ids),
  };
};

// Custom APIs for renderer
const api = {};

// Create API methods dynamically for each entity
entities.forEach((entity) => {
  Object.assign(api, createApiMethods(entity));
});


// Add additional API methods
api.sendEmail = (emailFrom, emailTo, emailSubject, emailHTML, emailListId) => {
  return ipcRenderer.invoke('send-email', {
    emailFrom,
    emailTo,
    emailSubject,
    emailHTML,
    emailListId,
  });
};

api['resetEmailSend'] = (emailFrom, emailTo, emailSubject, emailHTML) => {
  return ipcRenderer.invoke('reset-password-email', {
    emailFrom,
    emailTo,
    emailSubject,
    emailHTML,
  });
};

api['appQuit'] = () => {
  return ipcRenderer.invoke('app-quit', {});
};

api['login'] = (data) => {
  return ipcRenderer.invoke('login', data);
};

// Use contextBridge APIs to expose Electron APIs to renderer only if context isolation is enabled, otherwise just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
