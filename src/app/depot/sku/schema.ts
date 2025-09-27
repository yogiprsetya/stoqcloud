import { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { sku } from '~/db/schema/sku';

export type SelectSKU = InferSelectModel<typeof sku>;

// Define form schema with Zod
export const formSchema = z.object({
  skuCode: z.string().min(1, {
    message: 'SKU Code is required'
  }),
  name: z.string().min(1, {
    message: 'Product name is required'
  }),
  category: z.string().optional(),
  supplier: z.string().optional(),
  costPrice: z.number().min(0, {
    message: 'Cost price cannot be negative'
  }),
  stock: z.number().int().min(0, {
    message: 'Stock cannot be negative'
  })
});
