import { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { supplier } from '~/db/schema/supplier';

export type SelectSupplier = InferSelectModel<typeof supplier>;

// Define form schema with Zod
export const supplierFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Supplier name is required'
    })
    .max(255, {
      message: 'Supplier name must be less than 255 characters'
    }),
  contactPerson: z
    .string()
    .max(100, {
      message: 'Contact person must be less than 100 characters'
    })
    .optional(),
  email: z
    .string()
    .email({
      message: 'Invalid email format'
    })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, {
      message: 'Phone must be less than 20 characters'
    })
    .optional(),
  address: z
    .string()
    .max(500, {
      message: 'Address must be less than 500 characters'
    })
    .optional()
});
