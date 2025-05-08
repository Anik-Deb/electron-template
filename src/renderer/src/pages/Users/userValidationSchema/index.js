import { z } from 'zod';

// Add User
export const userSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'First name is required.')
      .max(50, 'First name cannot exceed 50 characters'),
    last_name: z
      .string()
      .min(1, 'Last name is required.')
      .max(50, 'Last name cannot exceed 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Invalid email format.')
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
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters.')
      .max(100, 'Password cannot exceed 255 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password is required.'),
    role: z
      .enum(['admin', 'guest', 'receptionist', 'hr', 'employee', 'staff'])
      .default('guest', { message: 'Role must be required!' }),
    date_of_birth: z
      .union([
        z.date(),
        z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
          message: 'Invalid date format',
        }),
      ])
      .nullable() // Allows null values
      .optional(), // Makes the field optional
    address: z
      .string()
      .max(255, 'Address must be at most 255 characters')
      .optional(),
    profile_picture_url: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Update User
export const updateUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required.')
    .max(50, 'First name cannot exceed 50 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required.')
    .max(50, 'Last name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Invalid email format.')
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
        .regex(/^\d+$/, 'Emergency Contact must contain only digits')
        .min(11, 'Emergency Contact must be at least 11 digits')
        .max(20, 'Invalid Number'),
      z.literal(''), // Allows an empty string
    ])
    .optional(),
  role: z
    .enum(['admin', 'guest', 'receptionist', 'hr', 'employee', 'staff'])
    .default('guest', { message: 'Role must be required!' })
    .optional(),
  date_of_birth: z
    .union([
      z.date(),
      z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: 'Invalid date format',
      }),
    ])
    .nullable() // Allows null values
    .optional(), // Makes the field optional,
  address: z
    .string()
    .max(255, 'Address must be at most 255 characters')
    .optional(),
  profile_picture_url: z.string().optional(),
});
