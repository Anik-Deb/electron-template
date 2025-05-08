import { z } from 'zod';

export const providerSchema = z.object({
  service_provider_name: z
    .string()
    .min(1, 'Service provider name is required')
    .max(50, 'Service provider name cannot exceed 50 characters'),

  contact_person: z
    .string()
    .max(60, 'Contact person name cannot exceed 60 characters')
    .optional(),

  contact_phone: z
    .union([
      z
        .string()
        .regex(/^\d+$/, 'Phone number must contain only digits')
        .min(11, 'Phone number must be at least 11 digits')
        .max(20, 'Invalid Number'),
      z.literal(''), // Allows an empty string
    ])
    .optional(),

  contact_email: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z
      .string()
      .email('Invalid email address')
      .max(255, 'Email cannot exceed 255 characters')
      .optional()
  ),

  address: z.string().optional(),

  current_balance: z.preprocess((val) => {
    // If no value is provided, leave it as undefined
    if (val === undefined || val === null || val === '') return undefined;
    return parseFloat(val);
  }, z.number().min(0, 'Balance must be a positive number').max(99999999.99, 'Balance cannot exceed 99999999.99').optional()),
});
