import { pgTable, uuid, varchar, decimal, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { category } from './category';
import { supplier } from './supplier';

export const sku = pgTable('sku', {
  id: uuid('id').defaultRandom().primaryKey(),
  skuCode: varchar('sku_code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  categoryId: uuid('category_id').references(() => category.id, { onDelete: 'set null' }),
  supplierId: uuid('supplier_id').references(() => supplier.id, { onDelete: 'set null' }),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }).notNull().default('0'),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow()
});

export const skuRelations = relations(sku, ({ one }) => ({
  category: one(category, {
    fields: [sku.categoryId],
    references: [category.id]
  }),
  supplier: one(supplier, {
    fields: [sku.supplierId],
    references: [supplier.id]
  })
}));
