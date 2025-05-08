import { createAmenitiesTable } from './AmenitiesTable';
import { createAttendanceTable } from './AttendanceTable';
import { createBookingsTable } from './BookingsTable';
import { createCashFlowServiceTable } from './CashFlowTable';
import { createDutyScheduleTable } from './DutyScheduleTable';
import { createEmailConfigurationTable } from './EmailConfigurationTable';
import { createEmailTemplateTable } from './EmailTemplateTable';
import { createEmployeesTable } from './EmployeesTable';
import { createGuestTable } from './GuestTable';
import { createInventoryTable } from './InventoryTable';
import { createInvoiceItemServiceTable } from './InvoiceItemTable';
import { createInvoiceServiceTable } from './InvoiceTable';
import { createLeaveRequestTable } from './LeaveRequestTable';
import { createLoyaltyProgramServiceTable } from './LoyaltyProgramTable';
import { createPartnerPaymentsTable } from './PartnerPaymentsTable';
import { createPaymentMethodsTable } from './PaymentMethodsTable';
import { createPayrollTable } from './PayrollTable';
import { createPerformanceReviewsTable } from './PerformanceReviewTable';
import { createPosMachineTable } from './PosMachineTable';
import { createRoomMaintenanceTable } from './RoomMaintenanceTable';
import { createRooms_AmenitiesTable, createRoomsTable } from './RoomTable';
import { createServiceProvidersTable } from './ServiceProvidersTable';
import { createServiceTable } from './ServiceTable';
import { createShiftTable } from './ShiftTable';
import { createSMSConfigurationTable } from './SMSConfigurationTable';
import { createTasksTable } from './TasksTable';
import { createUsersTable } from './UserTable';

export async function createDBTables() {
  // console.log('create db tables START!');
  /* Create data base */
  await Promise.all([
    createUsersTable(),
    createGuestTable(),
    createEmployeesTable(),
    createTasksTable(),
    createAttendanceTable(),
    createLeaveRequestTable(),
    createShiftTable(),
    createDutyScheduleTable(),
    createPerformanceReviewsTable(),
    createPayrollTable(),
    createServiceProvidersTable(),
    createServiceTable(),
    //

    createRoomsTable(),
    createAmenitiesTable(),
    createRooms_AmenitiesTable(),
    createBookingsTable(),
    createRoomMaintenanceTable(),

    //
    createInvoiceServiceTable(),
    createInvoiceItemServiceTable(),

    //
    createPaymentMethodsTable(),
    createPartnerPaymentsTable(),

    createCashFlowServiceTable(),
    createInventoryTable(),

    //
    createLoyaltyProgramServiceTable(),
    createPosMachineTable(),

    //
    createSMSConfigurationTable(),
    createEmailConfigurationTable(),
    createEmailTemplateTable(),
  ]);
  // console.log('create db tables DONE!');
}
