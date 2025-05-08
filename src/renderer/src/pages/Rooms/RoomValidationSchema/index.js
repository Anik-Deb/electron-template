import { z } from 'zod';

export const roomSchema = z.object({
  room_number: z
    .string()
    .min(1, 'Room number is required')
    .max(10, 'Room number cannot exceed 10 characters'),
  type_name: z
    .string()
    .min(1, 'Room type is required')
    .max(50, 'Room type cannot exceed 50 characters'),
  description: z.string().nullable().optional(),
  status: z
    .enum(['available', 'booked', 'checked', 'maintenance'])
    .default('available'),
  base_price: z
    .string()
    .transform((val) => parseFloat(val)) // Convert string to number
    .refine(
      (val) => !isNaN(val) && val >= 0 && val <= 99999999.99,
      'Base price must be a positive number and cannot exceed 99999999.99'
    ),
  capacity: z
    .number({ invalid_type_error: 'Capacity must be a number' })
    .min(1, 'Capacity must be at least 1'),
  amenities: z.array(z.number()).optional(),
});

export const amenitySchema = z.object({
  amenity_name: z
    .string()
    .min(1, 'Amenity name is required')
    .max(100, 'Amenity name cannot exceed 100 characters'), // Enforce VARCHAR(100) limit
  description: z.string().optional(),
});

export const roomServiceSchema = z.object({
  service_name: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name cannot exceed 100 characters'),
  service_provider_id: z.string().optional().nullable(),
  default_price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      'Default price must be a positive number'
    ),
  provider_rate: z
    .string()
    .max(15, 'Provider Rate cannot exceed 50 characters')
    .optional(), // Make optional
  hotel_rate: z
    .string()
    .max(15, 'Hotel Rate cannot exceed 50 characters')
    .optional(), // Make optional
  is_active: z.boolean().default(true),
});
