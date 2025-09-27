import { InferSelectModel } from 'drizzle-orm';
import z from 'zod';
import { sku } from '~/db/schema/sku';

export type SelectSKU = InferSelectModel<typeof sku>;

// Define form schema with Zod
export const formSchema = z.object({
  skuCode: z.string().min(1, {
    message: 'SKU Code harus diisi'
  }),
  name: z.string().min(1, {
    message: 'Nama produk harus diisi'
  }),
  category: z.string().optional(),
  supplier: z.string().optional(),
  costPrice: z.number().min(0, {
    message: 'Harga beli tidak boleh negatif'
  }),
  stock: z.number().int().min(0, {
    message: 'Stok tidak boleh negatif'
  })
});
