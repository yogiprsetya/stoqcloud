import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { supplier } from '~/db/schema/supplier';
import { and, asc, desc, ilike } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';
import { handleSuccessResponse } from '../handle-success-res';
import { handleExpiredSession, handleInvalidRequest } from '../handle-error-res';
import { LIMIT_DB_ROW } from '~/config/constant';
import { createInsertSchema } from 'drizzle-zod';
import { bodyParse } from '../body-parse';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort') // asc | desc
  };

  let sortedBy = desc(supplier.createdAt);

  const searchCodition = params.keyword ? ilike(supplier.name, `%${params.keyword}%`) : undefined;
  const offset = params.page ? (Number(params.page) - 1) * LIMIT_DB_ROW : 0;
  const queryFilter = and(searchCodition);
  const sort = params.sort || 'asc';

  if (sort === 'asc') {
    sortedBy = asc(supplier.createdAt);
  }

  if (sort === 'desc') {
    sortedBy = desc(supplier.createdAt);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const categories = await db.select().from(supplier).orderBy(sortedBy).offset(offset);

      const meta = await createMeta({
        table: supplier,
        page: Number(params.page || 1),
        query: queryFilter
      });

      return handleSuccessResponse(categories, meta);
    }

    return handleExpiredSession();
  });
}

const schema = createInsertSchema(supplier);

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [result] = await db.insert(supplier).values(data).returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}
