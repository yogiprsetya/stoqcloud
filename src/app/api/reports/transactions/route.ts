import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { stockTransaction } from '~/db/schema/stock-transaction';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { users } from '~/db/schema/users';
import { and, asc, desc, eq, ilike, sql } from 'drizzle-orm';
import { requireUserAuth } from '~/app/api/protect-route';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { handleExpiredSession } from '~/app/api/handle-error-res';
import { LIMIT_DB_ROW } from '~/config/constant';
import { createMeta } from '~/app/api/create-meta';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'), // matches SKU name
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy'), // createdAt | updatedAt | quantity
    type: searchParams.get('type'), // IN | OUT
    startDate: searchParams.get('startDate'), // ISO
    endDate: searchParams.get('endDate') // ISO
  };

  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;

  let sortedBy = desc(stockTransaction.createdAt);
  const sort = params.sort || 'desc';
  const sortBy = params.sortBy || 'createdAt';

  if (sort === 'asc') {
    if (sortBy === 'updatedAt') sortedBy = asc(stockTransaction.updatedAt);
    if (sortBy === 'createdAt') sortedBy = asc(stockTransaction.createdAt);
    if (sortBy === 'quantity') sortedBy = asc(stockTransaction.quantity);
  }

  if (sort === 'desc') {
    if (sortBy === 'updatedAt') sortedBy = desc(stockTransaction.updatedAt);
    if (sortBy === 'createdAt') sortedBy = desc(stockTransaction.createdAt);
    if (sortBy === 'quantity') sortedBy = desc(stockTransaction.quantity);
  }

  const conditions = [
    params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined,
    params.type ? eq(stockTransaction.type, params.type as 'IN' | 'OUT') : undefined,
    params.startDate ? sql`${stockTransaction.createdAt} >= ${new Date(params.startDate)}` : undefined,
    params.endDate ? sql`${stockTransaction.createdAt} <= ${new Date(params.endDate)}` : undefined
  ].filter(Boolean);

  const queryFilter = conditions.length ? and(...conditions) : undefined;

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [rows, meta] = await Promise.all([
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
            skuCode: sku.skuCode,
            skuName: sku.name,
            categoryId: sku.categoryId,
            supplierId: sku.supplierId,
            categoryName: category.name,
            supplierName: supplier.name,
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
        createMeta({ table: stockTransaction, page: Number(params.page || 1), query: queryFilter })
      ]);

      const data = rows.map((t) => ({
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
        sku: { id: t.skuId, skuCode: t.skuCode, name: t.skuName },
        supplier: t.supplierId ? { id: t.supplierId, name: t.supplierName } : null,
        category: t.categoryId ? { id: t.categoryId, name: t.categoryName } : null,
        createdBy: t.createdBy ? { id: t.createdBy, name: t.createdByName } : null
      }));

      return handleSuccessResponse(data, meta);
    }

    return handleExpiredSession();
  });
}
