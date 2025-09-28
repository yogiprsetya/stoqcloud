import { NextRequest } from 'next/server';
import { db } from '~/db/config';
import { sku } from '~/db/schema/sku';
import { createInsertSchema } from 'drizzle-zod';
import { handleExpiredSession, handleInvalidRequest } from '~/app/api/handle-error-res';
import { handleSuccessResponse } from '~/app/api/handle-success-res';
import { bodyParse } from '~/app/api/body-parse';
import { and, asc, desc, ilike } from 'drizzle-orm';
import { requireUserAuth } from '../protect-route';
import { createMeta } from '../create-meta';

const schema = createInsertSchema(sku).omit({ createdBy: true });

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const params = {
    limit: searchParams.get('limit'),
    keyword: searchParams.get('keyword'),
    page: searchParams.get('page'),
    sort: searchParams.get('sort') // asc | desc
  };

  let sortedBy = desc(sku.createdAt);

  const limitRow = Number(params?.limit || 10);
  const searchCodition = params.keyword ? ilike(sku.name, `%${params.keyword}%`) : undefined;
  const offset = params.page ? (Number(params.page) - 1) * limitRow : 0;
  const queryFilter = and(searchCodition);
  const sort = params.sort || 'asc';

  if (sort === 'asc') {
    sortedBy = asc(sku.createdAt);
  }

  if (sort === 'desc') {
    sortedBy = desc(sku.createdAt);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const items = await db.select().from(sku).orderBy(sortedBy).offset(offset);

      const meta = await createMeta({
        table: sku,
        limit: limitRow,
        page: Number(params.page || 1),
        query: queryFilter
      });

      return handleSuccessResponse(items, meta);
    }

    return handleExpiredSession();
  });
}

export async function POST(req: NextRequest) {
  const body = await bodyParse(req);
  const { data, success, error } = schema.safeParse(body);

  if (!success) {
    return handleInvalidRequest(error);
  }

  return requireUserAuth(req, async (session) => {
    if (session) {
      const [result] = await db
        .insert(sku)
        .values({
          ...data,
          createdBy: session.user.id
        })
        .returning();

      return handleSuccessResponse(result);
    }

    return handleExpiredSession();
  });
}
