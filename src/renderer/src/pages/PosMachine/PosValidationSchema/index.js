import { z } from 'zod';

export const posMachineSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 50 characters'),
  location: z.string().optional(),
  is_active: z.boolean().default(true),
});
