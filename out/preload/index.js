"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
require("clsx");
require("tailwind-merge");
const entities = [
  "user",
  "guest",
  "employee",
  "attendance",
  "cashFlow",
  "dutySchedule",
  "booking",
  "invoiceItem",
  "invoice",
  "leaveRequest",
  "loyaltyProgram",
  "payroll",
  "performanceReview",
  "roomMaintenance",
  "room",
  "service",
  // room services
  "shift",
  "task",
  "serverConfig",
  "amenity",
  "posMachine",
  "emailConfiguration",
  "emailTemplate",
  "serviceProvider",
  "paymentMethods",
  "partnerPayments",
  "SMSConfiguration",
  "inventory"
];
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const createApiMethods = (entity, prefix = "") => {
  return {
    [`get${capitalize(entity)}s`]: (item) => electron.ipcRenderer.invoke(`get-${entity}s`, item),
    [`get${capitalize(entity)}`]: (id) => electron.ipcRenderer.invoke(`get-${entity}`, id),
    [`add${capitalize(entity)}`]: (item) => electron.ipcRenderer.invoke(`add-${entity}`, item),
    [`update${capitalize(entity)}`]: (item) => electron.ipcRenderer.invoke(`update-${entity}`, item),
    [`delete${capitalize(entity)}`]: (id) => electron.ipcRenderer.invoke(`delete-${entity}`, id),
    [`deleteAll${capitalize(entity)}`]: (ids) => electron.ipcRenderer.invoke(`delete-all-${entity}`, ids)
  };
};
const api = {};
entities.forEach((entity) => {
  Object.assign(api, createApiMethods(entity));
});
api.sendEmail = (emailFrom, emailTo, emailSubject, emailHTML, emailListId) => {
  return electron.ipcRenderer.invoke("send-email", {
    emailFrom,
    emailTo,
    emailSubject,
    emailHTML,
    emailListId
  });
};
api["resetEmailSend"] = (emailFrom, emailTo, emailSubject, emailHTML) => {
  return electron.ipcRenderer.invoke("reset-password-email", {
    emailFrom,
    emailTo,
    emailSubject,
    emailHTML
  });
};
api["appQuit"] = () => {
  return electron.ipcRenderer.invoke("app-quit", {});
};
api["login"] = (data) => {
  return electron.ipcRenderer.invoke("login", data);
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
