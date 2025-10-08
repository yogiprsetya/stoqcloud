import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { and, asc, desc, ilike, sql } from 'drizzle-orm';
import { requireUserAuth } from '~/app/api/protect-route';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { handleExpiredSession } from '~/app/api/handle-error-res';
import { LIMIT_DB_ROW } from '~/config/constant';
import { createMeta } from '~/app/api/create-meta';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy') // name | createdAt | stock
  };

  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;

  let sortedBy = asc(sku.name);
  const sort = params.sort || 'asc';
  const sortBy = params.sortBy || 'name';

  if (sort === 'asc') {
    if (sortBy === 'createdAt') sortedBy = asc(sku.createdAt);
    if (sortBy === 'stock') sortedBy = asc(sku.stock);
    if (sortBy === 'name') sortedBy = asc(sku.name);
  }

  if (sort === 'desc') {
    if (sortBy === 'createdAt') sortedBy = desc(sku.createdAt);
    if (sortBy === 'stock') sortedBy = desc(sku.stock);
    if (sortBy === 'name') sortedBy = desc(sku.name);
  }

  const searchCondition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const queryFilter = and(searchCondition);

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [rows, meta] = await Promise.all([
        db
          .select({
            id: sku.id,
            skuCode: sku.skuCode,
            name: sku.name,
            stock: sku.stock,
            costPrice: sku.costPrice,
            categoryId: sku.categoryId,
            categoryName: category.name,
            supplierId: sku.supplierId,
            supplierName: supplier.name,
            inventoryValue: sql<string>`(${sku.costPrice}::numeric * ${sku.stock})::text`
          })
          .from(sku)
          .leftJoin(category, sql`${category.id} = ${sku.categoryId}`)
          .leftJoin(supplier, sql`${supplier.id} = ${sku.supplierId}`)
          .where(queryFilter)
          .orderBy(sortedBy)
          .offset(offset)
          .limit(LIMIT_DB_ROW),
        createMeta({ table: sku, page: Number(params.page || 1), query: queryFilter })
      ]);

      const data = rows.map((r) => ({
        id: r.id,
        skuCode: r.skuCode,
        name: r.name,
        stock: r.stock,
        costPrice: r.costPrice,
        inventoryValue: r.inventoryValue,
        category: r.categoryId
          ? {
              id: r.categoryId,
              name: r.categoryName
            }
          : null,
        supplier: r.supplierId
          ? {
              id: r.supplierId,
              name: r.supplierName
            }
          : null
      }));

      return handleSuccessResponse(data, meta);
    }

    return handleExpiredSession();
  });
}
