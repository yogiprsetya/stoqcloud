import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { users } from '~/db/schema/users';
import { createInsertSchema } from 'drizzle-zod';
import { handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { and, asc, desc, ilike, eq, sql } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';
import { LIMIT_DB_ROW } from '~/config/constant';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy') // createdAt | updatedAt
  };

  let sortedBy = desc(stockTransaction.createdAt);

  const typeCondition = eq(stockTransaction.type, 'IN');
  const searchCondition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const queryFilter = and(searchCondition, typeCondition);
  const sort = params.sort || 'desc';
  const sortBy = params.sortBy || 'createdAt';

  if (sort === 'asc') {
    sortedBy = sortBy === 'updatedAt' ? asc(stockTransaction.updatedAt) : asc(stockTransaction.createdAt);
  }

  if (sort === 'desc') {
    sortedBy = sortBy === 'updatedAt' ? desc(stockTransaction.updatedAt) : desc(stockTransaction.createdAt);
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
            createdBy: stockTransaction.createdBy,
            createdAt: stockTransaction.createdAt,
            updatedAt: stockTransaction.updatedAt,
            // Only essential SKU info
            skuCode: sku.skuCode,
            skuName: sku.name,
            categoryId: sku.categoryId,
            supplierId: sku.supplierId,
            categoryName: category.name,
            supplierName: supplier.name,
            // Creator info
            createdByName: users.name
          })
          .from(stockTransaction)
          .innerJoin(sku, eq(stockTransaction.skuId, sku.id))
          .leftJoin(category, eq(sku.categoryId, category.id))
          .leftJoin(supplier, eq(sku.supplierId, supplier.id))
          .leftJoin(users, eq(stockTransaction.createdBy, users.id))
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
          name: t.skuName
        },
        supplier: {
          id: t.supplierId,
          name: t.supplierName
        },
        category: {
          id: t.categoryId,
          name: t.categoryName
        },
        createdBy: t.createdBy
          ? {
              id: t.createdBy,
              name: t.createdByName
            }
          : null
      }));

      return handleSuccessResponse(transformedTransactions, meta);
    }

    return handleExpiredSession();
  });
}

const stockInTransactionSchema = createInsertSchema(stockTransaction).omit({
  createdBy: true,
  type: true
});

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = stockInTransactionSchema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      try {
        const result = await db.transaction(async (tx) => {
          const [transaction] = await tx
            .insert(stockTransaction)
            .values({
              ...data,
              type: 'IN',
              createdBy: session.user.id,
              unitPrice: (data.unitPrice || 0).toString(),
              totalPrice: (data.totalPrice || 0).toString()
            })
            .returning();

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
