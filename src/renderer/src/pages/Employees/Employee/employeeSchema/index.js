/* eslint-disable no-unused-vars */
import { z } from 'zod';

export const employeeSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email cannot exceed 255 characters'),
  phone: z
    .string()
    .nonempty('Phone number is required') // Ensures the field is not empty
    .min(11, 'Phone number must be at least 11 digits')
    .max(20, 'Invalid Number')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  emergency_contact_phone: z
    .union([
      z
        .string()
        .regex(/^\d+$/, 'Phone number must contain only digits')
        .min(11, 'Phone number must be at least 11 digits')
        .max(20, 'Invalid Number'),
      z.literal(''), // Allows an empty string
    ])
    .optional(),
  date_of_birth: z
    .union([
      z.date(),
      z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: 'Invalid date format',
      }),
    ])
    .nullable() // Allows null values
    .optional(), // Makes the field optional
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  profile_picture_url: z.string().optional(),
  department: z.enum(['manager', 'receptionist', 'housekeeper'], {
    errorMap: (issue) => {
      return {
        message: 'Department must be required!',
      };
    },
  }),
  position: z.enum(['Senior', 'Junior'], {
    errorMap: (issue) => {
      return { message: 'Position is required' };
    },
  }),
  salary: z.string().min(1, 'Salary is required'),
  hire_date: z
    .preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date()
    )
    .refine((date) => !isNaN(date.getTime()), { message: 'Date is required' }),

  termination_date: z
    .preprocess((val) => {
      if (!val) return undefined; // Allow undefined values (optional)
      if (typeof val === 'string') return new Date(val);
      return val;
    }, z.date().optional()) // Allow optional date
    .refine((date) => !date || !isNaN(date.getTime()), {
      message: 'Invalid date',
    }),
  certifications: z.array(z.string()).optional(),
  nid: z
    .string()
    .min(1, 'Passport or National Id Number is required')
    .max(50, 'Id must be at most 50 characters'),
});
