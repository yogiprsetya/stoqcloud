import { InferSelectModel } from 'drizzle-orm';
import { sku } from '~/db/schema/sku';

export type SelectSKU = InferSelectModel<typeof sku>;
