import { ipcMain } from 'electron';
import * as services from '../db/services';
import sendEmail from '../services/emailService';
import resetEmailSend from '../services/resetEmailSend';
import appQuit from '../services/applicationQuite';
import Login from '../services/loginService';

const serviceMap = {
  user: services.UserService,
  guest: services.GuestService,
  employee: services.EmployeesService,
  serverConfig: services.ServerConfigService,
  attendance: services.AttendanceService,
  booking: services.BookingsService,
  cashFlow: services.CashFlowService,
  dutySchedule: services.DutyScheduleService,
  invoiceItem: services.InvoiceItemService,
  invoice: services.InvoiceService,
  leaveRequest: services.LeaveRequestService,
  loyaltyProgram: services.LoyaltyProgramService,
  payroll: services.PayrollService,
  performanceReview: services.PerformanceReviewService,
  roomMaintenance: services.RoomMaintenanceService,
  room: services.RoomService, // room
  service: services.RoomServicesService, // room services
  shift: services.ShiftService,
  task: services.TaskService,
  amenity: services.AmenityService, // room amenity
  posMachine: services.PosMachineService,
  emailConfiguration: services.EmailConfigurationService,
  emailTemplate: services.EmailTemplateService,
  serviceProvider: services.ServiceProvidersService,
  paymentMethods: services.PaymentMethodsService,
  partnerPayments: services.PartnerPaymentsService,
  SMSConfiguration: services.SMSConfigurationsService,
  inventory: services.InventoryService,
};
// 'paymentMethods',
// 'partnerPayments',
let handlersRegistered = false;
const registerAllHandlers = () => {
  if (handlersRegistered) return;
  handlersRegistered = true;
  Object.keys(serviceMap).forEach((entity) => {
    const service = serviceMap[entity];

    ipcMain.handle(`get-${entity}s`, async (event, item) => {
      try {
        return await service.getAll(item);
      } catch (error) {
        console.error(`Error occurred in handler for 'get-${entity}s':`, error);
        throw error;
      }
    });

    ipcMain.handle(`get-${entity}`, async (event, id) => {
      try {
        return await service.get(id);
      } catch (error) {
        console.error(`Error occurred in handler for 'get-${entity}':`, error);
        throw error;
      }
    });

    ipcMain.handle(`add-${entity}`, async (event, item) => {
      try {
        return await service.add(item);
      } catch (error) {
        console.error(`Error occurred in handler for 'add-${entity}':`, error);
        throw error;
      }
    });

    ipcMain.handle(`update-${entity}`, async (event, item) => {
      try {
        return await service.update(item);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'update-${entity}':`,
          error
        );
        throw error;
      }
    });

    ipcMain.handle(`delete-${entity}`, async (event, id) => {
      try {
        return await service.delete(id);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'delete-${entity}':`,
          error
        );
        throw error;
      }
    });

    ipcMain.handle(`delete-all-${entity}`, async (event, ids) => {
      try {
        return await service.deleteAll(ids);
      } catch (error) {
        console.error(
          `Error occurred in handler for 'delete-all-${entity}':`,
          error
        );
        throw error;
      }
    });
  });
  // Email sending handler TODO Add dynamically emailpassword
  ipcMain.handle(
    'send-email',
    async (
      event,
      { emailFrom, emailTo, emailSubject, emailHTML, emailListId }
    ) => {
      const { emailFrom: emailAddress, emailPass } = emailFrom;

      return await sendEmail({
        emailFrom: emailAddress,
        emailPass,
        emailTo,
        emailSubject,
        emailHTML,
        emailListId,
      });
    }
  );
  // Email sending handler TODO Add dynamically emailpassword
  ipcMain.handle(
    'reset-password-email', // use consistent naming here
    async (event, { emailFrom, emailTo, emailSubject, emailHTML }) => {
      const { emailFrom: emailAddress, emailPass } = emailFrom;
      return await resetEmailSend({
        emailFrom: emailAddress,
        emailPass,
        emailTo,
        emailSubject,
        emailHTML,
      });
    }
  );
  ipcMain.handle(
    'app-quit', // use consistent naming here
    async (event) => {
      return await appQuit();
    }
  );
  ipcMain.handle(
    'login', // use consistent naming here
    async (event, data) => {
      return await Login(data);
    }
  );
};

export default registerAllHandlers;
