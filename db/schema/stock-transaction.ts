import { pgTable, uuid, varchar, integer, decimal, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sku } from './sku';

export const stockTransactionTypeEnum = pgEnum('stock_transaction_type', ['IN', 'OUT']);

export const stockTransaction = pgTable('stock_transaction', {
  id: uuid('id').defaultRandom().primaryKey(),
  skuId: uuid('sku_id')
    .references(() => sku.id, { onDelete: 'cascade' })
    .notNull(),
  type: stockTransactionTypeEnum('type').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull().default('0'),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull().default('0'),
  documentNumber: varchar('document_number', { length: 100 }), // PO Number, SO Number, etc
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow()
});

export const stockTransactionRelations = relations(stockTransaction, ({ one }) => ({
  sku: one(sku, {
    fields: [stockTransaction.skuId],
    references: [sku.id]
  })
}));
