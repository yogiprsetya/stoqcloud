import { InferSelectModel } from 'drizzle-orm';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { z } from 'zod';

export type SelectStockTransaction = InferSelectModel<typeof stockTransaction>;

// Schema for stock-in form that matches the API
export const stockInFormSchema = z.object({
  skuId: z.string().min(1, 'SKU must be selected'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  totalPrice: z.number().min(0, 'Total price cannot be negative'),
  documentNumber: z.string().optional(),
  notes: z.string().optional()
});

export type StockInFormData = z.infer<typeof stockInFormSchema>;
