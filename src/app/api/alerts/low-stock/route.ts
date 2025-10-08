import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { requireUserAuth } from '~/app/api/protect-route';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { handleExpiredSession } from '~/app/api/handle-error-res';
import { and, asc, desc, ilike, sql } from 'drizzle-orm';
import { LIMIT_DB_ROW } from '~/config/constant';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort'), // asc | desc
    threshold: searchParams.get('threshold') // integer
  };

  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const threshold = params.threshold ? Number(params.threshold) : 10;

  const searchCondition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const lowStockCondition = sql`${sku.stock} <= ${threshold}`;
  const queryFilter = and(searchCondition, lowStockCondition);

  const sortedBy = params.sort === 'desc' ? desc(sku.stock) : asc(sku.stock);

  return requireUserAuth(req, async (session) => {
    if (session) {
      const rows = await db
        .select({ id: sku.id, skuCode: sku.skuCode, name: sku.name, stock: sku.stock })
        .from(sku)
        .where(queryFilter)
        .orderBy(sortedBy)
        .offset(offset)
        .limit(LIMIT_DB_ROW);

      return handleSuccessResponse(rows, {
        currentPage: Number(params.page || 1),
        limit: LIMIT_DB_ROW,
        totalCount: rows.length,
        totalPages: rows.length < LIMIT_DB_ROW ? 1 : Number(params.page || 1) + 1
      });
    }

    return handleExpiredSession();
  });
}
