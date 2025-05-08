import { z } from 'zod';

// Guest Schema
export const bookingSchema = z
  .object({
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
          .regex(/^\d+$/, 'Secondary Contact must contain only digits')
          .min(11, 'Secondary Contact must be at least 11 digits')
          .max(20, 'Invalid Number'),
        z.literal(''), // Allows an empty string
      ])
      .optional(),
    role: z.string().min(1, 'Role is required.'),
    date_of_birth: z
      .union([
        z.date(),
        z.string().refine((val) => !val || !isNaN(new Date(val).getTime()), {
          message: 'Invalid date format',
        }),
      ])
      .nullable() // Allows null values
      .optional(), // Makes the field optional,
    address_1: z
      .string()
      .max(255, 'Address must be at most 255 characters')
      .optional(),
    address_2: z
      .string()
      .max(255, 'Address must be at most 255 characters')
      .optional(),
    profile_picture_url: z.string().optional(),
    passport_or_national_number: z
      .string()
      .min(1, 'Passport or National Id Number is required')
      .max(50, 'Id must be at most 50 characters'),
    nationality: z
      .string()
      .max(50, 'Nationality must be at most 50 characters')
      .optional(),
    secondary_contact: z
      .string()
      .nonempty('Emergency Contact is required') // Ensures the field is not empty
      .min(11, 'Emergency Contact must be at least 11 digits')
      .max(20, 'Invalid Number')
      .regex(/^\d+$/, 'Emergency Contact must contain only digits'),
    relation: z
      .string()
      .max(50, 'Relation must be at most 50 characters')
      .optional(),
    job_title: z
      .string()
      .max(50, 'Job title must be at most 50 characters')
      .optional(),
    company_name: z
      .string()
      .max(50, 'Company name must be at most 50 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
