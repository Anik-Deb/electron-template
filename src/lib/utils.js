import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const entities = [
  'user',
  'guest',
  'employee',
  'attendance',
  'cashFlow',
  'dutySchedule',
  'booking',
  'invoiceItem',
  'invoice',
  'leaveRequest',
  'loyaltyProgram',
  'payroll',
  'performanceReview',
  'roomMaintenance',
  'room',
  'service', // room services
  'shift',
  'task',
  'serverConfig',
  'amenity',
  'posMachine',
  'emailConfiguration',
  'emailTemplate',
  'serviceProvider',
  'paymentMethods',
  'partnerPayments',
  'SMSConfiguration',
  'inventory'
];
