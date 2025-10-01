import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { category } from '~/db/schema/category';
import { supplier } from '~/db/schema/supplier';
import { createInsertSchema } from 'drizzle-zod';
import { handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { and, asc, desc, ilike, eq } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';
import { LIMIT_DB_ROW } from '~/config/constant';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    sortBy: searchParams.get('sortBy') // name | createdAt
  };

  let sortedBy = desc(sku.createdAt);

  const searchCodition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const queryFilter = and(searchCodition);
  const sort = params.sort || 'asc';
  const sortBy = params.sortBy || 'createdAt';

  if (sort === 'asc') {
    sortedBy = sortBy === 'name' ? asc(sku.name) : asc(sku.createdAt);
  }

  if (sort === 'desc') {
    sortedBy = sortBy === 'name' ? desc(sku.name) : desc(sku.createdAt);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const items = await db
        .select({
          id: sku.id,
          skuCode: sku.skuCode,
          name: sku.name,
          category: {
            id: sku.categoryId,
            name: category.name
          },
          supplier: {
            id: sku.supplierId,
            name: supplier.name
          },
          costPrice: sku.costPrice,
          stock: sku.stock,
          createdAt: sku.createdAt,
          updatedAt: sku.updatedAt
        })
        .from(sku)
        .leftJoin(category, eq(sku.categoryId, category.id))
        .leftJoin(supplier, eq(sku.supplierId, supplier.id))
        .orderBy(sortedBy)
        .offset(offset)
        .limit(LIMIT_DB_ROW);

      const meta = await createMeta({
        table: sku,
        page: Number(params.page || 1),
        query: queryFilter
      });

      return handleSuccessResponse(items, meta);
    }

    return handleExpiredSession();
  });
}

const schema = createInsertSchema(sku);

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [result] = await db.insert(sku).values(data).returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}
