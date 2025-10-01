import { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { category } from '~/db/schema/category';

export type SelectCategory = InferSelectModel<typeof category>;

// Define form schema with Zod
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Category name is required'
    })
    .max(100, {
      message: 'Category name must be less than 100 characters'
    }),
  description: z
    .string()
    .max(250, {
      message: 'Description must be less than 250 characters'
    })
    .optional()
});
