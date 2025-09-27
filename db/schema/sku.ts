import { pgTable, uuid, varchar, decimal, integer, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const sku = pgTable('sku', {
  id: uuid('id').defaultRandom().primaryKey(),
  skuCode: varchar('sku_code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  supplier: varchar('supplier', { length: 255 }),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }).notNull().default('0'),
  stock: integer('stock').notNull().default(0),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow()
});

export const skuRelations = relations(sku, ({ one }) => ({
  creator: one(users, {
    fields: [sku.createdBy],
    references: [users.id]
  })
}));
