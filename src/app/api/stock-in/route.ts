import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { stockTransaction, stockTransactionTypeEnum } from '~/db/schema/stock-transaction';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { createInsertSchema } from 'drizzle-zod';
import { handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { and, asc, desc, ilike, eq, sql } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';
import { LIMIT_DB_ROW } from '~/config/constant';
import { z } from 'zod';

type StockTransactionType = (typeof stockTransactionTypeEnum.enumValues)[number];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy'), // createdAt | documentNumber
    type: searchParams.get('type') // IN | OUT
  };

  let sortedBy = desc(stockTransaction.createdAt);

  const searchCondition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const typeCondition = params.type
    ? eq(stockTransaction.type, params.type as StockTransactionType)
    : undefined;
  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const queryFilter = and(searchCondition, typeCondition);
  const sort = params.sort || 'desc';
  const sortBy = params.sortBy || 'createdAt';

  if (sort === 'asc') {
    sortedBy =
      sortBy === 'documentNumber' ? asc(stockTransaction.documentNumber) : asc(stockTransaction.createdAt);
  }

  if (sort === 'desc') {
    sortedBy =
      sortBy === 'documentNumber' ? desc(stockTransaction.documentNumber) : desc(stockTransaction.createdAt);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      // Optimized query with minimal fields and better performance
      const [transactions, meta] = await Promise.all([
        db
          .select({
            id: stockTransaction.id,
            skuId: stockTransaction.skuId,
            type: stockTransaction.type,
            quantity: stockTransaction.quantity,
            unitPrice: stockTransaction.unitPrice,
            totalPrice: stockTransaction.totalPrice,
            documentNumber: stockTransaction.documentNumber,
            notes: stockTransaction.notes,
            createdAt: stockTransaction.createdAt,
            updatedAt: stockTransaction.updatedAt,
            // Only essential SKU info
            skuCode: sku.skuCode,
            skuName: sku.name,
            categoryName: category.name,
            supplierName: supplier.name
          })
          .from(stockTransaction)
          .innerJoin(sku, eq(stockTransaction.skuId, sku.id))
          .leftJoin(category, eq(sku.categoryId, category.id))
          .leftJoin(supplier, eq(sku.supplierId, supplier.id))
          .where(queryFilter)
          .orderBy(sortedBy)
          .offset(offset)
          .limit(LIMIT_DB_ROW),

        // Run meta query in parallel
        createMeta({
          table: stockTransaction,
          page: Number(params.page || 1),
          query: queryFilter
        })
      ]);

      // Efficient transformation with simplified structure
      const transformedTransactions = transactions.map((t) => ({
        id: t.id,
        skuId: t.skuId,
        type: t.type,
        quantity: t.quantity,
        unitPrice: t.unitPrice,
        totalPrice: t.totalPrice,
        documentNumber: t.documentNumber,
        notes: t.notes,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        sku: {
          id: t.skuId,
          skuCode: t.skuCode,
          name: t.skuName,
          categoryName: t.categoryName,
          supplierName: t.supplierName
        }
      }));

      return handleSuccessResponse(transformedTransactions, meta);
    }

    return handleExpiredSession();
  });
}

// Schema untuk stock-in (hanya type IN)
const stockInSchema = createInsertSchema(stockTransaction, {
  type: z.enum(['IN']),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
  totalPrice: z.number().min(0, 'Total price cannot be negative'),
  documentNumber: z.string().optional(),
  notes: z.string().optional()
}).omit({ id: true, createdAt: true, updatedAt: true });

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = stockInSchema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      try {
        // Mulai transaksi database
        const result = await db.transaction(async (tx) => {
          // Insert stock transaction
          const [transaction] = await tx
            .insert(stockTransaction)
            .values({
              ...data,
              type: 'IN',
              unitPrice: data.unitPrice.toString(),
              totalPrice: data.totalPrice.toString()
            })
            .returning();

          // Update stock quantity di tabel SKU
          await tx
            .update(sku)
            .set({
              stock: sql`${sku.stock} + ${data.quantity}`,
              updatedAt: new Date()
            })
            .where(eq(sku.id, data.skuId));

          return transaction;
        });

        return handleSuccessResponse(result);
      } catch (error) {
        return handleInvalidRequest(`Error creating stock-in: ${error}`);
      }
    }

    return handleExpiredSession();
  });
}
